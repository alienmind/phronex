/*
 * This file contains the configuration for the authentication flow
 * It is used by auth.ts
 * 
 * One key decission is to avoid using the database to store the user session
 * Instead of that we use the JWT token
 * 
 * This is a temporary solution until we implement the full OAuth authentication flow
 */
import type { NextAuthConfig } from 'next-auth';
 
/* The logic is:
 * /login is not protected
 * Everything else (starting with /dashboard) is a protected route
 * and requires authentication
 */
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      let ret = false;
      let redirect = false;

      console.log("AUTH: " + JSON.stringify(auth) + " " + JSON.stringify(nextUrl));
      const isLoggedIn = !!auth?.user;

      // All routes except login are protected
      const isOnProtected = !(nextUrl.pathname.startsWith('/login'));

      if (isOnProtected) {
        if (isLoggedIn) return true;
        else ret = false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        ret = true;
        redirect = true;
      }
      ret = true;

      console.log("AUTH: ret=" + ret + " redirect=" + redirect + " auth=" + JSON.stringify(auth) + " nextUrl=" + JSON.stringify(nextUrl));
      if (redirect) return Response.redirect(new URL('/dashboard', nextUrl));
      return ret;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
