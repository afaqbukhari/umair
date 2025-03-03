import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '../hooks/usePortfolioData';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log('Navigating to:', `/project/${project.id}`);
    navigate(`/project/${project.id}`);
  };

  return (
    <motion.div 
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      layout
      onClick={handleCardClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-xl group-hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
        <div className="h-56 overflow-hidden">
          <img 
            src={project.image}
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, idx) => (
              <span 
                key={idx} 
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="flex space-x-4 mt-auto" onClick={(e) => e.stopPropagation()}>
            <motion.a 
              href={project.link} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 text-sm font-medium"
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.95 }}
            >
              Live Demo <ExternalLink size={14} />
            </motion.a>
            <motion.a 
              href={project.github} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 text-sm font-medium"
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.95 }}
            >
              Source <Github size={14} />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
