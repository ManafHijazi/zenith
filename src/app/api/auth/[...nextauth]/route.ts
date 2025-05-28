import type { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const creds = credentials as { username: string; password: string };
        if (
          creds?.username === process.env.ADMIN_USER &&
          creds.password === process.env.ADMIN_PASS
        ) {
          return { id: creds.username, name: 'Admin' };
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
