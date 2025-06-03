import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { connectToDatabase } from './mongodb';

// Extend the built-in session and user types
declare module 'next-auth' {
  interface User {
    id: string;
    points: number;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      points: number;
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const { email, password } = credentials;
        const { db } = await connectToDatabase();

        // Find user by email
        const user = await db.collection('users').findOne({
          email: email.toLowerCase(),
        });

        if (!user) {
          throw new Error('No user found with this email');
        }


        // Check password
        const isValid = await compare(password, user.password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        // Return user data without the password
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          points: user.points || 0,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.points = user.points;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.points = token.points as number;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
  debug: process.env.NODE_ENV === 'development',
};
