/*
 * This file contains the authentication flow for the project
 * It is a requirement by the next-auth framework component
 * 
 * It is used by the actions.ts file to authenticate a user
 * 
 * It is also used by the client components to check if the user is authenticated
 * 
 * FIXME : The authentication flow is not complete and there's a temporary workaround relying in a hardcoded user
 * FIXME - better use - OAuth https://authjs.dev/getting-started/authentication/oauth
 * Avoid server only dependency from client
 * import { getUser } from '@/app/lib/data';
 */
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { User } from '@/app/lib/dataschemas';

 
export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          // FIXME - added a workaround mock login, somehow we cannot fetch the user from the database
          //const user = await getUser(email, password);
          const user = {
            id: '1',
            name: 'Demo user',
            email: 'demouser@gmail.com',
            encpassword: '$2a$04$G7t5TzOwenlV2cxjTD9p7eUHIG.GfMlort2LGuzYiFCOdTHtPjzPy',
            emailVerified: new Date(),
          }
          if (!user) return null;
          return user as User;
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Alternative is database but jwt is easier to manage as will be just a cookie
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token, user }) {
      session.user = token.user as User
      console.log('session: ', JSON.stringify(session));
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user;
      }
      console.log('token: ', JSON.stringify(token));
      return token;
    },
  },
});

/*
export const GET = auth;
export const POST = auth;
*/
