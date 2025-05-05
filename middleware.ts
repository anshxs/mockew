import { NextResponse, NextRequest } from 'next/server';
import { stackServerApp } from './stack';

export async function middleware(req: NextRequest) {
    const user = await stackServerApp.getUser();

    // Allow access to the home route
    

    // Redirect unauthenticated users to the home page
    if (!user) {
        return NextResponse.redirect(new URL('/handler/sign-in', req.url));
    }

    return NextResponse.next();
}

// Apply middleware to all routes except for static assets and the home route
export const config = {
    matcher: '/dashboard/:path*',
};