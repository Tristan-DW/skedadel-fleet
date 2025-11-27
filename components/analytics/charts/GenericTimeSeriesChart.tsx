
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Order } from '../../../types';

interface GenericTimeSeriesChartProps {
  orders: Order[];
}

const GenericTimeSeriesChart: React.FC<GenericTimeSeriesChartProps> = ({ orders }) => {
  
  const chartData = useMemo(() => {
    const dataByDay: { [key: string]: { date: string; orders: number } } = {};
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    for (let i = 0; i < 30; i++) {
        const date = new Date(thirtyDaysAgo);
        date.setDate(date.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        dataByDay[dateKey] = { date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), orders: 0 };
    }

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      if (orderDate >= thirtyDaysAgo) {
          const dateKey = orderDate.toISOString().split('T')[0];
          if (dataByDay[dateKey]) {
              dataByDay[dateKey].orders += 1;
          }
      }
    });

    return Object.values(dataByDay);
  }, [orders]);


  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
          }}
        />
        <Area type="monotone" dataKey="orders" stroke="#EF4444" fillOpacity={1} fill="url(#colorUv)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default GenericTimeSeriesChart;