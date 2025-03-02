import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface DeviceFrameProps {
  children: ReactNode;
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Phone frame */}
      <div className={`relative w-[280px] h-[580px] rounded-[40px] overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
      } shadow-2xl`}>
        {/* Notch */}
        <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-[150px] h-[30px] ${
          theme === 'dark' ? 'bg-black' : 'bg-black'
        } rounded-b-[14px] z-20 flex items-center justify-center`}>
          <div className="w-[10px] h-[10px] bg-gray-600 rounded-full mx-1"></div>
          <div className="w-[40px] h-[6px] bg-gray-600 rounded-full mx-1"></div>
          <div className="w-[10px] h-[10px] bg-gray-600 rounded-full mx-1"></div>
        </div>
        
        {/* Screen */}
        <div className="absolute inset-[4px] rounded-[36px] overflow-hidden bg-black">
          {/* Screen content */}
          <div className="w-full h-full overflow-hidden">
            {children}
          </div>
          
          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[100px] h-[5px] bg-white/30 rounded-full"></div>
        </div>
        
        {/* Buttons */}
        <div className={`absolute top-[100px] right-[-5px] w-[5px] h-[60px] ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
        } rounded-l-[2px]`}></div>
        <div className={`absolute top-[180px] right-[-5px] w-[5px] h-[60px] ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
        } rounded-l-[2px]`}></div>
        <div className={`absolute top-[100px] left-[-5px] w-[5px] h-[100px] ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
        } rounded-r-[2px]`}></div>
      </div>
      
      {/* Reflection */}
      <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      
      {/* Shadow */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-[200px] h-[20px] bg-black/20 blur-xl rounded-full"></div>
    </motion.div>
  );
};

export default DeviceFrame;