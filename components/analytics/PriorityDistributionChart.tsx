import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Order, OrderPriority } from '../../types';

interface PriorityDistributionChartProps {
  orders: Order[];
}

const COLORS: Record<OrderPriority, string> = {
  [OrderPriority.URGENT]: '#EF4444', // Red
  [OrderPriority.HIGH]: '#F59E0B',   // Yellow/Orange
  [OrderPriority.MEDIUM]: '#3B82F6', // Blue
  [OrderPriority.LOW]: '#10B981',    // Green
};

const PriorityDistributionChart: React.FC<PriorityDistributionChartProps> = ({ orders }) => {

  const data = useMemo(() => {
    const counts = orders.reduce((acc, order) => {
      acc[order.priority] = (acc[order.priority] || 0) + 1;
      return acc;
    }, {} as Record<OrderPriority, number>);

    return Object.entries(counts).map(([name, value]) => ({
      name: name as OrderPriority,
      value,
    }));
  }, [orders]);

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-text-secondary">No data to display</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          stroke="#1F2937"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip
           contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#F9FAFB' }}
        />
        <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: '12px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PriorityDistributionChart;