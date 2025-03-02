import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Testimonial } from '../hooks/usePortfolioData';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, index }) => {
  return (
    <motion.div 
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
      <div className="relative h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col">
        {/* Quote mark */}
        <div className="absolute top-6 right-6 text-indigo-200 dark:text-indigo-800 opacity-30">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 7V11H9.5C9.5 12.3807 10.6193 13.5 12 13.5V15C9.79086 15 8 13.2091 8 11V7H11Z" fill="currentColor"/>
            <path d="M16 7V11H14.5C14.5 12.3807 15.6193 13.5 17 13.5V15C14.7909 15 13 13.2091 13 11V7H16Z" fill="currentColor"/>
          </svg>
        </div>
        
        {/* Rating */}
        <div className="flex mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
          ))}
        </div>
        
        {/* Content */}
        <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow">
          "{testimonial.content}"
        </p>
        
        {/* Author */}
        <div className="flex items-center mt-auto">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name} 
            className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-indigo-100 dark:border-indigo-900"
          />
          <div>
            <h4 className="font-bold">{testimonial.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;