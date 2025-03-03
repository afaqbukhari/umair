import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { usePortfolioData } from '../hooks/usePortfolioData';

const ProjectsPage: React.FC = () => {
  const { projects } = usePortfolioData();

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Projects
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
