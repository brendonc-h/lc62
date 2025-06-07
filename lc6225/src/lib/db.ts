import { MongoClient, Db } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

const uri = process.env.MONGODB_URI || '';
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the connection across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Database collections
export const getDb = async (): Promise<Db> => {
  const client = await clientPromise;
  return client.db();
};

// Collections
export const getUsersCollection = async () => {
  const db = await getDb();
  return db.collection('users');
};

export const getPasswordResetTokensCollection = async () => {
  const db = await getDb();
  return db.collection('passwordResetTokens');
};

export default clientPromise;
