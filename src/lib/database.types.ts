export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: number
          created_at: string
          title: string
          description: string
          image: string
          technologies: string[]
          category: string
          link: string
          github: string
          featured: boolean
          sort_order: number
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          description: string
          image: string
          technologies: string[]
          category: string
          link: string
          github: string
          featured?: boolean
          sort_order?: number
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          description?: string
          image?: string
          technologies?: string[]
          category?: string
          link?: string
          github?: string
          featured?: boolean
          sort_order?: number
        }
      }
      experience: {
        Row: {
          id: number
          created_at: string
          year: string
          title: string
          company: string
          description: string
          skills: string[]
          icon: string
          sort_order: number
        }
        Insert: {
          id?: number
          created_at?: string
          year: string
          title: string
          company: string
          description: string
          skills: string[]
          icon: string
          sort_order?: number
        }
        Update: {
          id?: number
          created_at?: string
          year?: string
          title?: string
          company?: string
          description?: string
          skills?: string[]
          icon?: string
          sort_order?: number
        }
      }
      testimonials: {
        Row: {
          id: number
          created_at: string
          name: string
          role: string
          content: string
          avatar: string
          rating: number
          sort_order: number
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          role: string
          content: string
          avatar: string
          rating: number
          sort_order?: number
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          role?: string
          content?: string
          avatar?: string
          rating?: number
          sort_order?: number
        }
      }
      profile: {
        Row: {
          id: number
          created_at: string
          name: string
          title: string
          tagline: string
          about: string
          skills: string[]
          email: string
          github: string
          linkedin: string
          twitter: string
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          title: string
          tagline: string
          about: string
          skills: string[]
          email: string
          github: string
          linkedin: string
          twitter: string
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          title?: string
          tagline?: string
          about?: string
          skills?: string[]
          email?: string
          github?: string
          linkedin?: string
          twitter?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
