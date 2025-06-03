import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

// Extend the session type to include our custom fields
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      points: number;
    };
  }
}

interface UserDocument {
  _id: ObjectId;
  email: string;
  points: number;
  updatedAt: Date;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const amount = Number(data?.amount);
    
    if (isNaN(amount) || amount <= 0 || !Number.isInteger(amount)) {
      return NextResponse.json(
        { message: 'Invalid amount. Please provide a positive number.' },
        { status: 400 }
      );
    }

    // Get database connection
    const { db } = await connectToDatabase();
    
    // Update user's points
    const result = await db.collection<UserDocument>('users').findOneAndUpdate(
      { email: session.user.email },
      { 
        $inc: { points: amount },
        $set: { updatedAt: new Date() }
      },
      { 
        returnDocument: 'after',
        projection: { points: 1, _id: 0 }
      }
    );

    if (!result.value) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Points updated successfully',
        newPoints: result.value.points 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating points:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
