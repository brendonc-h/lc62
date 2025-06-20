export const runtime = 'nodejs';

import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';


// Extend the built-in session and user types
declare module 'next-auth' {
  interface User {
    id: string;
    points: number;
    role: string;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      points: number;
      role: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Reduce frequency of checking session to prevent loops
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
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
          role: user.role || 'customer', // Default to customer if role not set
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.points = user.points;
        token.role = user.role;
        
        // For backward compatibility - if there's no role set but email is in admin list
        if (!token.role) {
          const ADMIN_EMAILS = ['admin@example.com', 'brendon1798@gmail.com', 'brendon.curry-hobbs@hhsystems.org'];
          if (typeof user.email === 'string' && ADMIN_EMAILS.includes(user.email)) {
            token.role = 'admin';
          } else {
            token.role = 'customer';
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.points = token.points as number;
        session.user.role = (token.role as string) || 'customer';
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
