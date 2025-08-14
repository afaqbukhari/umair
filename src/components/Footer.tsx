import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePortfolioData } from '../hooks/usePortfolioData';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const { profile } = usePortfolioData();

  // Animation variants
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer
      className={`relative py-16 ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} border-t border-gray-200 dark:border-gray-800`}
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-50/30 to-transparent dark:from-indigo-950/20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {profile?.name || "Umair"}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {profile?.title || "Full Stack Developer & Data Engineer"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400"
          variants={itemVariants}
        >
          <p>
            Built with{' '}
            <span className="text-indigo-600 dark:text-indigo-400">Nextjs</span> &{' '}
            <span className="text-indigo-600 dark:text-indigo-400">Framer Motion</span>
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
