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

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social & Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
              Connect
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <motion.a
                  href={profile?.github || "https://github.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </motion.a>
                <motion.a
                  href={profile?.linkedin || "https://linkedin.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </motion.a>
                <motion.a
                  href={profile?.upwork || "https://twitter.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </motion.a>
              </div>
              <motion.a
                href={`mailto:${profile?.email || 'contact@example.com'}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Me
                <ExternalLink size={16} />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400"
          variants={itemVariants}
        >
          <p>
            Built with{' '}
            <span className="text-indigo-600 dark:text-indigo-400">React</span> &{' '}
            <span className="text-indigo-600 dark:text-indigo-400">Framer Motion</span>
            {' '}• Designed with passion
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
