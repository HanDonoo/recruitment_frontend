// API interfaces for backend integration

// 保持原有的前端接口定义不变
export interface Job {
  id: number
  title: string
  company: string
  location: string
  salary: string
  experience: string
  tags: string[]
  description: string
  applicants: number
  matchScore?: number
  feedback?: string
  createdAt: string
}

export interface Candidate {
  id: number
  name: string
  email: string
  university: string
  major: string
  year: string
  skills: string[]
  desired_role: string
  desired_location?: string
}

export interface AssessmentResult {
  jobId: number
  applicantId: number
  summary: string
  score: {
    overall: number
    skills_match: number
    experience_depth: number
    education_match: number
    potential_fit: number
  }
  assessment_highlights: string[]
  recommendations_for_candidate: string[]
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface BackendJob {
  id: number
  title: string
  company_name: string
  location: string
  salary: string
  role: string
  employment_type: string
  skill_tags: string
  description: string
  created_at: string
  matchScore?: number
}

interface BackendJobCreate {
  title: string
  company_name: string
  location: string
  salary: string
  role: string
  employment_type: string
  skill_tags: string
  description: string
}

interface ApplicationCreate {
  applicant_id: number
  job_id: number
}

export interface ApplicationOut {
  id: number
  applicant_id: number
  job_id: number
  job_assessment_id?: number | null
  status: string
  created_at: string
  updated_at: string
}

export interface Interview {
  id: number
  application_id: number
  job_id: number
  applicant_id: number
  company_id: number
  interviewer_id?: number | null
  scheduled_time: string
  duration_minutes?: number | null
  type: string
  location_url?: string | null
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'
  notes?: string | null
  created_at: string
}

export interface InterviewCreate {
  application_id: number
  job_id: number
  applicant_id: number
  company_id: number
  interviewer_id?: number | null
  scheduled_time: string
  duration_minutes?: number | null
  type: string
  location_url?: string | null
  status?: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'
  notes?: string | null
}

// 数据转换工具函数
const transformBackendJobToFrontend = (backendJob: BackendJob): Job => {
  return {
    id: backendJob.id,
    title: backendJob.title,
    company: backendJob.company_name,
    location: backendJob.location,
    salary: backendJob.salary,
    experience: backendJob.role,
    tags: backendJob.skill_tags ? backendJob.skill_tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
    description: backendJob.description,
    applicants: 0,
    matchScore: backendJob.matchScore,
    feedback: undefined,
    createdAt: backendJob.created_at
  }
}

const transformFrontendJobToBackend = (frontendJob: Omit<Job, "id" | "applicants" | "matchScore" | "feedback">): BackendJobCreate => {
  return {
    title: frontendJob.title,
    company_name: frontendJob.company,
    location: frontendJob.location,
    salary: frontendJob.salary,
    role: frontendJob.experience, // 将experience映射为role
    employment_type: "full-time", // 默认值，可以根据需要调整
    skill_tags: frontendJob.tags.join(', '),
    description: frontendJob.description
  }
}

// API endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export const api = {
  // Job endpoints
  jobs: {

    getByCompanyId: async (
        companyId: number,
        params?: { q?: string; limit?: number }
    ): Promise<ApiResponse<Job[]>> => {
      try {
        const searchParams = new URLSearchParams()
        searchParams.append('company_id', companyId.toString())
        if (params?.q) searchParams.append('q', params.q)
        if (params?.limit) searchParams.append('limit', params.limit.toString())

        const url = `${API_BASE_URL}/jobs/by_company?${searchParams.toString()}`

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const backendJobs: BackendJob[] = await response.json()
        const frontendJobs = backendJobs.map(transformBackendJobToFrontend)

        return {
          success: true,
          data: frontendJobs
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    },

    getByIds: async (jobIds: number[]): Promise<ApiResponse<Job[]>> => {
      try {
        const jobIdsString = jobIds.join(",")

        const url = `${API_BASE_URL}/jobs/list_by_job_ids?job_ids=${jobIdsString}`

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        // 后端返回的数据转换
        const backendJobs: BackendJob[] = await response.json()
        const frontendJobs = backendJobs.map(transformBackendJobToFrontend)

        return {
          success: true,
          data: frontendJobs
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    },
    getAll: async (params?: {
      q?: string
      role?: string
      location?: string
      limit?: number
    }): Promise<ApiResponse<Job[]>> => {
      try {
        const searchParams = new URLSearchParams()
        if (params?.q) searchParams.append('q', params.q)
        if (params?.role) searchParams.append('role', params.role)
        if (params?.location) searchParams.append('location', params.location)
        if (params?.limit) searchParams.append('limit', params.limit.toString())

        const url = `${API_BASE_URL}/jobs${searchParams.toString() ? '?' + searchParams.toString() : ''}`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const backendJobs: BackendJob[] = await response.json()
        const frontendJobs = backendJobs.map(transformBackendJobToFrontend)

        return {
          success: true,
          data: frontendJobs
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    },

    getById: async (id: number): Promise<ApiResponse<Job>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const backendJob: BackendJob = await response.json()
        const frontendJob = transformBackendJobToFrontend(backendJob)

        return {
          success: true,
          data: frontendJob
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    },

    create: async (job: Omit<Job, "id" | "applicants" | "matchScore" | "feedback">): Promise<ApiResponse<Job>> => {
      try {
        const backendJobData = transformFrontendJobToBackend(job)

        const response = await fetch(`${API_BASE_URL}/jobs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(backendJobData),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const backendJob: BackendJob = await response.json()
        const frontendJob = transformBackendJobToFrontend(backendJob)

        return {
          success: true,
          data: frontendJob
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    },

    recommendForApplicant: async (applicantId: number): Promise<ApiResponse<Job[]>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs/recommend/${applicantId}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const backendJobs: BackendJob[] = await response.json()
        const frontendJobs = backendJobs.map(transformBackendJobToFrontend)

        return {
          success: true,
          data: frontendJobs
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    },
  },

  // Applicant endpoints
  applicants: {
    getAll: async (): Promise<ApiResponse<Candidate[]>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/applicants`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return {
          success: true,
          data: await response.json()
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    },

    getById: async (applicantId: number): Promise<ApiResponse<Candidate>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/applicants/${applicantId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return {
          success: true,
          data: await response.json()
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    },

    getFilteredApplicants: async (
        q: string | null = null,
        desired_role: string | null = null,
        desired_location: string | null = null,
        limit: number = 50,
        offset: number = 0
    ): Promise<ApiResponse<Candidate[]>> => {
      try {
        let url = `${API_BASE_URL}/applicants?q=${q || ""}&desired_role=${desired_role || ""}&desired_location=${desired_location || ""}&limit=${limit}&offset=${offset}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return {
          success: true,
          data: await response.json()
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    },

    getByIds: async (applicantIds: number[]): Promise<ApiResponse<Candidate[]>> => {
      try {
        // 将 applicantIds 数组转化为逗号分隔的字符串
        const idsString = applicantIds.join(',');

        const response = await fetch(`${API_BASE_URL}/applicants/by_ids?applicant_ids=${idsString}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawCandidates: any[] = await response.json();

        const candidates: Candidate[] = rawCandidates.map(rawCandidate => {

          const skillsArray = (rawCandidate.skill_tags as string)
              ? rawCandidate.skill_tags
                  .split(',')
                  .map((s: string) => s.trim())
                  .filter((s: string) => s.length > 0)
              : [];
          const { skill_tags, ...rest } = rawCandidate;

          return {
            ...rest,
            skills: skillsArray,
          } as Candidate;
        });

        return {
          success: true,
          data: candidates
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  },

  // Assessment endpoints
  assessment: {
    assessResume: async (jobId: number, resumeFile: File): Promise<ApiResponse<AssessmentResult>> => {
      try {
        const formData = new FormData()
        formData.append("file", resumeFile)  // 这里 key 改为 "file" 跟后端参数名对应

        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/assess`, {  // URL 里加 jobId
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    },

    getAssessmentHistory: async (candidateId: number): Promise<ApiResponse<AssessmentResult[]>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}/assessments`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return await response.json()
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    },

    checkAssessment: async (applicantId: number, jobId: number): Promise<ApiResponse<{ hasAssessment: boolean, assessment?: AssessmentResult }>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/job-assessments/latest?applicant_id=${applicantId}&job_id=${jobId}`)

        if (response.status === 404) {
          // 没有找到评估记录
          return {
            success: true,
            data: { hasAssessment: false }
          }
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const assessmentData = await response.json()
        return {
          success: true,
          data: {
            hasAssessment: true,
            assessment: assessmentData
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    },

    getLatestAssessment: async (applicantId: number, jobId: number): Promise<ApiResponse<AssessmentResult>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/job-assessments/latest?applicant_id=${applicantId}&job_id=${jobId}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const assessmentData = await response.json()
        return {
          success: true,
          data: assessmentData
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    },
  },

  applications: {
    applyToJob: async (applicantId: number, jobId: number): Promise<ApiResponse<ApplicationOut>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/applications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicant_id: applicantId,
            job_id: jobId,
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText || `HTTP error! status: ${response.status}`)
        }

        const data: ApplicationOut = await response.json()

        return {
          success: true,
          data,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    },

    getApplication: async (
        applicantId: number,
        jobId: number
    ): Promise<ApiResponse<ApplicationOut | null>> => {
      try {
        const url = new URL(`${API_BASE_URL}/applications/one`)
        url.searchParams.append("applicant_id", applicantId.toString())
        url.searchParams.append("job_id", jobId.toString())

        const response = await fetch(url.toString(), {
          method: "GET",
        })

        if (!response.ok) {
          if (response.status === 404) {
            // 404 表示没找到申请记录，返回 null
            return { success: true, data: null }
          }
          const errorText = await response.text()
          throw new Error(errorText || `HTTP error! status: ${response.status}`)
        }

        const data: ApplicationOut | null = await response.json()

        return {
          success: true,
          data,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    },

    listByApplicant: async (
        applicantId: number,
        limit = 50,
        offset = 0
    ): Promise<ApiResponse<ApplicationOut[]>> => {
      try {
        const url = new URL(`${API_BASE_URL}/applications`)
        url.searchParams.append("applicant_id", applicantId.toString())
        url.searchParams.append("limit", limit.toString())
        url.searchParams.append("offset", offset.toString())

        const response = await fetch(url.toString(), {
          method: "GET",
        })

        if (!response.ok) {
          if (response.status === 404) {
            return { success: true, data: [] }
          }
          const errorText = await response.text()
          throw new Error(errorText || `HTTP error! status: ${response.status}`)
        }

        const data: ApplicationOut[] = await response.json()

        return {
          success: true,
          data,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    },

    listByJobAndCompany: async (
        jobId: number,
        companyId: number,
        limit: number = 50,
        offset: number = 0
    ): Promise<ApiResponse<ApplicationOut[]>> => {
      try {
        const url = new URL(`${API_BASE_URL}/applications/by_job_and_company`)

        url.searchParams.append("job_id", jobId.toString())
        url.searchParams.append("company_id", companyId.toString())
        url.searchParams.append("limit", limit.toString())
        url.searchParams.append("offset", offset.toString())

        const response = await fetch(url.toString(), {
          method: "GET",
        })

        if (!response.ok) {
          if (response.status === 404) {
            // 后端在没有结果时返回 404，我们返回空数组
            return { success: true, data: [] }
          }
          const errorText = await response.text()
          throw new Error(errorText || `HTTP error! status: ${response.status}`)
        }

        const data: ApplicationOut[] = await response.json()

        return {
          success: true,
          data,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    },
  },

  interviews: {
    create: async (interview: InterviewCreate): Promise<ApiResponse<Interview>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/interviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(interview),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: Interview = await response.json()
        return {
          success: true,
          data,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    },

    list: async (params?: {
      applicant_id?: number
      job_id?: number
      company_id?: number
      limit?: number
      offset?: number
    }): Promise<ApiResponse<Interview[]>> => {
      try {
        const query = new URLSearchParams()
        if (params?.applicant_id) query.append('applicant_id', params.applicant_id.toString())
        if (params?.job_id) query.append('job_id', params.job_id.toString())
        if (params?.company_id) query.append('company_id', params.company_id.toString())
        if (params?.limit) query.append('limit', params.limit.toString())
        if (params?.offset) query.append('offset', params.offset.toString())

        const response = await fetch(`${API_BASE_URL}/interviews?${query.toString()}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: Interview[] = await response.json()
        return {
          success: true,
          data,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    },

    updateStatus: async (
        interviewId: number,
        newStatus: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'
    ): Promise<ApiResponse<Interview>> => {
      try {
        const response = await fetch(
            `${API_BASE_URL}/interviews/${interviewId}/status?new_status=${newStatus}`,
            {
              method: 'PATCH',
            }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: Interview = await response.json()
        return {
          success: true,
          data,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    },
  }
}
