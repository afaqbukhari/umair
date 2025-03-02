import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface LaptopFrameProps {
  currentImageIndex: MotionValue<number>;
  images: string[];
}

const LaptopFrame: React.FC<LaptopFrameProps> = ({ currentImageIndex, images }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Laptop frame */}
      <div className={`relative w-[600px] h-[400px] ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
      } rounded-t-lg overflow-hidden shadow-2xl`}>
        {/* Screen bezel */}
        <div className={`absolute inset-[8px] rounded-t-md overflow-hidden ${
          theme === 'dark' ? 'bg-black' : 'bg-black'
        }`}>
          {/* Screen content */}
          <div className="relative w-full h-full overflow-hidden">
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
                  alt={`Screen ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Camera */}
        <div className="absolute top-[6px] left-1/2 transform -translate-x-1/2 w-[6px] h-[6px] bg-gray-700 rounded-full"></div>
      </div>
      
      {/* Laptop base */}
      <div className={`relative w-[600px] h-[30px] ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
      } rounded-b-lg shadow-2xl`}>
        {/* Touchpad */}
        <div className={`absolute top-[5px] left-1/2 transform -translate-x-1/2 w-[100px] h-[20px] ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-400'
        } rounded-md`}></div>
      </div>
      
      {/* Shadow */}
      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-[500px] h-[20px] bg-black/20 blur-xl rounded-full"></div>
    </motion.div>
  );
};

export default LaptopFrame;