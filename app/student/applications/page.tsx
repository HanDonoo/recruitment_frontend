"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Building, Calendar } from "lucide-react"

interface Application {
  jobId: number
  jobTitle: string
  company: string
  appliedAt: string
  status: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    const savedApplications = JSON.parse(localStorage.getItem("applications") || "[]")
    setApplications(
      savedApplications.sort(
        (a: Application, b: Application) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
      ),
    )
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800"
      case "reviewing":
        return "bg-yellow-100 text-yellow-800"
      case "interview":
        return "bg-purple-100 text-purple-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h2>
            <p className="text-gray-600 text-lg">Track the status of your internship applications</p>
          </div>

          {/* Applications List */}
          {applications.length === 0 ? (
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
                      <div>
                        <CardTitle className="text-lg text-gray-900 mb-1">{application.jobTitle}</CardTitle>
                        <div className="flex items-center space-x-4 text-gray-600 text-sm">
                          <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span className="font-medium">{application.company}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Applied {formatDate(application.appliedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Application ID: #{application.jobId.toString().padStart(4, "0")}
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
