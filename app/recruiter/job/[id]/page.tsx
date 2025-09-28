"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Building, Calendar, AlertCircle } from "lucide-react"
import { api, Job } from "@/lib/api"
// Import RecruiterPortalHeader component
import { RecruiterPortalHeader } from "@/components/recruiter-portal-header"

export default function JobDetailPage() {
  const params = useParams()
  // Ensure jobId is number type
  const jobId = Number(params.id)

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applicationCount, setApplicationCount] = useState(0)

  // TODO: Get actual company ID from company state
  const COMPANY_ID = 1

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        // 1. Fetch job details
        const jobResponse = await api.jobs.getById(jobId)

        if (jobResponse.success && jobResponse.data) {
          setJob(jobResponse.data)

          // 2. Fetch application count for this job
          try {
            const applicationsResponse = await api.applications.listByJobAndCompany(jobId, COMPANY_ID)
            if (applicationsResponse.success && applicationsResponse.data) {
              setApplicationCount(applicationsResponse.data.length)
            } else {
              setApplicationCount(0)
            }
          } catch (e) {
            console.error("Failed to fetch application count:", e)
            setApplicationCount(0)
          }
        } else {
          throw new Error(jobResponse.error || "Failed to load job details.")
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

  // --- Loading state ---
  if (loading) {
    return (
        <div className="min-h-screen bg-background">
          {/* Use RecruiterPortalHeader component with back button */}
          <RecruiterPortalHeader
              showBackButton={true}
              backHref="/recruiter"
              pageTitle="Job Details"
          />
          <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sot-red"></div>
            <p className="text-muted-foreground ml-4">Loading job details...</p>
          </div>
        </div>
    )
  }

  // --- Error state ---
  if (error || !job) {
    return (
        <div className="min-h-screen bg-background">
          <RecruiterPortalHeader
              showBackButton={true}
              backHref="/recruiter"
              pageTitle="Job Details"
          />
          <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="text-center max-w-md p-8 bg-card rounded-lg shadow-lg">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Job Not Found</h2>
              <p className="text-muted-foreground mb-4">{error || "The job you're looking for doesn't exist."}</p>
              <Link href="/recruiter">
                <Button className="bg-sot-red hover:bg-sot-red/90 text-white">Back to Recruiter Portal</Button>
              </Link>
            </div>
          </div>
        </div>
    )
  }

  // --- Normal display ---
  return (
      <div className="min-h-screen bg-background">
        {/* Use RecruiterPortalHeader component */}
        <RecruiterPortalHeader
            showBackButton={true}
            backHref="/recruiter"
            pageTitle="Job Details"
        />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Job Header */}
            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl text-foreground mb-2">{job.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-muted-foreground mb-4">
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
                    <div className="text-2xl font-bold text-sot-red mb-2">{job.salary}</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Application Stats Card */}
            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Application Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sot-red/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-sot-red" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Applications</p>
                      <p className="text-2xl font-bold text-foreground">{applicationCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Posted</p>
                      <p className="text-lg font-semibold text-foreground">
                        {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                    className="prose prose-gray max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
  )
}
