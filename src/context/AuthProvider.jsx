import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { userService } from '../services/userService';
import { errorService } from '../services/errorService';
import { useUIStore } from '../store/useUIStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { showToast } = useUIStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const profile = await userService.getUserProfile(user);
          setCurrentUser(profile);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        errorService.handle(err, "na inicialização do auth");
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithProvider = useCallback(async (provider, providerName) => {
    try {
      await signInWithPopup(auth, provider);
      showToast("Bem-vindo de volta, Player 1! 🎮");
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') return;
      errorService.handle(err, "no login via popup");
      
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/web-storage-unsupported') {
        showToast("Redirecionando para login seguro...", "info");
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectErr) {
          errorService.handle(redirectErr, "no login via redirect");
          showToast(`Falha total ao autenticar com ${providerName}.`, "error");
        }
      } else {
        showToast(`Falha na autenticação com ${providerName}.`, "error");
      }
    }
  }, [showToast]);

  const login = useCallback(() => loginWithProvider(googleProvider, "Google"), [loginWithProvider]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      showToast("Sessão encerrada. Até a próxima!");
    } catch (err) {
      showToast("Erro ao sair.", "error");
    }
  }, [showToast]);

  const handleUpdateProfile = useCallback(async (data) => {
    if (!currentUser) return;
    try {
      await userService.updateProfile(currentUser.id, data);
      setCurrentUser(prev => ({ ...prev, ...data }));
      showToast("Perfil atualizado com sucesso! 🎮");
    } catch (err) {
      showToast("Erro ao atualizar perfil.", "error");
    }
  }, [currentUser, showToast]);

  const value = useMemo(() => ({
    currentUser,
    authLoading,
    login,
    handleLogout,
    handleUpdateProfile
  }), [currentUser, authLoading, login, handleLogout, handleUpdateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
