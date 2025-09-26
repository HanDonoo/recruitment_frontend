"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, TrendingUp, BookOpen, Target, Award } from "lucide-react"
import { AssessmentRadarChart } from "@/components/radar-chart"

export default function AssessmentResultPage() {
  const params = useParams()
  const jobId = Number.parseInt(params.id as string)
  const [assessment, setAssessment] = useState<any>(null)
  const [jobTitle, setJobTitle] = useState("")

  useEffect(() => {
    // Load assessment result from localStorage
    const savedAssessment = localStorage.getItem(`assessment_${jobId}`)
    if (savedAssessment) {
      const assessmentData = JSON.parse(savedAssessment)
      setAssessment(assessmentData)
      setJobTitle(assessmentData.jobTitle || "Job Position")
    }
  }, [jobId])

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Assessment Found</h2>
          <p className="text-gray-600 mb-4">You haven't completed an assessment for this job yet.</p>
          <Link href={`/student/job/${jobId}`}>
            <Button className="bg-red-600 hover:bg-red-700 text-white">Take Assessment</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Award className="w-4 h-4" />
    if (score >= 60) return <TrendingUp className="w-4 h-4" />
    return <Target className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href={`/student/job/${jobId}`}>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Job
                </Button>
              </Link>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">SoT</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Assessment Results</h1>
            </div>
            <Badge className="bg-red-600 text-white hover:bg-red-700">Student Portal</Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Overall Score */}
          <Card className="bg-white border-gray-200 mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Assessment Results for {jobTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-6 h-6 text-yellow-500" />
                    <span className="text-3xl font-bold text-gray-900">{assessment.score.overall}%</span>
                    <span className="text-lg text-gray-600">Overall Match</span>
                  </div>
                  <p className="text-gray-600">{assessment.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Radar Chart */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AssessmentRadarChart data={assessment.score} />
                </div>
              </CardContent>
            </Card>

            {/* Individual Scores */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Detailed Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "skills_match", label: "Skills Match", icon: <Target className="w-4 h-4" /> },
                  { key: "experience_depth", label: "Experience Depth", icon: <TrendingUp className="w-4 h-4" /> },
                  { key: "education_match", label: "Education Match", icon: <BookOpen className="w-4 h-4" /> },
                  { key: "potential_fit", label: "Potential Fit", icon: <Award className="w-4 h-4" /> },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${getScoreColor(assessment.score[item.key])}`}>{item.icon}</div>
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${getScoreColor(assessment.score[item.key])}`}>
                        {assessment.score[item.key]}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Assessment Highlights */}
          <Card className="bg-white border-gray-200 mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Assessment Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {assessment.assessment_highlights.map((highlight: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{highlight}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Recommendations for Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {assessment.recommendations_for_candidate.map((recommendation: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{recommendation}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
