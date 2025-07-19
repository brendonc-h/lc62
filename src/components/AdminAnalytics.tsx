'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: string;
};

export default function AdminAnalytics() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/admin/orders');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const ordersByDate: Record<string, number> = {};
  const salesByDate: Record<string, number> = {};
  orders.forEach((o) => {
    const date = new Date(o.createdAt).toISOString().split('T')[0];
    ordersByDate[date] = (ordersByDate[date] ?? 0) + 1;
    salesByDate[date] = (salesByDate[date] ?? 0) + (o.total || 0);
  });

  const orderData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Orders',
        data: last7Days.map((d) => ordersByDate[d] || 0),
        backgroundColor: 'rgba(75, 85, 99, 0.2)',
        borderColor: 'rgb(75, 85, 99)',
        borderWidth: 2,
      },
    ],
  };

  const salesData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Sales ($)',
        data: last7Days.map((d) => salesByDate[d] || 0),
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 2,
      },
    ],
  };

  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-indigo-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-sm text-gray-500">Total Orders</h4>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-sm text-gray-500">Total Sales</h4>
          <p className="text-3xl font-bold">${typeof totalSales === 'number' ? totalSales.toFixed(2) : '0.00'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="mb-4 font-medium">Orders (Last 7 Days)</h4>
          <div className="h-64">
            <Bar data={orderData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="mb-4 font-medium">Sales (Last 7 Days)</h4>
          <div className="h-64">
            <Line data={salesData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
}
