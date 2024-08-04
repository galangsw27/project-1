import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getDictionary } from '@/locales/dictionary';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        return { ...token, user: { ...user as User } };
      }
      return token;
    },
    async session({ session, token }) {
      return { ...session, user: token.user };
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'string' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        const { email, password } = credentials;

        // Replace with real authentication via API
        const response = await fetch(`${baseURL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        const dict = await getDictionary();
        if (!response.ok || !data.token) {
          throw new Error(dict.login.message.auth_failed);
        }

        const meResponse = await fetch(`${baseURL}/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!meResponse.ok) {
          throw new Error(dict.login.message.auth_failed);
        }

        const dataMe = await meResponse.json();
     
        return {
          id: dataMe?.user?.id, // Assuming 'id' exists in the response
          email: email,
          role: dataMe?.user?.role,
          avatar: '/assets/img/avatars/8.jpg',
          authToken: data.token,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    maxAge: 60 * 60, // 1 hour in seconds
  },
};
