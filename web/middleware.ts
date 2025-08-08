

import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value || '';

    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');
    const isProtectedRoute = !isAuthPage;

    if ( isProtectedRoute && !token ) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if ( isAuthPage && token ) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher : [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};