/**
 * Serviço centralizado para tratamento de erros.
 * Elimina console.logs espalhados e padroniza mensagens para o usuário.
 */
export const errorService = {
  /**
   * Processa um erro e retorna uma mensagem amigável.
   * @param {any} error - O objeto de erro original
   * @param {string} context - Onde o erro ocorreu (ex: "ao salvar post")
   * @param {Function | null} toastFn - Opcional: função showToast para exibir alerta imediato
   */
  handle: (error: any, context = "", toastFn: ((message: string, type: 'error' | 'success') => void) | null = null): string | null => {
    // Em desenvolvimento, podemos manter um log controlado, 
    // mas em produção isso poderia ser enviado para um serviço como Sentry.
    const isDev = import.meta.env.DEV;
    
    let userMessage = `Ocorreu um erro inesperado ${context}.`;
    const errorCode = error?.code || error?.message;

    // Tradução de erros comuns do Firebase
    if (errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password") {
      userMessage = "Credenciais inválidas. Verifique seu login.";
    } else if (errorCode === "auth/network-request-failed") {
      userMessage = "Falha na conexão. Verifique sua internet.";
    } else if (errorCode === "permission-denied") {
      userMessage = "Você não tem permissão para realizar esta ação.";
    } else if (errorCode === "auth/popup-closed-by-user") {
      return null; // Ignora silenciando o erro se o usuário apenas fechou o modal
    }

    if (isDev) {
      // Em produção, isso ficaria vazio ou enviaria para um serviço de monitoramento.
      // eslint-disable-next-line no-console
      console.error(`[ErrorService] Erro ${context}:`, error);
    }

    if (toastFn) {
      toastFn(userMessage, "error");
    }

    return userMessage;
  }
};
