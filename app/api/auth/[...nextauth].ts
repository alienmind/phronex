import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import Credentials from 'next-auth/providers/credentials';
// FIXME - better use - OAuth https://authjs.dev/getting-started/authentication/oauth
import { z } from 'zod';
import { getUser } from '@/app/lib/data'
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email, password);
          if (!user) return null;
          return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});

// These are required for Next.js 13+ App Router
export const GET = auth;
export const POST = auth;