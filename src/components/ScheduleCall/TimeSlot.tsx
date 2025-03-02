import React from 'react';
import { Clock } from 'lucide-react';

type TimeSlotProps = {
  time: string;
  selected: boolean;
  onClick: () => void;
  darkMode?: boolean;
};

const TimeSlot: React.FC<TimeSlotProps> = ({ 
  time, 
  selected, 
  onClick,
  darkMode = false
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2 p-4 rounded-lg
        ${selected 
          ? darkMode 
            ? 'bg-indigo-600 text-white' 
            : 'bg-indigo-600 text-white'
          : darkMode
            ? 'bg-gray-800 hover:bg-gray-700'
            : 'bg-white hover:bg-gray-50 shadow-sm'
        }
      `}
    >
      <Clock size={16} className={selected ? 'text-white' : darkMode ? 'text-indigo-400' : 'text-indigo-600'} />
      <span>{time}</span>
    </button>
  );
};

export default TimeSlot;
