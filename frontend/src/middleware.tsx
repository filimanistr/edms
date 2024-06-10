import type { NextFetchEvent, NextRequest } from 'next/server'


export default function authenticationMiddleware(request: NextRequest, event: NextFetchEvent) {
  // Checks if the user is logged in, если нет то редирект на страницу логина
  let token = request.cookies.get("token");

  if (token === undefined) {
    if (!request.nextUrl.pathname.startsWith('/account/auth')) {
      return Response.redirect(new URL('account/auth/', request.url));
    }
  }

  // Если пользователь уже зареган, выкидываем его из страницы регистрации
  if (request.nextUrl.pathname.startsWith('/account/auth')) {
    if (token != undefined) {
      return Response.redirect(new URL('/', request.url));
    }
  }
}


export const config = {
    matcher: ['/templates/:path*',
            '/contracts/:path*',
            '/services/:path*',
            '/counterparties/:path*',
            '/account/:path*',
            '/'],
};
