
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Order, OrderStatus } from '../../types';

interface PerformanceChartProps {
  orders: Order[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ orders }) => {
  const processData = (orders: Order[]) => {
    const dataByDay: { [key: string]: { name: string; successful: number; failed: number } } = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('en-CA'); // YYYY-MM-DD
      if (!dataByDay[date]) {
        dataByDay[date] = { name: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), successful: 0, failed: 0 };
      }
      if (order.status === OrderStatus.SUCCESSFUL) {
        dataByDay[date].successful += 1;
      } else if (order.status === OrderStatus.FAILED) {
        dataByDay[date].failed += 1;
      }
    });

    return Object.values(dataByDay).sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  };

  const chartData = processData(orders);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#F9FAFB' }}
        />
        <Legend wrapperStyle={{ color: '#9CA3AF' }} />
        <Bar dataKey="successful" fill="#10B981" name="Successful" />
        <Bar dataKey="failed" fill="#EF4444" name="Failed" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;
