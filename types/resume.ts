export interface Resume {
  id: string
  user_id: string
  title: string
  thumbnail_links?: string
  template_theme?: string
  template_color_pallette?: string[]
  profile_preview_url?: string
  full_name?: string
  designation?: string
  summary?: string
  contact_email?: string
  contact_phone?: string
  contact_location?: string
  contact_linkedin?: string
  contact_github?: string
  contact_website?: string
  work_experience?: WorkExperience[]
  education?: Education[]
  skills?: Skill[]
  projects?: Project[]
  certifications?: Certification[]
  languages?: Language[]
  interests?: string[]
  created_at?: string
  updated_at?: string
}

export interface WorkExperience {
  id: string
  company: string
  role: string
  start_date: string
  end_date?: string
  currently_working: boolean
  description: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  start_date: string
  end_date: string
}

export interface Skill {
  id: string
  name: string
  proficiency: number
}

export interface Project {
  id: string
  title: string
  description: string
  github_link?: string
  live_demo_url?: string
}

export interface Certification {
  id: string
  title: string
  issuer: string
  year: string
}

export interface Language {
  id: string
  name: string
  proficiency: number
}

export type FormSection =
  | "profile"
  | "contact"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "additional"

export interface ValidationError {
  field: string
  message: string
}
