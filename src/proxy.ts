import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from "jwt-decode";

interface UserInterface {
  role: "ADMIN" | "DOCTOR" | "PATIENT";
}

const authRoutes = ['/login', '/register', '/forget-password'];

const roleBaseRoutes = {
  ADMIN: ['/admin/dashboard'],
  DOCTOR: ['/doctor/dashboard'],
  PATIENT: ['/dashboard']
};


export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // স্ট্যাটিক ফাইল ইগনোর করা
  if (
    pathname.startsWith('/_next') || 
    pathname.includes('.') || 
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

const accessToken = request.cookies.get('accessToken')?.value;
  

  let user: UserInterface | null = null;
  if (accessToken) {
    try {
      user = jwtDecode(accessToken);
    } catch (error) {
      console.log("Token decode error", error);
    }
  }

  // ১. হোমপেজে সবাইকে ঢুকতে দাও
  if (pathname === '/') {
    return NextResponse.next();
  }

  // ২. লগইন ছাড়া প্রাইভেট রুটে বাধা
  if (!user && !authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url));
  }

  // ৩. লগইন করা থাকলে লগইন পেজে ঢুকতে বাধা
  if (user && authRoutes.includes(pathname)) {
    const dashboard = roleBaseRoutes[user.role][0];
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  // ৪. রোল অনুযায়ী এক্সেস কন্ট্রোল
  if (user) {
    const allowedRoutes = roleBaseRoutes[user.role];
    const isAllowed = allowedRoutes.some(route => pathname.startsWith(route));

    if (!isAllowed && !authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

// কনফিগ
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};