
import React from 'react';
import { ProductionStage } from '../types';
import { STAGE_COLORS } from '../constants';

interface StatusBadgeProps {
  stage: ProductionStage;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ stage }) => {
  const colorClasses = STAGE_COLORS[stage] || 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${colorClasses}`}>
      {stage}
    </span>
  );
};

export default StatusBadge;
