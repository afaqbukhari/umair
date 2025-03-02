import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Briefcase } from 'lucide-react';
import { Experience } from '../hooks/usePortfolioData';

interface TimelineSectionProps {
  items: Experience[];
}

const TimelineSection: React.FC<TimelineSectionProps> = ({ items = [] }) => {
  const timelineItems = items.length > 0 ? items : [
    {
      id: 1,
      year: "2023 - Present",
      title: "Senior Full Stack Developer & Data Engineer",
      company: "TechInnovate Solutions",
      description: "Leading development of enterprise data platforms and full stack applications. Architecting scalable data pipelines and implementing machine learning solutions.",
      skills: ["Python", "React", "AWS", "Apache Airflow", "TensorFlow"],
      icon: "Briefcase"
    },
    {
      id: 2,
      year: "2020 - 2023",
      title: "Full Stack Developer"
    }
  ];

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[15px] md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-500 dark:via-purple-500 dark:to-indigo-500"></div>
      
      {/* Timeline items */}
      <div className="space-y-12">
        {timelineItems.map((item, index) => (
          <motion.div 
            key={index}
            className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Timeline dot */}
            <div className="absolute left-[15px] md:left-1/2 transform md:-translate-x-1/2 w-[30px] h-[30px] bg-white dark:bg-gray-900 border-[3px] border-indigo-600 dark:border-indigo-500 rounded-full z-10 flex items-center justify-center">
              <div className="text-indigo-600 dark:text-indigo-400">
                {item.icon === "Briefcase" && <Briefcase size={16} />}
              </div>
            </div>
            
            {/* Content */}
            <div className={`md:w-1/2 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{item.year}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{item.company}</p>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {item.skills && item.skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TimelineSection;
