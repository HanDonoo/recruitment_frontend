"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, BookOpen, Target, Award, Loader2 } from "lucide-react"
import { AssessmentRadarChart } from "@/components/radar-chart"
import { Header } from "@/components/header"

export default function AssessmentResultPage() {
  const params = useParams()
  const jobId = Number.parseInt(params.id as string)

  const [assessment, setAssessment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [applicationCount, setApplicationCount] = useState(0)

  // TODO: 从登录用户状态获取实际用户ID
  const applicantId = 1

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      try {
        // 1. 并行获取评估结果和应用计数
        const [assessmentResult, applicationsResponse] = await Promise.all([
          api.assessment.getLatestAssessment(applicantId, jobId),
          api.applications.listByApplicant(applicantId)
        ])

        if (assessmentResult.success && assessmentResult.data) {
          setAssessment(assessmentResult.data)
        } else {
          setAssessment(null)
        }

        // 设置申请计数
        if (applicationsResponse.success && applicationsResponse.data) {
          setApplicationCount(applicationsResponse.data.length)
        } else {
          console.error("Failed to fetch application count:", applicationsResponse.error)
          setApplicationCount(0)
        }

      } catch (e) {
        console.error("Error fetching data:", e)
        setAssessment(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [applicantId, jobId])


  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-50">
          <Header
              variant="student"
              applicationCount={applicationCount}
              showBackButton={true}
              backHref={`/student/job/${jobId}`}
          />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white border-gray-200 mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                          <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {[1, 2].map((i) => (
                  <Card key={i} className="bg-white border-gray-200 mb-6">
                    <CardHeader>
                      <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[1, 2, 3].map((j) => (
                          <div key={j} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                            <div className="flex-1 space-y-1">
                              <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                          </div>
                      ))}
                    </CardContent>
                  </Card>
              ))}
            </div>
          </main>
        </div>
    )
  }

  if (!assessment) {
    return (
        <div className="min-h-screen bg-gray-50">
          <Header
              variant="student"
              applicationCount={applicationCount}
              showBackButton={true}
              backHref={`/student/job/${jobId}`}
          />

          {/* No Data State */}
          <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Assessment Found</h2>
              <p className="text-gray-600 mb-6">
                You haven't completed an assessment for this job yet. Take the assessment to see how well your CV matches this position.
              </p>
              <Link href={`/student/job/${jobId}`}>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Take Assessment
                </Button>
              </Link>
            </div>
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

  // @ts-ignore
  return (
      <div className="min-h-screen bg-gray-50">
        <Header
            variant="student"
            applicationCount={applicationCount}
            showBackButton={true}
            backHref={`/student/job/${jobId}`}
        />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Overall Score */}
            <Card className="bg-white border-gray-200 mb-6">
              <CardContent className="pt-6">
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
                  ].map((item: { key: keyof typeof assessment.score, label: string, icon: JSX.Element }) => (
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
