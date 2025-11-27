
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BreakdownBarChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

const BreakdownBarChart: React.FC<BreakdownBarChartProps> = ({ data }) => {
    if(!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-text-secondary">No data to display</div>;
    }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis type="number" hide />
        <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#9CA3AF" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            width={80}
        />
        <Tooltip
          cursor={{fill: '#374151'}}
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
          }}
        />
        <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BreakdownBarChart;