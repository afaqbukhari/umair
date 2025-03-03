import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Server, Database, Cloud, Brain } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import LaptopFrame from './LaptopFrame';
import PhoneFrame from './PhoneFrame';

const DeviceShowcase = () => {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const laptopY = useTransform(smoothScrollProgress, [0, 0.5, 1], [100, 0, -100]);
  const phoneY = useTransform(smoothScrollProgress, [0, 0.5, 1], [50, 0, -50]);
  const contentOpacity = useTransform(smoothScrollProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const contentY = useTransform(smoothScrollProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);
  
  // Updated images with working URLs
  const laptopScreens = [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", // Data visualization
   "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"  // Analytics dashboard
  ];
  
  const phoneScreens = [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", // Data visualization
   "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"  // Analytics dashboard
  ];
  
  const imageIndex = useTransform(smoothScrollProgress, [0.2, 0.5, 0.8], [0, 1, 2]);
  
  return (
    <section ref={sectionRef} className="min-h-screen py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent dark:via-indigo-950/20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          style={{
            opacity: contentOpacity,
            y: contentY
          }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/80 dark:bg-indigo-900/30 backdrop-blur-sm text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium mb-4"
          >
            <Brain size={16} />
            Data-Driven Innovation
          </motion.div>
          
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Scalable Data & AI Solutions
          </h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            I design and build high-performance data pipelines, AI-powered applications, and full-stack systems 
            that scale effortlessly—from startup MVPs to enterprise platforms.
          </p>
        </motion.div>
        
        <div className="relative h-[60vh] flex items-center justify-center">
          {/* Laptop */}
          <motion.div
            className="absolute"
            style={{
              y: laptopY,
              zIndex: 10
            }}
          >
            <LaptopFrame currentImageIndex={imageIndex} images={laptopScreens} />
          </motion.div>
          
          {/* Phone */}
          <motion.div
            className="absolute -right-10 sm:right-1/4 top-1/2 transform -translate-y-1/2"
            style={{
              y: phoneY,
              zIndex: 20
            }}
          >
            <PhoneFrame currentImageIndex={imageIndex} images={phoneScreens} />
          </motion.div>
          
          {/* Expanded content (empty in your latest code, so I left it as is) */}
          <motion.div
            className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center pointer-events-none"
            style={{
              opacity: useTransform(smoothScrollProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]),
              scale: useTransform(smoothScrollProgress, [0.3, 0.4, 0.6, 0.7], [0.8, 1.1, 1.1, 0.8]),
              zIndex: useTransform(smoothScrollProgress, [0.3, 0.4, 0.6, 0.7], [5, 30, 30, 5])
            }}
          >
          </motion.div>
        </div>
        
        {/* Scroll progress indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          style={{ 
            opacity: useTransform(smoothScrollProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
          }}
        >
          <motion.div 
            className="w-64 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden"
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 rounded-full"
              style={{ 
                width: useTransform(smoothScrollProgress, [0, 1], ["0%", "100%"])
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DeviceShowcase;
