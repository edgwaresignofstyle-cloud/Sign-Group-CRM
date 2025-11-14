import React from 'react';
import { ProductionStage } from '../types';
import { PROGRESS_STAGES } from '../constants';

interface StageProgressProps {
  currentStage: ProductionStage;
}

const StageProgress: React.FC<StageProgressProps> = ({ currentStage }) => {
  const currentIndex = PROGRESS_STAGES.indexOf(currentStage);

  // Don't render if the stage is not part of the linear progression (e.g., On Hold).
  if (currentIndex === -1) {
    return null;
  }

  return (
    <div className="w-full flex h-2 mt-2" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={PROGRESS_STAGES.length} aria-label={`Progress: ${currentStage}`}>
      {PROGRESS_STAGES.map((stage, index) => (
        <div
          key={stage}
          className={`h-full first:rounded-l-full last:rounded-r-full flex-1 transition-colors duration-500 ease-in-out border-r-2 border-white last:border-r-0 ${
            index <= currentIndex ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
          title={stage}
        />
      ))}
    </div>
  );
};

export default StageProgress;
