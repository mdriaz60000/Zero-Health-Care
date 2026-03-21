/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const loginUser = async (_currentState: any, formData: any): Promise<any> => {
  const redirectTo: string | null = formData.get("redirect");
  const loginData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const res = await fetch("http://localhost:5000/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(loginData),
    headers: { "Content-Type": "application/json" },
  });

  const response = await res.json();

  if (response.success) {
    const cookieStore = await cookies();

    //  getSetCookie() — multiple Set-Cookie headers 
    const setCookies = res.headers.getSetCookie();
    // console.log("Raw Set-Cookie headers:", setCookies);

    // Also store tokens from response data if available
    if (response.data?.accessToken) {
      cookieStore.set("accessToken", response.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
      });
    }

    if (response.data?.refreshToken) {
      cookieStore.set("refreshToken", response.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    setCookies.forEach((cookie) => {
      const parts = cookie.split(";").map((p) => p.trim());
      const [name, value] = parts[0].split("=");

      if (name === "accessToken" || name === "refreshToken") {
        cookieStore.set(name, value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "lax",
          maxAge:
            name === "accessToken" ? 60 * 60 * 24 : 60 * 60 * 24 * 7,
        });
      }
    });

    // ✅ Token decode করে role বের করুন - FIXED: Get token from response.data
    const accessToken = response.data?.accessToken;
    
    if (accessToken) {
      const decoded: any = jwtDecode(accessToken);
      const role = decoded?.role as string;

      // console.log("Decoded role:", role);

      // Role based redirect
      const roleRedirectMap: Record<string, string> = {
        ADMIN: "/admin/dashboard",
        DOCTOR: "/doctor/dashboard",
        PATIENT: "/dashboard",
      };

      // FIXED: Complete the redirect logic
      if (redirectTo) {
        redirect(redirectTo);
      } else if (role && roleRedirectMap[role]) {
        redirect(roleRedirectMap[role]);
      } else {
        redirect("/"); 
      }
    }
  }

  return response;
};