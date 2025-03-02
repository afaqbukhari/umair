/*
  # Create portfolio database schema

  1. New Tables
    - `projects` - Store portfolio projects
    - `experience` - Store work and education history
    - `testimonials` - Store client testimonials
    - `profile` - Store personal information
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  technologies TEXT[] NOT NULL,
  category TEXT NOT NULL,
  link TEXT NOT NULL,
  github TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  order INTEGER DEFAULT 0
);

-- Create experience table (work history and education)
CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  icon TEXT NOT NULL,
  order INTEGER DEFAULT 0
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  avatar TEXT NOT NULL,
  rating INTEGER NOT NULL,
  order INTEGER DEFAULT 0
);

-- Create profile table
CREATE TABLE IF NOT EXISTS profile (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  about TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  email TEXT NOT NULL,
  github TEXT NOT NULL,
  linkedin TEXT NOT NULL,
  twitter TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- Projects policies
CREATE POLICY "Anyone can view projects"
  ON projects
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete their projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (true);

-- Experience policies
CREATE POLICY "Anyone can view experience"
  ON experience
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert experience"
  ON experience
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their experience"
  ON experience
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete their experience"
  ON experience
  FOR DELETE
  TO authenticated
  USING (true);

-- Testimonials policies
CREATE POLICY "Anyone can view testimonials"
  ON testimonials
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete their testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- Profile policies
CREATE POLICY "Anyone can view profile"
  ON profile
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert profile"
  ON profile
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their profile"
  ON profile
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete their profile"
  ON profile
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample data
INSERT INTO profile (name, title, tagline, about, skills, email, github, linkedin, twitter)
VALUES (
  'Umair Sajid',
  'Full Stack Developer & Data Engineer',
  'Building scalable applications and data solutions that transform businesses',
  'I''m a Full Stack Developer and Data Engineer with over 6 years of experience building scalable applications and data solutions. My expertise spans across modern web technologies, cloud infrastructure, and data processing systems.',
  ARRAY['React', 'Next.js', 'Python', 'AWS', 'PostgreSQL', 'Apache Airflow', 'Docker', 'GraphQL'],
  'contact@example.com',
  'https://github.com',
  'https://linkedin.com',
  'https://twitter.com'
);

INSERT INTO projects (title, description, image, technologies, category, link, github, featured, order)
VALUES (
  'Enterprise Data Pipeline Platform',
  'A scalable data pipeline solution for processing and analyzing large datasets in real-time. Built with Python, Apache Airflow, and React.',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop',
  ARRAY['Python', 'React', 'Apache Airflow', 'AWS', 'PostgreSQL'],
  'Data Engineering',
  'https://example.com/project',
  'https://github.com/example/project',
  true,
  1
);

INSERT INTO experience (year, title, company, description, skills, icon, order)
VALUES 
(
  '2023 - Present',
  'Senior Full Stack Developer & Data Engineer',
  'TechInnovate Solutions',
  'Leading development of enterprise data platforms and full stack applications. Architecting scalable data pipelines and implementing machine learning solutions.',
  ARRAY['Python', 'React', 'AWS', 'Apache Airflow', 'TensorFlow'],
  'Briefcase',
  1
);

INSERT INTO testimonials (name, role, content, avatar, rating, order)
VALUES (
  'Sarah Johnson',
  'CTO at TechInnovate',
  'Working with this developer was an exceptional experience. They delivered a complex data pipeline solution that exceeded our expectations and significantly improved our analytics capabilities.',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
  5,
  1
);
