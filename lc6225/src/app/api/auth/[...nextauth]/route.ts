import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

// Force this route to run in the Node.js runtime (Edge runtime blocks "eval" used by next-auth/mongodb)
export const runtime = 'nodejs';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
