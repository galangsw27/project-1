import { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getDictionary } from '@/locales/dictionary'

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        return { ...token, user: { ...user as User } }
      }

      return token
    },
    async session({ session, token }) {
      // console.log('ini Session', token.user.authToken)
      return { ...session, user: token.user }


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
          return null
        }
        const { email, password } = credentials

        // Replace with real authentication here
        // Replace with real authentication via API
        const response = await fetch('http://localhost:5001/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()
        console.log(data.token)
    
        const dict = await getDictionary()

        // console.log(response.ok)

        if (!response.ok || !data.token) {
          throw new Error(dict.login.message.auth_failed)
        }

        return {
          id: 1,
          name: 'Name',
          username: 'Username',
          email: email,
          avatar: '/assets/img/avatars/8.jpg',
          authToken: data.token
        }
      },
    }),
  ],
}
