"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Users, Building, Calendar } from "lucide-react"
import { AssessmentModal } from "@/components/assessment-modal"
import { api, Job } from "@/lib/api" // 假设你的api.ts放在lib目录下

export default function JobDetailPage() {
  const params = useParams()
  const jobId = Number(params.id)
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAssessment, setShowAssessment] = useState(false)
  const [hasAssessment, setHasAssessment] = useState(false)

  useEffect(() => {
    async function fetchJob() {
      setLoading(true)
      setError(null)
      const response = await api.jobs.getById(jobId)
      if (response.success && response.data) {
        setJob(response.data)
      } else {
        setError(response.error || "Failed to load job details.")
        setJob(null)
      }
      setLoading(false)
    }

    fetchJob()

    // 检查本地有没有该职位的评估结果
    const savedAssessment = localStorage.getItem(`assessment_${jobId}`)
    setHasAssessment(!!savedAssessment)
  }, [jobId])

  const handleAssessmentComplete = (assessmentResult: any) => {
    localStorage.setItem(`assessment_${jobId}`, JSON.stringify(assessmentResult))
    setHasAssessment(true)
    setShowAssessment(false)
  }

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600">Loading job details...</p>
        </div>
    )
  }

  if (error || !job) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-4">{error || "The job you're looking for doesn't exist."}</p>
            <Link href="/student">
              <Button className="bg-red-600 hover:bg-red-700 text-white">Back to Jobs</Button>
            </Link>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link href="/student">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Jobs
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
                        {/* 这里你可以改用实际数据，如果后端有传postedDate或者duration可以展示 */}
                        <span>{job.experience}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600 mb-2">{job.salary}</div>
                    <div className="text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{job.applicants} applicants</span>
                      </div>
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
