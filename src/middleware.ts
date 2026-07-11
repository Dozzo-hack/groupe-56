import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose'; 

export async function middleware(request: NextRequest) {
  // CORRECTION : On cherche 'token', pas 'auth_token'
  const tokenCookie = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin') || pathname.includes('/admin-dashboard');
  const isTeacherRoute = pathname.startsWith('/teacher') || pathname.includes('/teacher-dashboard');
  const isStudentRoute = pathname.startsWith('/student') || pathname.includes('/dashboard');

  if (isAdminRoute || isTeacherRoute || isStudentRoute) {
    if (!tokenCookie) {
      // Pas de token -> Redirection immédiate
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      // On lit la valeur du cookie trouvé
      const { payload } = await jose.jwtVerify(tokenCookie.value, secret);
      
      const userRole = payload.role as string;

      // Contrôle des accès par Rôle (RBAC)
      if (isAdminRoute && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (isTeacherRoute && userRole !== 'teacher') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (isStudentRoute && userRole !== 'student') {
        return NextResponse.redirect(new URL('/', request.url));
      }

    } catch (error) {
      // Token invalide ou corrompu -> Nettoyage et redirection
      const response = NextResponse.redirect(new URL('/', request.url));
      // CORRECTION : On supprime bien 'token'
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin-dashboard/:path*',
    '/teacher-dashboard/:path*',
    '/dashboard/:path*', // Redirection de l'étudiant
  ],
};