import { useState, useEffect } from 'react';
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
        
        if (profileError) throw new Error(`Error fetching profile: ${profileError.message}`);
        setProfile(profileData);
        
        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true });
        
        if (projectsError) throw new Error(`Error fetching projects: ${projectsError.message}`);
        setProjects(projectsData);
        
        // Fetch experience
        const { data: experienceData, error: experienceError } = await supabase
          .from('experience')
          .select('*')
          .order('sort_order', { ascending: true });
        
        if (experienceError) throw new Error(`Error fetching experience: ${experienceError.message}`);
        setExperience(experienceData);
        
        // Fetch testimonials
        const { data: testimonialsData, error: testimonialsError } = await supabase
          .from('testimonials')
          .select('*')
          .order('sort_order', { ascending: true });
        
        if (testimonialsError) throw new Error(`Error fetching testimonials: ${testimonialsError.message}`);
        setTestimonials(testimonialsData);
        
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter featured projects
  const featuredProjects = projects.filter(project => project.featured);
  
  return {
    profile,
    projects,
    featuredProjects,
    experience,
    testimonials,
    loading,
    error
  };
};
