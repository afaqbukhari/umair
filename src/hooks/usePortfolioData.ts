import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  link: string;
  github: string;
  featured: boolean;
  longDescription?: string;
  features?: string[];
  relatedProjects?: string[];
}

export interface Experience {
  id: number;
  year: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  icon: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface Profile {
  id: number;
  name: string;
  title: string;
  tagline: string;
  about: string;
  skills: string[];
  email: string;
  github: string;
  linkedin: string;
  upwork: string;
}

export interface PortfolioData {
  profile: Profile | null;
  projects: Project[];
  featuredProjects: Project[];
  experience: Experience[];
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  getProjectById: (id: number) => Project | undefined;
  getRelatedProjects: (projectId: number) => Project[];
}

export const usePortfolioData = (): PortfolioData => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profile')
          .select('*')
          .single();
        
        if (profileError) {
          console.warn(`Error fetching profile: ${profileError.message}`);
        } else {
          setProfile(profileData);
        }
        
        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true });
        
        if (projectsError) {
          console.warn(`Error fetching projects: ${projectsError.message}`);
        } else if (projectsData && projectsData.length > 0) {
          setProjects(projectsData.map((project: any) => ({
            ...project,
            technologies: Array.isArray(project.technologies) ? project.technologies : 
              (typeof project.technologies === 'string' ? JSON.parse(project.technologies) : []),
            features: Array.isArray(project.features) ? project.features : 
              (typeof project.features === 'string' ? JSON.parse(project.features) : undefined),
            relatedProjects: Array.isArray(project.related_projects) ? project.related_projects : 
              (typeof project.related_projects === 'string' ? JSON.parse(project.related_projects) : undefined)
          })));
        }
        
        // Fetch experience
        const { data: experienceData, error: experienceError } = await supabase
          .from('experience')
          .select('*')
          .order('sort_order', { ascending: true });
        
        if (experienceError) {
          console.warn(`Error fetching experience: ${experienceError.message}`);
        } else {
          setExperience(experienceData.map((exp: any) => ({
            ...exp,
            skills: Array.isArray(exp.skills) ? exp.skills : 
              (typeof exp.skills === 'string' ? JSON.parse(exp.skills) : [])
          })));
        }
        
        // Fetch testimonials
        const { data: testimonialsData, error: testimonialsError } = await supabase
          .from('testimonials')
          .select('*')
          .order('sort_order', { ascending: true });
        
        if (testimonialsError) {
          console.warn(`Error fetching testimonials: ${testimonialsError.message}`);
        } else {
          setTestimonials(testimonialsData);
        }
        
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const featuredProjects = (projects ?? []).filter(project => project.featured);
  
  // Fix: Convert string id to number for comparison
  const getProjectById = useCallback((id: number) => {
    const project = (projects ?? []).find(project => project.id === id);
    console.log('usePortfolioData - getProjectById:', id, 'Result:', project); // Debug log
    return project;
  }, [projects]);

  const getRelatedProjects = useCallback((projectId: number) => {
    const project = getProjectById(projectId);
    if (!project || !project.relatedProjects) return [];
    
    return project.relatedProjects.map(id => getProjectById(Number(id))).filter(Boolean) as Project[];
  }, [getProjectById]);
  
  return {
    profile,
    projects,
    featuredProjects,
    experience,
    testimonials,
    loading,
    error,
    getProjectById,
    getRelatedProjects
  };
}
