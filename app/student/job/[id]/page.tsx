"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Building, Calendar, AlertCircle } from "lucide-react"
import { AssessmentModal } from "@/components/assessment-modal"
import { api, Job } from "@/lib/api"
import { Header } from "@/components/header"


export default function JobDetailPage() {
  const params = useParams()
  const jobId = Number(params.id)

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAssessment, setShowAssessment] = useState(false)
  const [hasAssessment, setHasAssessment] = useState(false)
  const [applicationCount, setApplicationCount] = useState(0)

  // TODO: 从登录用户状态获取实际用户ID
  const currentApplicantId = 1

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        // 1. 并行获取 Job 详情、评估状态和应用计数
        const [jobResponse, assessmentResponse, applicationsResponse] = await Promise.all([
          api.jobs.getById(jobId),
          api.assessment.checkAssessment(currentApplicantId, jobId),
          api.applications.listByApplicant(currentApplicantId)
        ])

        // 检查 Job 详情
        if (jobResponse.success && jobResponse.data) {
          setJob(jobResponse.data)
        } else {
          throw new Error(jobResponse.error || "Failed to load job details.")
        }

        // 设置评估状态
        if (assessmentResponse.success && assessmentResponse.data) {
          setHasAssessment(assessmentResponse.data.hasAssessment)
        } else {
          setHasAssessment(false)
          console.error("Failed to fetch assessment status:", assessmentResponse.error)
        }

        // 设置申请计数
        if (applicationsResponse.success && applicationsResponse.data) {
          setApplicationCount(applicationsResponse.data.length)
        } else {
          console.error("Failed to fetch application count:", applicationsResponse.error)
          // 失败时默认为 0
          setApplicationCount(0)
        }

      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred.")
        setJob(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [jobId])

  const handleAssessmentComplete = (assessmentResult: any) => {
    // 假设评估完成即代表已完成
    setHasAssessment(true)
    setShowAssessment(false)
  }

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50">
          <Header
              variant="student"
              applicationCount={applicationCount}
              showBackButton={true}
          />
          <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="text-gray-600 ml-4">Loading job details...</p>
          </div>
        </div>
    )
  }

  if (error || !job) {
    return (
        <div className="min-h-screen bg-gray-50">
          <Header
              variant="student"
              applicationCount={applicationCount}
              showBackButton={true}
          />
          <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
              <p className="text-gray-600 mb-4">{error || "The job you're looking for doesn't exist."}</p>
              <Link href="/student">
                <Button className="bg-red-600 hover:bg-red-700 text-white">Back to Jobs</Button>
              </Link>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <Header
            variant="student"
            applicationCount={applicationCount}
            showBackButton={true}
            backHref="/student"
        />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Job Header */}
            <Card className="bg-white border-gray-200 mb-6">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl text-gray-900 mb-2">{job.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{job.experience}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.tags && Array.isArray(job.tags) && job.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600 mb-2">{job.salary}</div>
                    <div className="text-sm text-gray-600 mb-4">
                    </div>
                    <div className="space-y-2">
                      <Button
                          onClick={() => setShowAssessment(true)}
                          className="bg-red-600 hover:bg-red-700 text-white w-full"
                      >
                        Assess My Match
                      </Button>
                      {hasAssessment && (
                          <Link href={`/student/job/${job.id}/assessment`}>
                            <Button
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-50 w-full bg-transparent"
                            >
                              View My Assessment
                            </Button>
                          </Link>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Assessment Modal */}
        {showAssessment && (
            <AssessmentModal
                job={job}
                onClose={() => setShowAssessment(false)}
                onComplete={handleAssessmentComplete}
            />
        )}
      </div>
  )
}
