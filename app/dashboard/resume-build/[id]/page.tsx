"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useReactToPrint } from "react-to-print";
import {
  Palette,
  Trash2,
  Download,
  ArrowLeft,
  Save,
  ArrowRight,
  Plus,
  ChevronUp,
  ChevronDown,
  Upload,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  AlertCircle,
  Loader2,
  MoveDiagonal,
} from "lucide-react";
import { useResumeData } from "@/hooks/useResumeData";
import { StarRating } from "@/components/StarRating";
import {
  validateProfile,
  validateContact,
  validateWorkExperience,
  validateEducation,
  validateSkills,
  validateProjects,
  validateCertifications,
} from "@/utils/validations";
import type {
  Resume,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certification,
  Language,
  FormSection,
  ValidationError,
} from "@/types/resume";
import { useUser } from "@stackframe/stack";
import RenderResume from "@/components/ResumeTemplates/RenderResume";
import { title } from "process";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // ✅ Add this
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResumeEditor() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.id as string;
  const user = useUser();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    resume,
    setResume,
    loading,
    error,
    saving,
    saveResume,
    saveToLocalStorage,
  } = useResumeData(resumeId);
  const [inputValue, setInputValue] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<FormSection>("profile");
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [progress, setProgress] = useState(0);
  const [openPreviewModel, setOpenPreviewModel] = useState(false);
  const [open, setOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [baseWidth, setBaseWidth] = useState(800);
  const resumeRef = useRef<HTMLDivElement>(null);
  const resumeDownloadRef = useRef(null);

  const predefinedPalettes: string[][] = [
    ["#ffffff", "#f8fafc", "#e2e8f0", "#94a3b8", "#1e293b"],
    ["#fef2f2", "#fecaca", "#f87171", "#ef4444", "#b91c1c"],
    ["#ecfdf5", "#a7f3d0", "#34d399", "#10b981", "#064e3b"],
    ["#eff6ff", "#93c5fd", "#3b82f6", "#2563eb", "#1e40af"],
    ["#fdf4ff", "#f0abfc", "#e879f9", "#c026d3", "#701a75"],
    ["#fff7ed", "#fdba74", "#fb923c", "#ea580c", "#9a3412"],
  ];

  const isValidUrl = (value: string) => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  useEffect(() => {
    // Only show the image if it's a valid URL
    if (isValidUrl(inputValue)) {
      setImageSrc(inputValue);
    } else {
      // base64 or invalid URLs should not be rendered
      setImageSrc(null);
    }
  }, [inputValue]);

  const handleDeleteResume = async () => {
    setIsDeleting(true);
    const { error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", resumeId);

    setIsDeleting(false);

    if (error) {
      console.error("Delete error:", error.message);
      return;
    }

    // Navigate away after deletion
    router.push("/dashboard/resume-build"); // or your default page
  };

  //download
  const reactToPrintFn = useReactToPrint({ contentRef: resumeDownloadRef });

  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);
  });
  // Extract first and last name from full_name when resume loads

  // Auto-save to localStorage whenever resume data changes
  useEffect(() => {
    if (resume) {
      saveToLocalStorage(resume);
    }
  }, [resume, saveToLocalStorage]);

  // Auto-save to localStorage when first/last name changes

  const validateCurrentSection = (): boolean => {
    if (!resume) return false;

    let errors: ValidationError[] = [];

    switch (currentSection) {
      case "profile":
        errors = validateProfile(resume.full_name);
        break;
      case "contact":
        errors = validateContact(resume);
        break;
      case "experience":
        errors = validateWorkExperience(resume.work_experience || []);
        break;
      case "education":
        errors = validateEducation(resume.education || []);
        break;
      case "skills":
        errors = validateSkills(resume.skills || []);
        break;
      case "projects":
        errors = validateProjects(resume.projects || []);
        break;
      case "certifications":
        errors = validateCertifications(resume.certifications || []);
        break;
      case "additional":
        errors = [];
        break;
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNext = async () => {
    if (validateCurrentSection()) {
      const nextSection = getNextSection();
      if (nextSection) {
        setCurrentSection(nextSection);
        // Save to Supabase when moving to next section
        if (resume) {
          try {
            await saveResume(resume);
          } catch (err) {
            console.error("Failed to save to Supabase:", err);
          }
        }
      }
    }
  };

  const handleSave = async () => {
    if (resume) {
      try {
        await saveResume(resume);
      } catch (err) {
        console.error("Failed to save to Supabase:", err);
      }
    }
  };

  const updateResume = (updates: Partial<Resume>) => {
    if (resume) {
      setResume({ ...resume, ...updates });
    }
  };

  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      company: "",
      role: "",
      start_date: "",
      end_date: "",
      currently_working: false,
      description: "",
    };
    updateResume({
      work_experience: [...(resume?.work_experience || []), newExp],
    });
  };

  const updateWorkExperience = (
    id: string,
    field: keyof WorkExperience,
    value: any
  ) => {
    updateResume({
      work_experience: resume?.work_experience?.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const moveWorkExperience = (id: string, direction: "up" | "down") => {
    const experiences = [...(resume?.work_experience || [])];
    const index = experiences.findIndex((exp) => exp.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= experiences.length) return;
    [experiences[index], experiences[newIndex]] = [
      experiences[newIndex],
      experiences[index],
    ];

    updateResume({ work_experience: experiences });
  };

  const deleteWorkExperience = (id: string) => {
    updateResume({
      work_experience: resume?.work_experience?.filter((exp) => exp.id !== id),
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      start_date: "",
      end_date: "",
    };
    updateResume({
      education: [...(resume?.education || []), newEdu],
    });
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    updateResume({
      education: resume?.education?.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const moveEducation = (id: string, direction: "up" | "down") => {
    const education = [...(resume?.education || [])];
    const index = education.findIndex((edu) => edu.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= education.length) return;
    [education[index], education[newIndex]] = [
      education[newIndex],
      education[index],
    ];

    updateResume({ education });
  };

  const deleteEducation = (id: string) => {
    updateResume({
      education: resume?.education?.filter((edu) => edu.id !== id),
    });
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      proficiency: 1,
    };
    updateResume({
      skills: [...(resume?.skills || []), newSkill],
    });
  };

  const updateSkill = (
    id: string,
    field: keyof Skill,
    value: string | number
  ) => {
    updateResume({
      skills: resume?.skills?.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const deleteSkill = (id: string) => {
    updateResume({
      skills: resume?.skills?.filter((skill) => skill.id !== id),
    });
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "",
      description: "",
      github_link: "",
      live_demo_url: "",
    };
    updateResume({
      projects: [...(resume?.projects || []), newProject],
    });
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    updateResume({
      projects: resume?.projects?.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      ),
    });
  };

  const deleteProject = (id: string) => {
    updateResume({
      projects: resume?.projects?.filter((project) => project.id !== id),
    });
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      title: "",
      issuer: "",
      year: "",
    };
    updateResume({
      certifications: [...(resume?.certifications || []), newCert],
    });
  };

  const updateCertification = (
    id: string,
    field: keyof Certification,
    value: string
  ) => {
    updateResume({
      certifications: resume?.certifications?.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    });
  };

  const deleteCertification = (id: string) => {
    updateResume({
      certifications: resume?.certifications?.filter((cert) => cert.id !== id),
    });
  };

  const addLanguage = () => {
    const newLang: Language = {
      id: Date.now().toString(),
      name: "",
      proficiency: 1,
    };
    updateResume({
      languages: [...(resume?.languages || []), newLang],
    });
  };

  const updateLanguage = (
    id: string,
    field: keyof Language,
    value: string | number
  ) => {
    updateResume({
      languages: resume?.languages?.map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      ),
    });
  };

  const deleteLanguage = (id: string) => {
    updateResume({
      languages: resume?.languages?.filter((lang) => lang.id !== id),
    });
  };

  const addInterest = () => {
    updateResume({
      interests: [...(resume?.interests || []), ""],
    });
  };

  const updateInterest = (index: number, value: string) => {
    updateResume({
      interests: resume?.interests?.map((interest, i) =>
        i === index ? value : interest
      ),
    });
  };

  const deleteInterest = (index: number) => {
    updateResume({
      interests: resume?.interests?.filter((_, i) => i !== index),
    });
  };

  const getSectionTitle = () => {
    switch (currentSection) {
      case "profile":
        return "Profile Form";
      case "contact":
        return "Contact Form";
      case "experience":
        return "Work Experience";
      case "education":
        return "Education";
      case "skills":
        return "Skills";
      case "projects":
        return "Projects";
      case "certifications":
        return "Certifications";
      case "additional":
        return "Additional Information";
      default:
        return "Profile Form";
    }
  };

  const getNextSection = (): FormSection | null => {
    const sections: FormSection[] = [
      "profile",
      "contact",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "additional",
    ];
    const currentIndex = sections.indexOf(currentSection);
    return currentIndex < sections.length - 1
      ? sections[currentIndex + 1]
      : null;
  };

  const handleSelectPalette = (palette: string[]) => {
    updateResume({ template_color_pallette: palette });
    setOpen(false);
  };

  const handleCustomSubmit = () => {
    try {
      const parsed = JSON.parse(customInput);
      if (
        Array.isArray(parsed) &&
        parsed.length === 5 &&
        parsed.every((c) => typeof c === "string")
      ) {
        handleSelectPalette(parsed);
      } else {
        alert("Please enter a valid array of 5 color strings.");
      }
    } catch {
      alert("Invalid JSON array.");
    }
  };

  const getPrevSection = (): FormSection | null => {
    const sections: FormSection[] = [
      "profile",
      "contact",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "additional",
    ];
    const currentIndex = sections.indexOf(currentSection);
    return currentIndex > 0 ? sections[currentIndex - 1] : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading resume...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Resume not found</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              {resume.title}
            </h1>
            <div className="flex items-center gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpen(true)}
                  >
                    <Palette className="w-4 h-4" />
                    <span className="hidden md:inline ml-2">Theme</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {predefinedPalettes.map((palette, index) => (
                      <button
                        key={index}
                        className="flex space-x-1 cursor-pointer border p-1 rounded"
                        onClick={() => handleSelectPalette(palette)}
                      >
                        {palette.map((color, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Custom Palette (JSON array of 5 colors)
                    </label>
                    <Input
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder='e.g. ["#000", "#111", "#222", "#333", "#444"]'
                    />
                    <Button
                      className="mt-2 w-full"
                      size="sm"
                      onClick={handleCustomSubmit}
                    >
                      Apply Custom
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden md:inline ml-2">Delete</span>
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    Are you sure you want to delete this resume?
                  </DialogHeader>
                  <p>This action cannot be undone.</p>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteResume}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log("Button clicked"); // Debug
                  setOpenPreviewModel(true);
                }}
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline ml-2">Export</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
            {/* Left Column - Form */}
            <div className="overflow-y-auto">
              <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getSectionTitle()}
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {getPrevSection() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentSection(getPrevSection()!)}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden md:inline ml-2">Back</span>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      <Save className="w-4 h-4" />
                      <span className="hidden md:inline ml-2">Save</span>
                    </Button>
                    {getNextSection() && (
                      <Button size="sm" onClick={handleNext}>
                        <span className="hidden md:inline mr-2">Next</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Validation Errors */}
                  {validationErrors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1">
                          {validationErrors.map((error, index) => (
                            <li key={index}>{error.message}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Profile Section */}
                  {currentSection === "profile" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Profile Image
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {imageSrc ? (
                              <img
                                src={imageSrc}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <Upload className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="Profile image URL"
                              value={inputValue}
                              onChange={(e) => {
                                const value = e.target.value;
                                setInputValue(value);
                                updateResume({ profile_preview_url: value }); // optionally sync to DB
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            First Name *
                          </label>
                          <Input
                            value={resume.full_name}
                            onChange={(e) =>
                              updateResume({ full_name: e.target.value })
                            }
                            placeholder="Enter first name"
                            className={
                              validationErrors.some(
                                (e) => e.field === "full_name"
                              )
                                ? "border-red-500"
                                : ""
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Last Name *
                          </label>
                          <Input
                            value={resume.designation}
                            onChange={(e) =>
                              updateResume({ designation: e.target.value })
                            }
                            placeholder="Designation"
                            className={
                              validationErrors.some(
                                (e) => e.field === "full_name"
                              )
                                ? "border-red-500"
                                : ""
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Professional Summary
                        </label>
                        <Textarea
                          value={resume.summary || ""}
                          onChange={(e) =>
                            updateResume({ summary: e.target.value })
                          }
                          placeholder="Write a brief summary about yourself..."
                          rows={4}
                        />
                      </div>
                    </div>
                  )}

                  {/* Contact Section */}
                  {currentSection === "contact" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <MapPin className="w-4 h-4 inline mr-2" />
                          Address
                        </label>
                        <Input
                          value={resume.contact_location || ""}
                          onChange={(e) =>
                            updateResume({ contact_location: e.target.value })
                          }
                          placeholder="City, State, Country"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email *
                          </label>
                          <Input
                            type="email"
                            value={resume.contact_email || ""}
                            onChange={(e) =>
                              updateResume({ contact_email: e.target.value })
                            }
                            placeholder="your.email@example.com"
                            className={
                              validationErrors.some(
                                (e) => e.field === "contact_email"
                              )
                                ? "border-red-500"
                                : ""
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Phone *
                          </label>
                          <Input
                            value={resume.contact_phone || ""}
                            onChange={(e) =>
                              updateResume({ contact_phone: e.target.value })
                            }
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        * Either email or phone is required
                      </p>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <Linkedin className="w-4 h-4 inline mr-2" />
                          LinkedIn
                        </label>
                        <Input
                          value={resume.contact_linkedin || ""}
                          onChange={(e) =>
                            updateResume({ contact_linkedin: e.target.value })
                          }
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <Github className="w-4 h-4 inline mr-2" />
                          GitHub
                        </label>
                        <Input
                          value={resume.contact_github || ""}
                          onChange={(e) =>
                            updateResume({ contact_github: e.target.value })
                          }
                          placeholder="https://github.com/yourusername"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <Globe className="w-4 h-4 inline mr-2" />
                          Portfolio Website
                        </label>
                        <Input
                          value={resume.contact_website || ""}
                          onChange={(e) =>
                            updateResume({ contact_website: e.target.value })
                          }
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </div>
                  )}

                  {/* Work Experience Section */}
                  {currentSection === "experience" && (
                    <div className="space-y-6">
                      {resume.work_experience?.map((exp, index) => (
                        <Card key={exp.id} className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">
                              Experience {index + 1}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => moveWorkExperience(exp.id, "up")}
                                disabled={index === 0}
                              >
                                <ChevronUp className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  moveWorkExperience(exp.id, "down")
                                }
                                disabled={
                                  index ===
                                  (resume.work_experience?.length || 0) - 1
                                }
                              >
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteWorkExperience(exp.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <Input
                              placeholder="Company *"
                              value={exp.company}
                              onChange={(e) =>
                                updateWorkExperience(
                                  exp.id,
                                  "company",
                                  e.target.value
                                )
                              }
                              className={
                                validationErrors.some(
                                  (e) => e.field === `work_${index}_company`
                                )
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            <Input
                              placeholder="Role *"
                              value={exp.role}
                              onChange={(e) =>
                                updateWorkExperience(
                                  exp.id,
                                  "role",
                                  e.target.value
                                )
                              }
                              className={
                                validationErrors.some(
                                  (e) => e.field === `work_${index}_role`
                                )
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Start Date *
                              </label>
                              <Input
                                type="date"
                                value={exp.start_date}
                                onChange={(e) =>
                                  updateWorkExperience(
                                    exp.id,
                                    "start_date",
                                    e.target.value
                                  )
                                }
                                className={
                                  validationErrors.some(
                                    (e) =>
                                      e.field === `work_${index}_start_date` ||
                                      e.field === `work_${index}_dates`
                                  )
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                End Date
                              </label>
                              <Input
                                type="date"
                                value={exp.end_date || ""}
                                onChange={(e) =>
                                  updateWorkExperience(
                                    exp.id,
                                    "end_date",
                                    e.target.value
                                  )
                                }
                                disabled={exp.currently_working}
                                className={
                                  validationErrors.some(
                                    (e) =>
                                      e.field === `work_${index}_end_date` ||
                                      e.field === `work_${index}_dates`
                                  )
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              <label className="flex items-center mt-2">
                                <input
                                  type="checkbox"
                                  checked={exp.currently_working}
                                  onChange={(e) =>
                                    updateWorkExperience(
                                      exp.id,
                                      "currently_working",
                                      e.target.checked
                                    )
                                  }
                                  className="mr-2"
                                />
                                Currently working here
                              </label>
                            </div>
                          </div>

                          <Textarea
                            placeholder="Job description..."
                            value={exp.description}
                            onChange={(e) =>
                              updateWorkExperience(
                                exp.id,
                                "description",
                                e.target.value
                              )
                            }
                            rows={3}
                          />
                        </Card>
                      ))}

                      <Button
                        onClick={addWorkExperience}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Work Experience
                      </Button>
                    </div>
                  )}

                  {/* Education Section */}
                  {currentSection === "education" && (
                    <div className="space-y-6">
                      {resume.education?.map((edu, index) => (
                        <Card key={edu.id} className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">
                              Education {index + 1}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => moveEducation(edu.id, "up")}
                                disabled={index === 0}
                              >
                                <ChevronUp className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => moveEducation(edu.id, "down")}
                                disabled={
                                  index === (resume.education?.length || 0) - 1
                                }
                              >
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteEducation(edu.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <Input
                              placeholder="Degree *"
                              value={edu.degree}
                              onChange={(e) =>
                                updateEducation(
                                  edu.id,
                                  "degree",
                                  e.target.value
                                )
                              }
                              className={
                                validationErrors.some(
                                  (e) => e.field === `edu_${index}_degree`
                                )
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            <Input
                              placeholder="Institution *"
                              value={edu.institution}
                              onChange={(e) =>
                                updateEducation(
                                  edu.id,
                                  "institution",
                                  e.target.value
                                )
                              }
                              className={
                                validationErrors.some(
                                  (e) => e.field === `edu_${index}_institution`
                                )
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Start Date *
                              </label>
                              <Input
                                type="date"
                                value={edu.start_date}
                                onChange={(e) =>
                                  updateEducation(
                                    edu.id,
                                    "start_date",
                                    e.target.value
                                  )
                                }
                                className={
                                  validationErrors.some(
                                    (e) =>
                                      e.field === `edu_${index}_start_date` ||
                                      e.field === `edu_${index}_dates`
                                  )
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                End Date *
                              </label>
                              <Input
                                type="date"
                                value={edu.end_date}
                                onChange={(e) =>
                                  updateEducation(
                                    edu.id,
                                    "end_date",
                                    e.target.value
                                  )
                                }
                                className={
                                  validationErrors.some(
                                    (e) =>
                                      e.field === `edu_${index}_end_date` ||
                                      e.field === `edu_${index}_dates`
                                  )
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                            </div>
                          </div>
                        </Card>
                      ))}

                      <Button
                        onClick={addEducation}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                  )}

                  {/* Skills Section */}
                  {currentSection === "skills" && (
                    <div className="space-y-4">
                      {resume.skills?.map((skill, index) => (
                        <Card key={skill.id} className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <Input
                                placeholder="Skill name *"
                                value={skill.name}
                                onChange={(e) =>
                                  updateSkill(skill.id, "name", e.target.value)
                                }
                                className={
                                  validationErrors.some(
                                    (e) => e.field === `skill_${index}_name`
                                  )
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                Proficiency:
                              </span>
                              <StarRating
                                rating={skill.proficiency}
                                onRatingChange={(rating) =>
                                  updateSkill(skill.id, "proficiency", rating)
                                }
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteSkill(skill.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}

                      <Button
                        onClick={addSkill}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Skill
                      </Button>
                    </div>
                  )}

                  {/* Projects Section */}
                  {currentSection === "projects" && (
                    <div className="space-y-6">
                      {resume.projects?.map((project, index) => (
                        <Card key={project.id} className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">Project {index + 1}</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteProject(project.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <Input
                              placeholder="Project title *"
                              value={project.title}
                              onChange={(e) =>
                                updateProject(
                                  project.id,
                                  "title",
                                  e.target.value
                                )
                              }
                              className={
                                validationErrors.some(
                                  (e) => e.field === `project_${index}_title`
                                )
                                  ? "border-red-500"
                                  : ""
                              }
                            />

                            <Textarea
                              placeholder="Project description *"
                              value={project.description}
                              onChange={(e) =>
                                updateProject(
                                  project.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={3}
                              className={
                                validationErrors.some(
                                  (e) =>
                                    e.field === `project_${index}_description`
                                )
                                  ? "border-red-500"
                                  : ""
                              }
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input
                                placeholder="GitHub link"
                                value={project.github_link || ""}
                                onChange={(e) =>
                                  updateProject(
                                    project.id,
                                    "github_link",
                                    e.target.value
                                  )
                                }
                              />
                              <Input
                                placeholder="Live demo URL"
                                value={project.live_demo_url || ""}
                                onChange={(e) =>
                                  updateProject(
                                    project.id,
                                    "live_demo_url",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </Card>
                      ))}

                      <Button
                        onClick={addProject}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    </div>
                  )}

                  {/* Certifications Section */}
                  {currentSection === "certifications" && (
                    <div className="space-y-4">
                      {resume.certifications?.map((cert, index) => (
                        <Card key={cert.id} className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">
                              Certification {index + 1}
                            </h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteCertification(cert.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                              placeholder="Certification title *"
                              value={cert.title}
                              onChange={(e) =>
                                updateCertification(
                                  cert.id,
                                  "title",
                                  e.target.value
                                )
                              }
                              className={
                                validationErrors.some(
                                  (e) => e.field === `cert_${index}_title`
                                )
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            <Input
                              placeholder="Issuer *"
                              value={cert.issuer}
                              onChange={(e) =>
                                updateCertification(
                                  cert.id,
                                  "issuer",
                                  e.target.value
                                )
                              }
                              className={
                                validationErrors.some(
                                  (e) => e.field === `cert_${index}_issuer`
                                )
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            <Input
                              placeholder="Year *"
                              value={cert.year}
                              onChange={(e) =>
                                updateCertification(
                                  cert.id,
                                  "year",
                                  e.target.value
                                )
                              }
                              className={
                                validationErrors.some(
                                  (e) => e.field === `cert_${index}_year`
                                )
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                          </div>
                        </Card>
                      ))}

                      <Button
                        onClick={addCertification}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Certification
                      </Button>
                    </div>
                  )}

                  {/* Additional Information Section */}
                  {currentSection === "additional" && (
                    <div className="space-y-8">
                      {/* Languages */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Languages</h3>
                        <div className="space-y-4">
                          {resume.languages?.map((lang) => (
                            <Card key={lang.id} className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="flex-1">
                                  <Input
                                    placeholder="Language"
                                    value={lang.name}
                                    onChange={(e) =>
                                      updateLanguage(
                                        lang.id,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">
                                    Proficiency:
                                  </span>
                                  <StarRating
                                    rating={lang.proficiency}
                                    onRatingChange={(rating) =>
                                      updateLanguage(
                                        lang.id,
                                        "proficiency",
                                        rating
                                      )
                                    }
                                  />
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteLanguage(lang.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}

                          <Button
                            onClick={addLanguage}
                            variant="outline"
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Language
                          </Button>
                        </div>
                      </div>

                      {/* Interests */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Interests</h3>
                        <div className="space-y-4">
                          {resume.interests?.map((interest, index) => (
                            <Card key={index} className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="flex-1">
                                  <Input
                                    placeholder="Interest"
                                    value={interest}
                                    onChange={(e) =>
                                      updateInterest(index, e.target.value)
                                    }
                                  />
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteInterest(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}

                          <Button
                            onClick={addInterest}
                            variant="outline"
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Interest
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Preview */}
            <div
              ref={resumeRef}
              className="bg-white rounded-lg border border-gray-200 p-6 overflow-auto max-w-full max-h-full"
              style={{ width: "100%", height: "100%" }}
            >
              <div className="w-full h-full max-w-full max-h-full overflow-auto">
                <RenderResume
                  templateId={resume?.template_theme || ""}
                  resumeData={resume}
                  colorPalette={resume?.template_color_pallette || ""}
                  containerWidth={baseWidth}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={openPreviewModel} onOpenChange={setOpenPreviewModel}>
        <DialogContent className="w-full p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>{resume?.title || "Resume Preview"}</DialogTitle>
          </DialogHeader>

          <div className="p-4 overflow-y-auto max-h-[75vh]">
            <div ref={resumeDownloadRef}>
              <RenderResume
                templateId={resume?.template_theme || ""}
                resumeData={resume}
                colorPalette={resume?.template_color_pallette || ""}
                containerWidth={baseWidth}
              />
            </div>
          </div>

          <DialogFooter className="p-4 border-t flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="ghost">Close</Button>
            </DialogClose>
            <Button onClick={() => reactToPrintFn()}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
