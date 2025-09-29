"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Building, Calendar, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react"
import { api, ApplicationOut, Job } from "@/lib/api"
import { Header } from "@/components/header"

interface Application {
  jobId: number
  jobTitle: string
  company: string
  appliedAt: string
  status: string
}

const CURRENT_APPLICANT_ID = 1

const statusProgression = {
  applied: { step: 1, total: 5, label: "Applied", color: "blue" },
  under_review: { step: 2, total: 5, label: "Under Review", color: "yellow" },
  interview_scheduled: { step: 3, total: 5, label: "Interview Scheduled", color: "purple" },
  final_review: { step: 4, total: 5, label: "Final Review", color: "orange" },
  accepted: { step: 5, total: 5, label: "Accepted", color: "green" },
  rejected: { step: 0, total: 5, label: "Not Selected", color: "red" },
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    under_review: 0,
    interview_scheduled: 0,
    accepted: 0,
    rejected: 0,
  })

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const applicationsResponse = await api.applications.listByApplicant(CURRENT_APPLICANT_ID)

        if (!applicationsResponse.success || !applicationsResponse.data) {
          throw new Error(applicationsResponse.error || "Failed to fetch application list.")
        }

        const applicationOuts: ApplicationOut[] = applicationsResponse.data

        if (applicationOuts.length === 0) {
          setApplications([])
          setStats({ total: 0, applied: 0, under_review: 0, interview_scheduled: 0, accepted: 0, rejected: 0 })
          return
        }

        const jobIds = applicationOuts.map(app => app.job_id)

        const jobsResponse = await api.jobs.getByIds(jobIds)

        if (!jobsResponse.success || !jobsResponse.data) {
          throw new Error(jobsResponse.error || "Failed to fetch job details.")
        }

        const jobDetails: Job[] = jobsResponse.data

        const jobDetailsMap = new Map(jobDetails.map(job => [job.id, job]))

        const combinedApplications: Application[] = applicationOuts
            .map(app => {
              const jobDetail = jobDetailsMap.get(app.job_id)

              if (!jobDetail) {
                console.warn(`Job detail not found for Job ID: ${app.job_id}`)
                return null
              }

              return {
                jobId: app.job_id,
                jobTitle: jobDetail.title,
                company: jobDetail.company,
                appliedAt: app.created_at,
                status: app.status.toLowerCase(),
              } as Application
            })
            .filter((app): app is Application => app !== null)

        const sortedApplications = combinedApplications.sort(
            (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
        )

        setApplications(sortedApplications)

        const newStats = {
          total: sortedApplications.length,
          applied: sortedApplications.filter(app => app.status === "applied").length,
          under_review: sortedApplications.filter(app => app.status === "under_review").length,
          interview_scheduled: sortedApplications.filter(app => app.status === "interview_scheduled").length,
          accepted: sortedApplications.filter(app => app.status === "accepted").length,
          rejected: sortedApplications.filter(app => app.status === "rejected").length,
        }
        setStats(newStats)

      } catch (e) {
        console.error("Error fetching applications:", e)
        setError(e instanceof Error ? e.message : "An unknown error occurred while fetching applications.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    const statusInfo = statusProgression[status as keyof typeof statusProgression]
    if (!statusInfo) return "bg-gray-100 text-gray-800"

    const colorMap = {
      blue: "bg-blue-100 text-blue-800",
      yellow: "bg-yellow-100 text-yellow-800",
      purple: "bg-purple-100 text-purple-800",
      orange: "bg-orange-100 text-orange-800",
      green: "bg-green-100 text-green-800",
      red: "bg-red-100 text-red-800",
    }
    return colorMap[statusInfo.color as keyof typeof colorMap] || "bg-gray-100 text-gray-800"
  }

  const getProgressPercentage = (status: string) => {
    const statusInfo = statusProgression[status as keyof typeof statusProgression]
    if (!statusInfo) return 0
    // Rejected is a final state, often shown as 100% completion of the process, but off the main path.
    if (status === "rejected") return 100
    return (statusInfo.step / statusInfo.total) * 100
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <Header
            variant="student"
            applicationCount={stats.total}
            showBackButton={true}
            backHref="/student"
        />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h2>
              <p className="text-gray-600 text-lg">Track the status and progress of your internship applications</p>
            </div>

            {isLoading && (
                <Card className="p-8 text-center">
                  <Clock className="w-5 h-5 mr-2 animate-spin inline-block text-gray-500" />
                  <span className="text-lg font-semibold text-gray-600 ml-2">Loading applications...</span>
                </Card>
            )}

            {error && !isLoading && (
                <Card className="p-8 text-center bg-red-50 border-red-200">
                  <div className="text-lg font-semibold text-red-700">
                    Error Loading Data: {error}
                  </div>
                  <p className="text-sm text-red-500 mt-2">Please check your network connection or API configuration.</p>
                </Card>
            )}

            {!isLoading && applications.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Applied</p>
                          <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">In Progress</p>
                          <p className="text-xl font-bold text-gray-900">
                            {stats.applied + stats.under_review + stats.interview_scheduled}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Accepted</p>
                          <p className="text-xl font-bold text-gray-900">{stats.accepted}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                          <XCircle className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Not Selected</p>
                          <p className="text-xl font-bold text-gray-900">{stats.rejected}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
            )}

            {!isLoading && applications.length === 0 && !error ? (
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                    <p className="text-gray-600 mb-6">
                      You haven't applied to any positions yet. Start exploring opportunities!
                    </p>
                    <Link href="/student">
                      <Button className="bg-red-600 hover:bg-red-700 text-white">Browse Jobs</Button>
                    </Link>
                  </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {applications.length} Application{applications.length !== 1 ? "s" : ""}
                    </h3>
                  </div>

                  {applications.map((application, index) => (
                      <Card key={index} className="bg-white border-gray-200 hover:border-red-300 transition-colors">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg text-gray-900 mb-1">{application.jobTitle}</CardTitle>
                              <div className="flex items-center space-x-4 text-gray-600 text-sm mb-3">
                                <div className="flex items-center space-x-1">
                                  <Building className="w-4 h-4" />
                                  <span className="font-medium">{application.company}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>Applied {formatDate(application.appliedAt)}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Application Progress</span>
                                  <Badge className={getStatusColor(application.status)}>
                                    {statusProgression[application.status as keyof typeof statusProgression]?.label ||
                                        application.status}
                                  </Badge>
                                </div>
                                <Progress value={getProgressPercentage(application.status)} className="h-2" />
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                            </div>
                            <div className="flex space-x-2">
                              <Link href={`/student/job/${application.jobId}`}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                                >
                                  View Job
                                </Button>
                              </Link>
                              <Link href={`/student/job/${application.jobId}/assessment`}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                                >
                                  View Assessment
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                  ))}
                </div>
            )}
          </div>
        </main>
      </div>
  )
}
