import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { Project, usePortfolioData } from '../hooks/usePortfolioData';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectCard from './ProjectCard';

const ProjectModal: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById, getRelatedProjects } = usePortfolioData();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [showRelated, setShowRelated] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const liveDemoRef = useRef<HTMLAnchorElement>(null); // Ref for Live Demo button
  const shareButtonRef = useRef<HTMLButtonElement>(null); // Ref for Share button

  useEffect(() => {
    console.log('ProjectModal - projectId:', projectId);
    if (projectId) {
      const foundProject = getProjectById(Number(projectId));
      console.log('ProjectModal - foundProject:', foundProject);
      if (foundProject) {
        setProject(foundProject);
        setRelatedProjects(getRelatedProjects(Number(projectId)));
      } else {
        console.log('ProjectModal - No project found for ID:', projectId);
      }
    }
  }, [projectId, getProjectById, getRelatedProjects]);

  // Focus Live Demo when project loads
  useEffect(() => {
    if (project && liveDemoRef.current) {
      console.log('Focusing Live Demo button'); // Debug log
      liveDemoRef.current.focus();
    }
  }, [project]);

  const handleClose = () => {
    navigate('/');
  };

  const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // Explicitly blur Share button and refocus Live Demo
      if (shareButtonRef.current && liveDemoRef.current) {
        console.log('Blurring Share button and refocusing Live Demo'); // Debug log
        shareButtonRef.current.blur();
        liveDemoRef.current.focus();
      }
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Remove focus from Live Demo when clicking elsewhere, but not Share
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      liveDemoRef.current &&
      e.target !== liveDemoRef.current &&
      e.target !== shareButtonRef.current
    ) {
      console.log('Removing focus from Live Demo'); // Debug log
      liveDemoRef.current.blur();
    }
  };

  console.log('ProjectModal - Rendering, project:', project);

  if (!project) {
    console.log('ProjectModal - Returning null due to no project');
    return null;
  }

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={handleBackdropClick}
      >
        <motion.div
          className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={handleModalClick}
        >
          <button 
            className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            onClick={handleClose}
          >
            <X size={20} />
          </button>
          
          <div className="h-72 sm:h-80 md:h-96 overflow-hidden">
            <img 
              src={project.image}
              alt={project.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          
          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {project.title}
            </h2>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {project.longDescription || project.description}
            </p>
            
            {project.features && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Key Features</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  {project.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((tech, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <motion.a 
                ref={liveDemoRef}
                href={project.link} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Live Demo <ExternalLink size={16} />
              </motion.a>
              
              <motion.a 
                href={project.github} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Source Code <Github size={16} />
              </motion.a>
              
              <motion.button 
                ref={shareButtonRef} // Attach ref to Share button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? 'Link Copied!' : 'Share'} <Share2 size={16} />
                {copied && (
                  <motion.span 
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Copied!
                  </motion.span>
                )}
              </motion.button>
            </div>
            
            {relatedProjects.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <button 
                  className="flex items-center justify-between w-full text-left text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4"
                  onClick={() => setShowRelated(!showRelated)}
                >
                  <span>Related Projects</span>
                  {showRelated ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                <AnimatePresence>
                  {showRelated && (
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {relatedProjects.map(relatedProject => (
                        <ProjectCard key={relatedProject.id} project={relatedProject} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;
