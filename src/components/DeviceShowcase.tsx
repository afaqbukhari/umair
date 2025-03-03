import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Laptop, Smartphone, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import LaptopFrame from './LaptopFrame';
import PhoneFrame from './PhoneFrame';

const DeviceShowcase = () => {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Scroll progress for this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Smooth scroll progress
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Animation values
  const laptopY = useTransform(smoothScrollProgress, [0, 0.5, 1], [100, 0, -100]);
  const phoneY = useTransform(smoothScrollProgress, [0, 0.5, 1], [50, 0, -50]);
  const contentOpacity = useTransform(smoothScrollProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const contentY = useTransform(smoothScrollProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);
  
  // Device images
  const laptopScreens = [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
  ];
  
  const phoneScreens = [
    "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
  ];
  
  // Current image index based on scroll
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
            <Monitor size={16} />
            Responsive Applications
          </motion.div>
          
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Cross-Platform Excellence
          </h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            I build applications that work seamlessly across all devices, from desktop to mobile,
            ensuring a consistent and optimized experience for all users.
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
          
          {/* Expanded content */}
          <motion.div
            className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center pointer-events-none"
            style={{
              opacity: useTransform(smoothScrollProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]),
              scale: useTransform(smoothScrollProgress, [0.3, 0.4, 0.6, 0.7], [0.8, 1.1, 1.1, 0.8]),
              zIndex: useTransform(smoothScrollProgress, [0.3, 0.4, 0.6, 0.7], [5, 30, 30, 5])
            }}
          >
            <motion.div
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-2xl border border-gray-200 dark:border-gray-800"
              style={{
                scale: useTransform(smoothScrollProgress, [0.3, 0.5, 0.7], [0.9, 1.05, 0.9]),
              }}
            >
              <h3 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Seamless User Experience</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                My applications are designed to provide a consistent and intuitive experience across all devices.
                From responsive layouts to optimized performance, I ensure that users can access and enjoy your
                application regardless of their device or screen size.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Responsive Design', 'Mobile-First', 'Cross-Browser', 'Performance Optimized'].map((feature, index) => (
                  <span 
                    key={feature}
                    className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 rounded-full text-xs font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>
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
