export const runtime = 'nodejs';

import { connectToDatabase } from '@/lib/mongodb';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ObjectId } from 'mongodb';
import { OrderDetails } from '@/lib/types';

interface Props {
  searchParams: { id?: string };
}

export default async function OrderConfirmation({ searchParams }: Props) {
  const { id } = searchParams;
  if (!id) return notFound();

  const { db } = await connectToDatabase();

  if (!ObjectId.isValid(id)) return notFound();

  const doc = await db.collection('orders').findOne<OrderDetails>({ _id: new ObjectId(id) });
  if (!doc) return notFound();

  const order: OrderDetails = {
    id,
    ...doc,
  } as any;

  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6">Thank you for your order!</h1>

      <p className="mb-4">
        Order&nbsp;
        <span className="font-mono">#{id}</span> –{' '}
        <span className="capitalize">{order.status}</span>
      </p>

      <ul className="mb-6 space-y-2">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.quantity}× {item.name}
          </li>
        ))}
      </ul>

      <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>

      <Link href="/" className="mt-8 inline-block text-primary-600 underline">
        Back to home
      </Link>
    </main>
  );
}
