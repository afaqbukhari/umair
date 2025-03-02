import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ParallaxSectionProps {
  title: string;
  description: string;
  image: string;
  gradient: string;
  index: number;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({ 
  title, 
  description, 
  image, 
  gradient,
  index 
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
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
  
  // Parallax effects
  const imageY = useTransform(smoothScrollProgress, [0, 1], [100, -100]);
  const contentY = useTransform(smoothScrollProgress, [0, 1], [50, -50]);
  const scale = useTransform(smoothScrollProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(smoothScrollProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  
  // Alternate layout for even/odd sections
  const isEven = index % 2 === 0;
  
  return (
    <section 
      ref={sectionRef}
      className="min-h-screen py-24 relative overflow-hidden flex items-center"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`}></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
          <motion.div
            style={{ y: contentY, opacity }}
            className="order-2 lg:order-none"
          >
            <motion.div 
              className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${gradient} bg-opacity-10 backdrop-blur-sm text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium mb-6`}
              style={{ scale }}
            >
              Section {index + 1}
            </motion.div>
            
            <motion.h2 
              className={`text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}
              style={{ scale }}
            >
              {title}
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-xl"
              style={{ scale }}
            >
              {description}
            </motion.p>
            
            <motion.a 
              href="#" 
              className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${gradient} text-white font-medium rounded-full transition-all shadow-lg`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </motion.a>
          </motion.div>
          
          <motion.div 
            className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            style={{ y: imageY, scale, opacity }}
          >
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ParallaxSection;