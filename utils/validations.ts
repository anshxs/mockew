import type { Resume, WorkExperience, Education, Skill, Project, Certification, ValidationError } from "@/types/resume"

export const validateProfile = (full_name: string | undefined): ValidationError[] => {
  const errors: ValidationError[] = []

  if (!full_name) {
    errors.push({ field: "full_name", message: "Full name is required" })
  }

  return errors
}

export const validateContact = (resume: Resume): ValidationError[] => {
  const errors: ValidationError[] = []

  if (!resume.contact_email && !resume.contact_phone) {
    errors.push({ field: "contact", message: "Either email or phone number is required" })
  }

  if (resume.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.contact_email)) {
    errors.push({ field: "contact_email", message: "Please enter a valid email address" })
  }

  return errors
}

export const validateWorkExperience = (workExperience: WorkExperience[]): ValidationError[] => {
  const errors: ValidationError[] = []

  workExperience.forEach((exp, index) => {
    if (!exp.company.trim()) {
      errors.push({ field: `work_${index}_company`, message: `Company name is required for experience ${index + 1}` })
    }
    if (!exp.role.trim()) {
      errors.push({ field: `work_${index}_role`, message: `Role is required for experience ${index + 1}` })
    }
    if (!exp.start_date) {
      errors.push({
        field: `work_${index}_start_date`,
        message: `Start date is required for experience ${index + 1}`,
      })
    }
    if (!exp.currently_working && !exp.end_date) {
      errors.push({ field: `work_${index}_end_date`, message: `End date is required for experience ${index + 1}` })
    }
    if (exp.start_date && exp.end_date && !exp.currently_working) {
      const startDate = new Date(exp.start_date)
      const endDate = new Date(exp.end_date)
      if (startDate >= endDate) {
        errors.push({
          field: `work_${index}_dates`,
          message: `Start date must be before end date for experience ${index + 1}`,
        })
      }
    }
  })

  return errors
}

export const validateEducation = (education: Education[]): ValidationError[] => {
  const errors: ValidationError[] = []

  education.forEach((edu, index) => {
    if (!edu.degree.trim()) {
      errors.push({ field: `edu_${index}_degree`, message: `Degree is required for education ${index + 1}` })
    }
    if (!edu.institution.trim()) {
      errors.push({
        field: `edu_${index}_institution`,
        message: `Institution is required for education ${index + 1}`,
      })
    }
    if (!edu.start_date) {
      errors.push({ field: `edu_${index}_start_date`, message: `Start date is required for education ${index + 1}` })
    }
    if (!edu.end_date) {
      errors.push({ field: `edu_${index}_end_date`, message: `End date is required for education ${index + 1}` })
    }
    if (edu.start_date && edu.end_date) {
      const startDate = new Date(edu.start_date)
      const endDate = new Date(edu.end_date)
      if (startDate >= endDate) {
        errors.push({
          field: `edu_${index}_dates`,
          message: `Start date must be before end date for education ${index + 1}`,
        })
      }
    }
  })

  return errors
}

export const validateSkills = (skills: Skill[]): ValidationError[] => {
  const errors: ValidationError[] = []

  skills.forEach((skill, index) => {
    if (!skill.name.trim()) {
      errors.push({ field: `skill_${index}_name`, message: `Skill name is required for skill ${index + 1}` })
    }
  })

  return errors
}

export const validateProjects = (projects: Project[]): ValidationError[] => {
  const errors: ValidationError[] = []

  projects.forEach((project, index) => {
    if (!project.title.trim()) {
      errors.push({ field: `project_${index}_title`, message: `Project title is required for project ${index + 1}` })
    }
    if (!project.description.trim()) {
      errors.push({
        field: `project_${index}_description`,
        message: `Project description is required for project ${index + 1}`,
      })
    }
  })

  return errors
}

export const validateCertifications = (certifications: Certification[]): ValidationError[] => {
  const errors: ValidationError[] = []

  certifications.forEach((cert, index) => {
    if (!cert.title.trim()) {
      errors.push({
        field: `cert_${index}_title`,
        message: `Certification title is required for certification ${index + 1}`,
      })
    }
    if (!cert.issuer.trim()) {
      errors.push({ field: `cert_${index}_issuer`, message: `Issuer is required for certification ${index + 1}` })
    }
    if (!cert.year.trim()) {
      errors.push({ field: `cert_${index}_year`, message: `Year is required for certification ${index + 1}` })
    }
  })

  return errors
}
