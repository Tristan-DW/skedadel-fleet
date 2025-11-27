import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBgColor }) => {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className={`h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg ${iconBgColor}`}>
        <div className="h-6 w-6">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-text-secondary text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;