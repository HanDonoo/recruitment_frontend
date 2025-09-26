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
}

export interface Candidate {
  id: number
  name: string
  email: string
  university: string
  major: string
  year: string
  skills: string[]
  resumeUrl: string
  appliedJobs: number[]
  overallScore?: number
  assessments?: AssessmentResult[]
}

export interface AssessmentResult {
  jobId: number
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

// 后端返回的原始数据结构
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

// 数据转换工具函数
const transformBackendJobToFrontend = (backendJob: BackendJob): Job => {
  return {
    id: backendJob.id,
    title: backendJob.title,
    company: backendJob.company_name,
    location: backendJob.location,
    salary: backendJob.salary,
    experience: backendJob.role, // 将role映射为experience
    tags: backendJob.skill_tags ? backendJob.skill_tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
    description: backendJob.description,
    applicants: 0, // 后端暂无此字段，设为默认值
    matchScore: backendJob.matchScore,
    feedback: undefined // 后端暂无此字段
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

  // Candidate endpoints
  candidates: {
    getAll: async (): Promise<ApiResponse<Candidate[]>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/candidates`)
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

    getByJobId: async (jobId: number): Promise<ApiResponse<Candidate[]>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/candidates`)
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

    getTopCandidates: async (jobId: number, limit = 5): Promise<ApiResponse<Candidate[]>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/candidates/top?limit=${limit}`)
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
  },
}

// 使用示例
/*
// 获取所有工作
const jobsResponse = await api.jobs.getAll({ q: "python", role: "backend" })
if (jobsResponse.success) {
  console.log(jobsResponse.data) // Job[] 格式，tags已转换为数组
}

// 创建工作
const newJobResponse = await api.jobs.create({
  title: "Senior Developer",
  company: "Tech Corp",
  location: "Remote",
  salary: "$100k",
  experience: "backend",
  tags: ["Python", "FastAPI", "PostgreSQL"],
  description: "Great job"
})

// 获取推荐工作
const recommendationsResponse = await api.jobs.recommendForApplicant(123)
if (recommendationsResponse.success) {
  console.log(recommendationsResponse.data) // 包含matchScore的Job[]
}
*/
