"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Resume } from "@/types/resume"

export function useResumeData(resumeId: string) {
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Load resume data from Supabase
  const loadResume = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase.from("resumes").select("*").eq("id", resumeId).single()

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          // Resume not found, create a new one
          const newResume: Partial<Resume> = {
            id: resumeId,
            user_id: "temp-user-id", // Replace with actual user ID from auth
            title: "Untitled Resume",
            work_experience: [],
            education: [],
            skills: [],
            projects: [],
            certifications: [],
            languages: [],
            interests: [],
          }

          const { data: createdData, error: createError } = await supabase
            .from("resumes")
            .insert([newResume])
            .select()
            .single()

          if (createError) throw createError
          setResume(createdData)
        } else {
          throw fetchError
        }
      } else {
        setResume(data)
      }
    } catch (err) {
      console.error("Error loading resume:", err)
      setError(err instanceof Error ? err.message : "Failed to load resume")
    } finally {
      setLoading(false)
    }
  }

  // Save resume data to Supabase
  const saveResume = async (resumeData: Partial<Resume>) => {
    try {
      setSaving(true)
      setError(null)

      const updateData = {
        ...resumeData,
        updated_at: new Date().toISOString(),
      }

      const { data, error: updateError } = await supabase
        .from("resumes")
        .update(updateData)
        .eq("id", resumeId)
        .select()
        .single()

      if (updateError) throw updateError

      setResume(data)
      return data
    } catch (err) {
      console.error("Error saving resume:", err)
      setError(err instanceof Error ? err.message : "Failed to save resume")
      throw err
    } finally {
      setSaving(false)
    }
  }

  // Auto-save to localStorage
  const saveToLocalStorage = (resumeData: Resume) => {
    try {
      localStorage.setItem(`resume-${resumeId}`, JSON.stringify(resumeData))
    } catch (err) {
      console.error("Error saving to localStorage:", err)
    }
  }

  // Load from localStorage on mount
  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem(`resume-${resumeId}`)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        return parsedData
      }
    } catch (err) {
      console.error("Error loading from localStorage:", err)
    }
    return null
  }

  useEffect(() => {
    // First try to load from localStorage for immediate display
    const localData = loadFromLocalStorage()
    if (localData) {
      setResume(localData)
      setLoading(false)
    }

    // Then load from Supabase
    loadResume()
  }, [resumeId])

  return {
    resume,
    setResume,
    loading,
    error,
    saving,
    saveResume,
    saveToLocalStorage,
    loadResume,
  }
}
