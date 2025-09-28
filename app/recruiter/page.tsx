"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Users, Eye, Star, Award, ArrowLeft, Loader2 } from "lucide-react"
import { JobCard } from "@/components/job-card"
import { CandidateList } from "@/components/candidate-list"
// 🚀 核心修改：引入通用的 Header 组件
import { Header } from "@/components/header"
import { api, Job, Candidate, ApplicationOut } from "@/lib/api"

interface CandidateWithApplication extends Candidate {
  status?: string;
  appliedAt?: string;
  score?: number;
  jobId?: number;
  applicationId?: number
}

export default function RecruiterPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [candidates, setCandidates] = useState<CandidateWithApplication[]>([])
  const [isCandidatesLoading, setIsCandidatesLoading] = useState(false)

  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showTopCandidates, setShowTopCandidates] = useState(false)

  // TODO MOOCK COMPANY_ID
  const COMPANY_ID = 1

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await api.jobs.getByCompanyId(COMPANY_ID)

        if (result.success && result.data) {
          setJobs(result.data)
        } else {
          setError(result.error || "Failed to load job data.")
        }
      } catch (e: any) {
        setError(e.message || "An unexpected error occurred while fetching jobs.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const fetchCandidatesForJob = useCallback(async (jobId: number) => {
    setIsCandidatesLoading(true)
    setCandidates([])
    setError(null)

    try {
      const appResult = await api.applications.listByJobAndCompany(jobId, COMPANY_ID)

      if (!appResult.success || !appResult.data) {
        if (appResult.error) throw new Error(appResult.error);
        setIsCandidatesLoading(false)
        return
      }

      const applicationOuts: ApplicationOut[] = appResult.data;

      if (applicationOuts.length === 0) {
        setIsCandidatesLoading(false)
        return
      }

      const applicantIds = applicationOuts.map(app => app.applicant_id)

      const candidateResult = await api.applicants.getByIds(applicantIds)

      if (!candidateResult.success || !candidateResult.data) {
        throw new Error(candidateResult.error || "Failed to load candidate details.")
      }

      const fetchedCandidates = candidateResult.data;

      const assessmentPromises = fetchedCandidates.map(candidate => {
        const application = applicationOuts.find(app => app.applicant_id === candidate.id)

        if (application) {
          return api.assessment.getLatestAssessment(application.applicant_id, application.job_id)
        }
        return Promise.resolve({ success: true, data: undefined })
      })

      const assessmentResults = await Promise.all(assessmentPromises)

      const candidatesWithScore: CandidateWithApplication[] = fetchedCandidates.map((candidate, index) => {
        const assessmentResult = assessmentResults[index]
        const application = applicationOuts.find(app => app.applicant_id === candidate.id)

        let scoreValue: number | undefined = undefined;
        if (assessmentResult.success && assessmentResult.data) {
          scoreValue = assessmentResult.data.score?.overall;
        }

        return {
          ...candidate,
          status: application?.status || 'pending',
          appliedAt: application?.created_at,
          score: scoreValue,
          jobId: application?.job_id,
          applicationId: application?.applicant_id
        }
      })

      setCandidates(candidatesWithScore)
      console.log("candidatesWithScore", candidatesWithScore)

    } catch (e: any) {
      setError(e.message || "An unexpected error occurred while fetching candidates.")
    } finally {
      setIsCandidatesLoading(false)
    }
  }, [])

  const handleViewCandidates = (job: Job) => {
    setSelectedJob(job)
    fetchCandidatesForJob(job.id)
  }

  const handleBackToJobs = () => {
    setSelectedJob(null)
    setCandidates([])
    setShowTopCandidates(false)
    setError(null)
  }

  // 修正点 3: 排序时使用 score 属性
  const getTopCandidates = (): CandidateWithApplication[] => {
    const sorted = candidates.sort((a, b) => (b.score || -1) - (a.score || -1))
    return sorted.slice(0, 5)
  }

  const filteredCandidates = candidates.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const displayCandidates: CandidateWithApplication[] = selectedJob
      ? showTopCandidates
          ? getTopCandidates()
          : filteredCandidates
      : []

  // 统计数据占位符
  const totalApplications = "1"
  const averageScore = "80"
  const jobsWithCandidates = "1"

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-sot-red" />
          <p className="mt-4 text-lg text-sot-red">Loading your posted roles...</p>
        </div>
    )
  }

  if (error && !selectedJob) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background">
          <p className="text-xl font-bold text-red-600">Job Data Fetch Error</p>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <p className="mt-4 text-sm text-sot-red">Please ensure the backend API is running and accessible.</p>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-background">
        {/* 🚀 核心修改：使用通用的 Header 组件，设置 variant="recruiter" */}
        <Header
            variant="recruiter"
            showBackButton={!!selectedJob} // 在选中 Job 时显示 Back 按钮
            backHref="/recruiter" // 返回 Recruiter Portal 根目录
        />

        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2 text-balance">Smart Recruitment Platform</h2>
            <p className="text-muted-foreground text-lg">
              Use AI technology to quickly screen the best candidates and improve recruitment efficiency
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-sot-red/10 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-sot-red" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Roles</p>
                    <p className="text-xl font-bold text-foreground">{jobs.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Applications</p>
                    <p className="text-xl font-bold text-foreground">{totalApplications}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-xl font-bold text-foreground">{averageScore}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-sot-red/10 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-sot-red" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jobs with Candidates</p>
                    <p className="text-xl font-bold text-foreground">{jobsWithCandidates}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {!selectedJob ? (
              // Job List View
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">Posted Roles ({jobs.length})</h3>
                </div>

                <div className="space-y-4">
                  {jobs.map((job) => (
                      <JobCard
                          key={job.id}
                          job={job}
                          onViewCandidates={() => handleViewCandidates(job)}
                          showViewButton={true}
                      />
                  ))}
                  {jobs.length === 0 && !isLoading && (
                      <p className="text-center text-muted-foreground py-12">
                        No roles posted for your company yet. Start by posting a new role!
                      </p>
                  )}
                </div>
              </div>
          ) : (
              // Candidates View for Selected Job
              <div className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <Button
                      variant="outline"
                      onClick={handleBackToJobs}
                      className="border-sot-red text-sot-red hover:bg-sot-red hover:text-white bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Jobs
                  </Button>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{selectedJob.title} - Candidates</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedJob.company} • {selectedJob.location}
                    </p>
                  </div>
                </div>

                {isCandidatesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-sot-red" />
                      <p className="ml-2 text-sot-red">Loading candidates and assessments...</p>
                    </div>
                ) : error && selectedJob ? (
                    <p className="text-center text-red-500 py-12">Error loading candidates: {error}</p>
                ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium text-foreground">Candidate List ({displayCandidates.length})</h4>
                        <div className="flex space-x-2">
                          <Button
                              variant={showTopCandidates ? "default" : "outline"}
                              onClick={() => setShowTopCandidates(true)}
                              className={
                                showTopCandidates
                                    ? "bg-sot-red hover:bg-sot-red-dark text-white"
                                    : "border-sot-red text-sot-red hover:bg-sot-red hover:text-white"
                              }
                              disabled={displayCandidates.length === 0 || candidates.every(c => c.score === undefined || c.score === null)}
                          >
                            <Award className="w-4 h-4 mr-2" />
                            Top 5
                          </Button>
                          <Button
                              variant={!showTopCandidates ? "default" : "outline"}
                              onClick={() => setShowTopCandidates(false)}
                              className={
                                !showTopCandidates
                                    ? "bg-sot-red hover:bg-sot-red-dark text-white"
                                    : "border-sot-red text-sot-red hover:bg-sot-red hover:text-white"
                              }
                          >
                            All Candidates
                          </Button>
                        </div>
                      </div>

                      <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search candidates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-card border-border focus:border-sot-red"
                        />
                      </div>

                      {displayCandidates.length > 0 ? (
                          <CandidateList candidates={displayCandidates as any} />
                      ) : (
                          <p className="text-center text-muted-foreground py-12">
                            No candidates have applied to this role yet.
                          </p>
                      )}
                    </>
                )}
              </div>
          )}
        </main>
      </div>
  )
}
