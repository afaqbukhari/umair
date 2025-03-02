import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface PhoneFrameProps {
  currentImageIndex: MotionValue<number>;
  images: string[];
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ currentImageIndex, images }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Phone frame */}
      <div className={`relative w-[200px] h-[400px] rounded-[30px] overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
      } shadow-2xl`}>
        {/* Notch */}
        <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[25px] ${
          theme === 'dark' ? 'bg-black' : 'bg-black'
        } rounded-b-[14px] z-20 flex items-center justify-center`}>
          <div className="w-[8px] h-[8px] bg-gray-600 rounded-full mx-1"></div>
          <div className="w-[30px] h-[5px] bg-gray-600 rounded-full mx-1"></div>
          <div className="w-[8px] h-[8px] bg-gray-600 rounded-full mx-1"></div>
        </div>
        
        {/* Screen */}
        <div className="absolute inset-[4px] rounded-[26px] overflow-hidden bg-black">
          {/* Screen content */}
          <div className="w-full h-full overflow-hidden">
            {images.map((img, index) => (
              <motion.div
                key={index}
                className="absolute inset-0 w-full h-full"
                style={{
                  opacity: useTransform(currentImageIndex, (value) => {
                    const distance = Math.abs(value - index);
                    return distance < 0.5 ? 1 : 0;
                  }),
                  scale: useTransform(currentImageIndex, (value) => {
                    const distance = Math.abs(value - index);
                    return distance < 0.5 ? 1 : 0.9;
                  })
                }}
              >
                <img 
                  src={img} 
                  alt={`Phone screen ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
          
          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[80px] h-[4px] bg-white/30 rounded-full"></div>
        </div>
        
        {/* Buttons */}
        <div className={`absolute top-[80px] right-[-3px] w-[3px] h-[40px] ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
        } rounded-l-[2px]`}></div>
        <div className={`absolute top-[140px] right-[-3px] w-[3px] h-[40px] ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
        } rounded-l-[2px]`}></div>
        <div className={`absolute top-[80px] left-[-3px] w-[3px] h-[80px] ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
        } rounded-r-[2px]`}></div>
      </div>
      
      {/* Reflection */}
      <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      
      {/* Shadow */}
      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-[150px] h-[15px] bg-black/20 blur-xl rounded-full"></div>
    </motion.div>
  );
};

export default PhoneFrame;