import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc, updateDoc, increment, collection, getDocs } from 'firebase/firestore';
import { cn } from '../lib/utils';

export default function DebugPage() {
  const { currentUser, authLoading } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (label: string, status: 'success' | 'error' | 'info', message: string) => {
    setResults(prev => [...prev, { label, status, message, time: new Date().toLocaleTimeString() }]);
  };

  const runDiagnostics = async () => {
    setResults([]);
    setIsRunning(true);

    try {
      // 1. Check Auth
      addResult('Autenticação', authLoading ? 'info' : currentUser ? 'success' : 'error', 
        authLoading ? 'Carregando...' : currentUser ? `Logado como: ${currentUser.id}` : 'Não autenticado!');

      if (!currentUser) {
        addResult('Diagnóstico Abortado', 'error', 'Você precisa estar logado para testar');
        setIsRunning(false);
        return;
      }

      // 2. Test write to users collection
      addResult('Teste de Escrita', 'info', 'Tentando escrever em users collection...');
      try {
        const userRef = doc(db, 'users', currentUser.id);
        await setDoc(userRef, { 
          testWrite: new Date().toISOString(),
          debugCheck: true 
        }, { merge: true });
        addResult('Teste de Escrita - users', 'success', 'Escrita bem-sucedida!');
      } catch (e: any) {
        addResult('Teste de Escrita - users', 'error', `Erro: ${e.message}`);
      }

      // 3. Test read from users
      addResult('Teste de Leitura', 'info', 'Tentando ler dados do usuário...');
      try {
        const userRef = doc(db, 'users', currentUser.id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          addResult('Teste de Leitura - users', 'success', `Dados encontrados: ${JSON.stringify(userSnap.data()).substring(0, 100)}...`);
        } else {
          addResult('Teste de Leitura - users', 'info', 'Documento não existe ainda');
        }
      } catch (e: any) {
        addResult('Teste de Leitura - users', 'error', `Erro: ${e.message}`);
      }

      // 4. List posts collection
      addResult('Listando Posts', 'info', 'Tentando listar posts...');
      try {
        const postsRef = collection(db, 'posts');
        const querySnapshot = await getDocs(postsRef);
        addResult('Listando Posts', 'success', `${querySnapshot.size} posts encontrados`);
      } catch (e: any) {
        addResult('Listando Posts', 'error', `Erro: ${e.message}`);
      }

      // 5. Test write to posts (if exists)
      addResult('Teste Curtida', 'info', 'Tentando simular toggle de like...');
      try {
        const postsRef = collection(db, 'posts');
        const querySnapshot = await getDocs(postsRef);
        
        if (querySnapshot.size > 0) {
          const firstPostId = querySnapshot.docs[0].id;
          const postRef = doc(db, 'posts', firstPostId);
          
          // Tenta incrementar likes
          await updateDoc(postRef, {
            testIncrement: increment(1),
            testUpdate: new Date().toISOString()
          });
          
          addResult('Teste Curtida', 'success', `Incremento bem-sucedido no post ${firstPostId}`);
        } else {
          addResult('Teste Curtida', 'info', 'Nenhum post disponível para testar');
        }
      } catch (e: any) {
        addResult('Teste Curtida', 'error', `Erro: ${e.message}`);
      }

      // 6. Check Firestore rules
      addResult('Permissões', 'info', 'Se os testes acima falharam, verifique suas regras de Firestore');

      addResult('Diagnóstico Completo', 'success', 'Teste finalizado!');
    } catch (e: any) {
      addResult('Erro Geral', 'error', `${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔧 Debug - Teste de Persistência</h1>

        <div className="mb-8 p-6 bg-gray-800 rounded-lg border-2 border-gray-700">
          <h2 className="text-xl font-bold mb-4">Status Atual</h2>
          <p className="mb-2">
            <strong>Autenticado:</strong>{' '}
            <span className={currentUser ? 'text-green-400' : 'text-red-400'}>
              {currentUser ? 'Sim ✅' : 'Não ❌'}
            </span>
          </p>
          <p className="mb-4">
            <strong>User ID:</strong> <code className="bg-gray-900 p-1 rounded">{currentUser?.id || 'N/A'}</code>
          </p>
          <button
            onClick={runDiagnostics}
            disabled={isRunning || !currentUser}
            className={cn(
              'px-6 py-2 font-bold rounded',
              isRunning
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
            )}
          >
            {isRunning ? 'Testando...' : 'Executar Diagnóstico'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold mb-4">Resultados do Teste:</h2>
            {results.map((result, idx) => (
              <div
                key={idx}
                className={cn(
                  'p-4 rounded-lg border-2',
                  result.status === 'success'
                    ? 'bg-green-900/20 border-green-500 text-green-300'
                    : result.status === 'error'
                    ? 'bg-red-900/20 border-red-500 text-red-300'
                    : 'bg-blue-900/20 border-blue-500 text-blue-300'
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <strong>{result.label}</strong>
                    <p className="text-sm mt-1">{result.message}</p>
                  </div>
                  <span className="text-xs opacity-60">{result.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 bg-gray-800 rounded-lg border-2 border-gray-700">
          <h2 className="text-xl font-bold mb-4">📋 Guia de Troubleshooting</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-bold text-yellow-400 mb-2">❌ Se falhar "Teste de Escrita - users":</h3>
              <p>As regras de Firestore estão bloqueando escrita. Vá para Firebase Console → Firestore → Rules e verifique se você tem permissão para escrever em users/[seu-id]</p>
            </div>
            <div>
              <h3 className="font-bold text-yellow-400 mb-2">❌ Se falhar "Listando Posts":</h3>
              <p>As regras estão bloqueando leitura em posts. Verifique se a collection "posts" existe e se você pode ler.</p>
            </div>
            <div>
              <h3 className="font-bold text-yellow-400 mb-2">❌ Se falhar "Teste Curtida":</h3>
              <p>Você não tem permissão para atualizar posts. Verifique rules para posts/docId</p>
            </div>
            <div>
              <h3 className="font-bold text-green-400 mb-2">✅ Se todos passarem:</h3>
              <p>As regras estão ok! O problema está em outro lugar. Verifique o console (F12) por erros nas mutações.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-800 rounded-lg border-2 border-gray-700">
          <h2 className="text-xl font-bold mb-4">📝 Padrão de Regras Recomendado</h2>
          <pre className="bg-gray-900 p-4 rounded text-xs overflow-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Posts são públicos para leitura
    match /posts/{postId} {
      allow read: if true;
      // Qualquer usuário autenticado pode escrever
      allow write: if request.auth != null;
    }
    
    // Comentários
    match /posts/{postId}/comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.authorId;
    }
  }
}
`}
          </pre>
        </div>
      </div>
    </div>
  );
}
