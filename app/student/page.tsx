"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Star, Clock, Users, ArrowLeft, AlertCircle, FileText } from "lucide-react"
import { JobCard } from "@/components/job-card"
import { AssessmentModal } from "@/components/assessment-modal"
import { api } from "@/lib/api"
import { Job } from "@/lib/api"

export default function StudentPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showAssessment, setShowAssessment] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applicationCount, setApplicationCount] = useState(0)

  // TODO: Replace with dynamic user ID from auth/context
  const currentUserId = 1

  // Fetch recommended jobs and applications data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 并行获取推荐工作和申请数据
        const [jobsResponse, applicationsResponse] = await Promise.all([
          api.jobs.recommendForApplicant(currentUserId),
          api.applications.listByApplicant(currentUserId)
        ])

        // 处理工作数据
        if (jobsResponse.success && jobsResponse.data) {
          setJobs(jobsResponse.data)
        } else {
          // 如果推荐失败，回退到获取所有工作
          console.warn("Failed to fetch recommended jobs, falling back to all jobs:", jobsResponse.error)
          const fallbackResponse = await api.jobs.getAll({ limit: 50 })

          if (fallbackResponse.success && fallbackResponse.data) {
            setJobs(fallbackResponse.data)
          } else {
            setError("Failed to load jobs. Please try again later.")
            return
          }
        }

        // 处理申请数据
        if (applicationsResponse.success && applicationsResponse.data) {
          setApplicationCount(applicationsResponse.data.length)

          // 标记已申请的工作
          const appliedJobIds = applicationsResponse.data.map(app => app.job_id)
          setJobs(prevJobs =>
              prevJobs.map(job => ({
                ...job,
                isApplied: appliedJobIds.includes(job.id)
              }))
          )
        } else {
          console.warn("Failed to fetch applications:", applicationsResponse.error)
          // 申请数据获取失败时，仍然使用localStorage作为备用
          const localApplications = JSON.parse(localStorage.getItem("applications") || "[]")
          setApplicationCount(localApplications.length)
        }

      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentUserId])

  const filteredJobs = jobs.filter(
      (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleApply = async (jobId: number) => {
    const job = jobs.find((j) => j.id === jobId)
    if (!job) return

    try {
      // 使用API创建申请
      const response = await api.applications.applyToJob(jobId, currentUserId)

      if (response.success) {
        // 更新本地状态
        setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, isApplied: true } : j)))
        setApplicationCount((prev) => prev + 1)

        // 可选：仍然保存到localStorage作为备用
        const applicationData = {
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          appliedAt: new Date().toISOString(),
          status: "applied",
        }
        localStorage.setItem(`application_${jobId}`, JSON.stringify(applicationData))

        const existingApplications = JSON.parse(localStorage.getItem("applications") || "[]")
        existingApplications.push(applicationData)
        localStorage.setItem("applications", JSON.stringify(existingApplications))
      } else {
        alert("Failed to submit application. Please try again.")
        console.error("Application failed:", response.error)
      }
    } catch (error) {
      alert("Failed to submit application. Please try again.")
      console.error("Error applying for job:", error)
    }
  }

  const handleAssess = (job: Job) => {
    setSelectedJob(job)
    setShowAssessment(true)
  }

  const handleAssessmentComplete = (assessmentResult: any) => {
    // Update job with new match score from assessment
    setJobs((prev) =>
        prev.map((job) =>
            job.id === selectedJob?.id
                ? { ...job, matchScore: assessmentResult.score.overall }
                : job,
        ),
    )
    setShowAssessment(false)
    setSelectedJob(null)

    // Navigate to assessment results page
    if (selectedJob?.id) {
      window.location.href = `/student/job/${selectedJob.id}/assessment`
    }
  }

  const handleRetry = () => {
    window.location.reload()
  }

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50">
          {/* 新的移动端友好Header */}
          <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3">
              {/* Desktop Layout */}
              <div className="hidden md:flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Link href="/">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </Link>
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">SoT</span>
                  </div>
                  <h1 className="text-lg font-semibold text-gray-900">Student Portal</h1>
                </div>
                <div className="flex items-center space-x-3">
                  <Link href="/student/applications">
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Applications ({applicationCount})
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden flex items-center justify-between">
                {/* Left side */}
                <div className="flex items-center space-x-2">
                  <Link href="/">
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </Link>
                  <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">SoT</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Portal</span>
                </div>

                {/* Right side */}
                <Link href="/student/applications">
                  <Button
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-600 hover:bg-red-50 text-xs px-3 py-1.5 h-8"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    {applicationCount}
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading recommended jobs...</p>
            </div>
          </div>
        </div>
    )
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gray-50">
          {/* 新的移动端友好Header */}
          <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3">
              {/* Desktop Layout */}
              <div className="hidden md:flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Link href="/">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </Link>
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">SoT</span>
                  </div>
                  <h1 className="text-lg font-semibold text-gray-900">Student Portal</h1>
                </div>
                <div className="flex items-center space-x-3">
                  <Link href="/student/applications">
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Applications ({applicationCount})
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden flex items-center justify-between">
                {/* Left side */}
                <div className="flex items-center space-x-2">
                  <Link href="/">
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </Link>
                  <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">SoT</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Portal</span>
                </div>

                {/* Right side */}
                <Link href="/student/applications">
                  <Button
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-600 hover:bg-red-50 text-xs px-3 py-1.5 h-8"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    {applicationCount}
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="text-center max-w-md">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={handleRetry} className="bg-red-600 hover:bg-red-700">
                Try Again
              </Button>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-50">
        {/* 新的移动端友好Header */}
        <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">SoT</span>
                </div>
                <h1 className="text-lg font-semibold text-gray-900">Student Portal</h1>
              </div>
              <div className="flex items-center space-x-3">
                <Link href="/student/applications">
                  <Button
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Applications ({applicationCount})
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden flex items-center justify-between">
              {/* Left side - Back button */}
              <Link href="/">
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>

              {/* Center - Logo and Portal text */}
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">SoT</span>
                </div>
                <span className="text-sm font-medium text-gray-900">Portal</span>
              </div>

              {/* Right side - Applications button */}
              <Link href="/student/applications">
                <Button
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-600 hover:bg-red-50 text-xs px-3 py-1.5 h-8"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  {applicationCount}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-balance">Find Your Perfect Summer Tech Role</h2>
            <p className="text-gray-600 text-lg">
              Use AI technology to assess your CV match with internship opportunities and get personalized career advice
            </p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                  placeholder="Search roles, companies or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Roles</p>
                    <p className="text-xl font-bold text-gray-900">{jobs.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:border-red-300 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Applications</p>
                    <p className="text-xl font-bold text-gray-900">{applicationCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Assessment Time</p>
                    <p className="text-xl font-bold text-gray-900">{"<2s"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {searchTerm ? `Search Results (${filteredJobs.length})` : `Recommended Jobs (${filteredJobs.length})`}
              </h3>
              {searchTerm && (
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchTerm("")}
                      className="text-gray-600 hover:text-gray-900"
                  >
                    Clear Search
                  </Button>
              )}
            </div>

            {filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm ? "No jobs match your search" : "No recommended jobs found"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm
                        ? "Try adjusting your search terms or browse all available positions."
                        : "Check back later for new opportunities or update your profile preferences."}
                  </p>
                  {searchTerm && (
                      <Button
                          variant="outline"
                          onClick={() => setSearchTerm("")}
                      >
                        View All Jobs
                      </Button>
                  )}
                </div>
            ) : (
                filteredJobs.map((job) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onAssess={() => handleAssess(job)}
                        onApply={handleApply}
                        showAssessButton={true}
                    />
                ))
            )}
          </div>
        </main>

        {showAssessment && selectedJob && (
            <AssessmentModal
                job={selectedJob}
                onClose={() => setShowAssessment(false)}
                onComplete={handleAssessmentComplete}
            />
        )}
      </div>
  )
}
