import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define quais rotas são protegidas
  const isAdminRoute = path.startsWith('/admin') || path.startsWith('/editor');
  const isDashboardRoute = path.startsWith('/dashboard');

  // Recupera o token de sessão ou cookie de autenticação do usuário
  const userRole = request.cookies.get('user_role')?.value;
  const isAuthenticated = request.cookies.get('auth_token')?.value;

  if (isAdminRoute) {
    if (!isAuthenticated || userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (isDashboardRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Configura em quais caminhos o middleware deve rodar
export const config = {
  matcher: [
    '/admin/:path*',
    '/editor/:path*',
    '/dashboard/:path*',
  ],
};
