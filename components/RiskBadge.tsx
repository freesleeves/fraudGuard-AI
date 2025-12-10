import React from 'react';

interface RiskBadgeProps {
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  className?: string;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '' }) => {
  let colorClasses = '';

  switch (level) {
    case 'Low':
      colorClasses = 'bg-green-100 text-green-800 border-green-200';
      break;
    case 'Medium':
      colorClasses = 'bg-yellow-100 text-yellow-800 border-yellow-200';
      break;
    case 'High':
      colorClasses = 'bg-orange-100 text-orange-800 border-orange-200';
      break;
    case 'Critical':
      colorClasses = 'bg-red-100 text-red-800 border-red-200 animate-pulse';
      break;
    default:
      colorClasses = 'bg-gray-100 text-gray-800 border-gray-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses} ${className}`}>
      {level.toUpperCase()}
    </span>
  );
};

export default RiskBadge;
