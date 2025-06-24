import { FC } from 'react';

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

export const OrderStatusBadge: FC<OrderStatusBadgeProps> = ({ status, className = '' }) => {
  const statusColors: Record<string, string> = {
    received: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusText: Record<string, string> = {
    received: 'Order Received',
    preparing: 'Preparing',
    ready: 'Ready for Pickup',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusColors[status] || 'bg-gray-100 text-gray-800'
      } ${className}`}
    >
      {statusText[status] || status}
    </span>
  );
};
