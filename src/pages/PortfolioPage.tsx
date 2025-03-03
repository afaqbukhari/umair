import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sun, Moon, Code, Database, Server, ExternalLink, Github, Linkedin, Twitter, ArrowRightCircle, Brain } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useLocation } from 'react-router-dom';
import BackgroundAnimation from '../components/BackgroundAnimation';
import Web3Animation from '../components/Web3Animation';
import CodeAnimation from '../components/CodeAnimation';
import DeviceShowcase from '../components/DeviceShowcase';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import TestimonialCard from '../components/TestimonialCard';
import TimelineSection from '../components/TimelineSection';
import DeviceFrame from '../components/DeviceFrame';
import ScheduleCall from '../components/ScheduleCall';
import Footer from '../components/Footer';
import DataPipelineAnimation from '../components/DataPipelineAnimation';
import DataEngineeringFlowchart from '../components/DataPipelineAnimation';

const PortfolioPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scheduledCall, setScheduledCall] = useState<{
    date: Date;
    time: string;
    details: {
      name: string;
      email: string;
      purpose: string;
    };
  } | null>(null);

  const handleSchedule = (
    date: Date, 
    time: string, 
    details: { name: string; email: string; purpose: string }
  ) => {
    setScheduledCall({ date, time, details });
  };

  const { theme, toggleTheme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { 
    profile, 
    featuredProjects, 
    experience, 
    testimonials, 
    loading, 
    error 
  } = usePortfolioData();
  
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  const [currentStep, setCurrentStep] = useState(0);
  const steps = [0, 1, 2, 3];

  const handleNextStep = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const heroTextY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const location = useLocation();
  const isProjectModalRoute = location.pathname.startsWith('/project/');

  useEffect(() => {
    if (isProjectModalRoute) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isProjectModalRoute]);

  useEffect(() => {
    console.log('Current pathname:', location.pathname);
    console.log('isProjectModalRoute:', isProjectModalRoute);
    console.log('URL changed, should render modal:', isProjectModalRoute ? 'Yes' : 'No');
  }, [location.pathname]);

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} flex items-center justify-center`}>
        <div className="text-center max-w-md p-6 bg-red-100 dark:bg-red-900/30 rounded-lg">
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">Error Loading Data</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Please make sure you've connected to Supabase and set up the database correctly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}
    >
      {/* Background animations */}
      {theme === 'dark' ? <Web3Animation /> : <BackgroundAnimation />}
      
      {/* Theme toggle */}
      <button 
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      
      {/* Social links */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-4">
        <a 
          href={profile?.github || "https://github.com"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          aria-label="GitHub"
        >
          <Github size={20} />
        </a>
        <a 
          href={profile?.linkedin || "https://linkedin.com"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          aria-label="LinkedIn"
        >
          <Linkedin size={20} />
        </a>
        <a 
          href={profile?.upwork || "https://www.upwork.com"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          aria-label="Upwork"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4ZM9 8V16H11V13C11 11.34 12.34 10 14 10C15.66 10 17 11.34 17 13V16H15V13C15 12.45 14.55 12 14 12C13.45 12 13 12.45 13 13V16H13V8H9Z" 
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
          style={{ y: heroTextY, opacity: heroOpacity }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/80 dark:bg-indigo-900/30 backdrop-blur-sm text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Code size={16} />
            {profile?.title || "Full Stack Developer & Data Engineer"}
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {profile?.name || "Umair"}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {profile?.tagline || "Building scalable applications and data solutions that transform businesses"}
          </motion.p>
          
          <motion.div
            className="flex flex-wrap gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {profile?.skills?.slice(0, 3).map((skill, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full text-gray-800 dark:text-gray-200 shadow-md">
                {index === 0 && <Code size={16} className="text-indigo-600 dark:text-indigo-400" />}
                {index === 1 && <Server size={16} className="text-indigo-600 dark:text-indigo-400" />}
                {index === 2 && <Database size={16} className="text-indigo-600 dark:text-indigo-400" />}
                <span>{skill}</span>
              </div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <a 
              href="#projects" 
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View My Work
            </a>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </section>
      
      {/* About Section */}
      <section className="relative min-h-screen py-24 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/80 dark:bg-indigo-900/30 backdrop-blur-sm text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium mb-6">
                <Code size={16} />
                About Me
              </div>
              
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Crafting Digital Solutions
              </h2>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                {profile?.about || "I'm a Full Stack Developer and Data Engineer with over 6 years of experience building scalable applications and data solutions. My expertise spans across modern web technologies, cloud infrastructure, and data processing systems."}
              </p>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                I specialize in creating robust data pipelines, interactive web applications, and seamless user experiences 
                that help businesses leverage their data and reach their customers effectively.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {profile?.skills?.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              className="relative h-[500px]"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <CodeAnimation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Data Engineering Section */}
      <section className="relative min-h-screen py-24 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/80 dark:bg-indigo-900/30 backdrop-blur-sm text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium mb-6">
                <Code size={16} />
                Data Engineering
              </div>
              
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Orchestrating Data Pipelines
              </h2>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                As a Data Engineer, I design and maintain robust ETL pipelines that transform raw data into actionable insights. With over 6 years of experience, I leverage tools like Apache Kafka, Spark, and Airflow to build scalable data infrastructure.
              </p>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                My work involves streaming real-time data with Kafka, processing large datasets with Spark, and orchestrating complex workflows with Airflow to ensure data reliability and performance for analytics and business intelligence.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {['Kafka', 'Spark', 'Airflow', 'ETL', 'Data Warehousing', 'Real-time Processing'].map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
            <main className="container mx-auto px-4 py-8">
              <div className={`rounded-xl shadow-2xl overflow-hidden h-[400px] relative ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <DataEngineeringFlowchart currentStep={currentStep} />
                
                <button 
                  onClick={handleNextStep}
                  className={`absolute bottom-6 right-6 rounded-full p-3 shadow-lg transition-all flex items-center ${
                    theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <ArrowRightCircle className="w-6 h-6" />
                  <span className="ml-2 mr-1">Next Step</span>
                </button>
              </div>
            </main>
          </div>
        </div>
      </section>
      
      {/* Experience Timeline */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/80 dark:bg-indigo-900/30 backdrop-blur-sm text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Professional Journey
            </div>
            
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Experience & Education
            </h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              My professional path has been focused on building expertise in full stack development and data engineering,
              working with innovative companies and challenging projects.
            </p>
          </motion.div>
          
          <TimelineSection items={experience} />
        </div>
      </section>
      
      {/* Device Showcase */}
      <DeviceShowcase />
      
      {/* Projects Section */}
      <section id="projects" className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent dark:via-indigo-950/20"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/80 dark:bg-indigo-900/30 backdrop-blur-sm text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Featured Work
            </div>
            
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Recent Projects
            </h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Explore some of my recent work across full stack development and data engineering projects.
              Each project represents unique challenges and innovative solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              console.log('Project:', project),
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Conditionally render ProjectModal when on /project/:projectId */}
          {isProjectModalRoute && <ProjectModal />}
          
          <div className="mt-16 flex justify-center">
            <motion.a 
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-full text-gray-800 dark:text-gray-200 shadow-md hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View All Projects</span>
              <ExternalLink size={16} />
            </motion.a>
          </div>
        </div>
      </section>
      
      {/* Data & AI Solutions Showcase */}
      <section className="relative py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/80 dark:bg-indigo-900/30 backdrop-blur-sm text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium mb-6">
                <Brain size={16} />
                Data-Driven Innovation
              </div>
              
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Scalable Data For Mobile Application
              </h2>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                I architect high-performance data pipelines and AI-powered systems that scale seamlessly 
                across platforms, delivering actionable insights for startups and enterprises.
              </p>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                From real-time analytics on mobile devices to cloud-native enterprise platforms, 
                my solutions are built to handle big data and intelligent automation efficiently.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {['Data Engineering', 'AI/ML', 'Cloud Architecture', 'Full-Stack', 'Scalability'].map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              className="flex justify-center order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <DeviceFrame>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                  alt="Data Dashboard" 
                  className="w-full h-full object-cover"
                />
              </DeviceFrame>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/30 to-transparent dark:via-purple-950/20"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/80 dark:bg-indigo-900/30 backdrop-blur-sm text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Client Feedback
            </div>
            
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              What Clients Say
            </h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Don't just take my word for it. Here's what clients have to say about working with me
              on their projects and business challenges.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/80 dark:bg-indigo-900/30 backdrop-blur-sm text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Get In Touch
            </div>
            
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Let's Work Together
            </h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              I'm currently available for freelance projects, consulting work, and collaboration opportunities.
              If you have a project in mind or want to discuss how we can work together, reach out!
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a 
                href={`mailto:${profile?.email || 'contact@example.com'}`}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email Me
              </motion.a>
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Schedule a Call
              </motion.button>

              {scheduledCall && (
                <div className={`mt-8 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  <h3 className="text-lg font-medium mb-2">Your Scheduled Call</h3>
                  <p><strong>Date:</strong> {scheduledCall.date.toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {scheduledCall.time}</p>
                  <p><strong>Name:</strong> {scheduledCall.details.name}</p>
                  <p><strong>Email:</strong> {scheduledCall.details.email}</p>
                  <p><strong>Purpose:</strong> {scheduledCall.details.purpose}</p>
                </div>
              )}

              <ScheduleCall
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSchedule={handleSchedule}
                darkMode={theme === 'dark'}
              />
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default PortfolioPage;
