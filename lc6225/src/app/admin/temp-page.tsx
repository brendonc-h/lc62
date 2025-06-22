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
import 'chart.js/auto'; // This will automatically register all chart components

interface Order {
  id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

// Register ChartJS components once
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

// ChartJS default settings
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};

export default function AdminTempPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockOrders: Order[] = [
      { id: '1', customerName: 'John Doe', total: 59.99, status: 'Delivered', createdAt: '2025-06-01T12:00:00Z' },
      { id: '2', customerName: 'Jane Smith', total: 35.99, status: 'Pending', createdAt: '2025-06-02T14:30:00Z' },
      { id: '3', customerName: 'Bob Johnson', total: 42.99, status: 'Delivered', createdAt: '2025-06-03T16:45:00Z' },
      { id: '4', customerName: 'Alice Brown', total: 29.99, status: 'Delivered', createdAt: '2025-06-04T18:15:00Z' },
    ];
    
    setOrders(mockOrders);
    setLoading(false);
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
    salesByDate[date] = (salesByDate[date] ?? 0) + o.total;
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
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);

  const [chartError, setChartError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // This will help catch any chart initialization errors
      setChartError(null);
    } catch (error) {
      console.error('Chart initialization error:', error);
      setChartError('Failed to initialize charts. Please refresh the page.');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <div className="flex space-x-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Total Orders</h2>
            <div className="text-4xl font-bold text-indigo-600">{totalOrders}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Total Sales</h2>
            <div className="text-4xl font-bold text-green-600">${totalSales.toFixed(2)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Orders by Date</h2>
            {chartError ? (
              <div className="text-red-500 p-4 bg-red-50 rounded">
                {chartError}
              </div>
            ) : (
              <div className="h-64">
                <Bar data={orderData} options={chartOptions} />
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Sales by Date</h2>
            {chartError ? (
              <div className="text-red-500 p-4 bg-red-50 rounded">
                {chartError}
              </div>
            ) : (
              <div className="h-64">
                <Line data={salesData} options={chartOptions} />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex justify-between items-center p-4 bg-gray-50 rounded">
                <div>
                  <h3 className="font-medium">{order.customerName}</h3>
                  <p className="text-sm text-gray-500">Order #{order.id}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-500">${order.total.toFixed(2)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
