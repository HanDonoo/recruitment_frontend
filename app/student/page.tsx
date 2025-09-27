"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Star, Clock, Users, ArrowLeft, AlertCircle } from "lucide-react"
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

  // Calculate average match score
  const avgMatchScore = jobs.length > 0
      ? Math.round(jobs.reduce((sum, job) => sum + (job.matchScore || 0), 0) / jobs.length)
      : 0

  // Fetch recommended jobs
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        setLoading(true)
        setError(null)

        // TODO: Replace with dynamic applicant ID from auth/context
        const applicantId = 1

        const response = await api.jobs.recommendForApplicant(applicantId)

        if (response.success && response.data) {
          setJobs(response.data)
        } else {
          // 如果推荐失败，回退到获取所有工作
          console.warn("Failed to fetch recommended jobs, falling back to all jobs:", response.error)
          const fallbackResponse = await api.jobs.getAll({ limit: 50 })

          if (fallbackResponse.success && fallbackResponse.data) {
            setJobs(fallbackResponse.data)
          } else {
            setError("Failed to load jobs. Please try again later.")
          }
        }
      } catch (err) {
        console.error("Error fetching jobs:", err)
        setError("Failed to load jobs. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendedJobs()
  }, [])

  const filteredJobs = jobs.filter(
      (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleApply = async (jobId: number) => {
    const job = jobs.find((j) => j.id === jobId)
    if (!job) return

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Save application status
    const applicationData = {
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      appliedAt: new Date().toISOString(),
      status: "applied",
    }

    localStorage.setItem(`application_${jobId}`, JSON.stringify(applicationData))

    // Update applications list
    const existingApplications = JSON.parse(localStorage.getItem("applications") || "[]")
    existingApplications.push(applicationData)
    localStorage.setItem("applications", JSON.stringify(existingApplications))

    // Update local state
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, isApplied: true } : j)))
    setApplicationCount((prev) => prev + 1)
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading recommended jobs...</p>
          </div>
        </div>
    )
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRetry} className="bg-red-600 hover:bg-red-700">
              Try Again
            </Button>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
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
                <h1 className="text-xl font-bold text-gray-900">Summer of Tech</h1>
              </div>
              <Badge className="bg-red-600 text-white hover:bg-red-700">Student Portal</Badge>
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

            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Match Score</p>
                    <p className="text-xl font-bold text-gray-900">{avgMatchScore}%</p>
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
