/*
 * This file contains the middleware for the project
 * It is used to protect the routes that require authentication
 * Additionally, some excluded patterns are defined here to allow
 * accessing APIs, static files, images, etc.
 */
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const middleware = NextAuth(authConfig).auth;

export const config = {
  matcher: ['/((?!api|slides|_next/static|_next/image|.*\\.png$).*)'],
}; 
