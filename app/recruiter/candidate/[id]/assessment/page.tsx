"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, BookOpen, Target, Award, User, Loader2 } from "lucide-react"
import { AssessmentRadarChart } from "@/components/radar-chart"
import { Header } from "@/components/header"
import { api } from "@/lib/api"

interface Candidate {
    id: number;
    name: string;
}

interface RecruiterAssessmentPageProps {
    searchParams: {
        jobId?: string
    }
}

export default function RecruiterAssessmentPage({ searchParams }: RecruiterAssessmentPageProps) {
    const params = useParams()
    const router = useRouter()
    const applicantId = Number.parseInt(params.id as string)
    const jobId = searchParams.jobId ? Number.parseInt(searchParams.jobId) : undefined

    const [assessment, setAssessment] = useState<any>(null)
    const [jobTitle, setJobTitle] = useState<string>("")
    const [applicantName, setApplicantName] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            if (!jobId || !applicantId) {
                setError("Job ID or Applicant ID is required")
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                setError(null)

                const [assessmentResult, jobResponse, applicantResponse] = await Promise.all([
                    api.assessment.getLatestAssessment(applicantId, jobId),
                    api.jobs.getById(jobId),
                    api.applicants.getById(applicantId)
                ])

                if (assessmentResult.success && assessmentResult.data) {
                    setAssessment(assessmentResult.data)
                } else {
                    setError("Assessment not found for this candidate and job")
                }

                if (jobResponse.success && jobResponse.data) {
                    setJobTitle(jobResponse.data.title)
                } else {
                    setJobTitle(`Job ${jobId}`)
                }

                if (applicantResponse.success && applicantResponse.data) {
                    setApplicantName(applicantResponse.data.name)
                } else {
                    setApplicantName(`Candidate ${applicantId}`)
                }

            } catch (err) {
                setError("Failed to load assessment data")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [applicantId, jobId])

    // Handle back navigation
    const handleBackNavigation = () => {
        router.back()
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Header
                    variant="recruiter"
                    showBackButton={true}
                />

                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <Card className="bg-card border-border mb-6">
                            <CardContent className="pt-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-muted rounded-full animate-pulse"></div>
                                    <div className="space-y-2">
                                        <div className="w-48 h-6 bg-muted rounded animate-pulse"></div>
                                        <div className="w-64 h-4 bg-muted rounded animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="w-full h-4 bg-muted rounded animate-pulse"></div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <div className="w-32 h-6 bg-muted rounded animate-pulse"></div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80 bg-muted/50 rounded-lg animate-pulse flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <div className="w-32 h-6 bg-muted rounded animate-pulse"></div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                                            <div className="w-24 h-4 bg-muted rounded animate-pulse"></div>
                                            <div className="w-12 h-4 bg-muted rounded animate-pulse"></div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    if (error || !assessment || !jobId) {
        return (
            <div className="min-h-screen bg-background">
                <Header
                    variant="recruiter"
                    showBackButton={true}
                />

                <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
                    <div className="text-center max-w-md mx-auto px-4">
                        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Assessment Not Found</h2>
                        <p className="text-muted-foreground mb-6">
                            {error || "The assessment data for this candidate is not available."}
                        </p>
                        <Button
                            onClick={handleBackNavigation}
                            className="bg-sot-red hover:bg-sot-red/90 text-white"
                        >
                            Go Back
                        </Button>
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

    const getScoreKeys = () => {
        return [
            { key: "skills_match", label: "Skills Match", icon: <Target className="w-4 h-4" /> },
            { key: "experience_depth", label: "Experience Depth", icon: <TrendingUp className="w-4 h-4" /> },
            { key: "education_match", label: "Education Match", icon: <BookOpen className="w-4 h-4" /> },
            { key: "potential_fit", label: "Potential Fit", icon: <Award className="w-4 h-4" /> },
        ]
    }

    return (
        <div className="min-h-screen bg-background">
            <Header
                variant="recruiter"
                showBackButton={true}
            />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <Card className="bg-card border-border mb-6">
                        <CardHeader>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-sot-red/10 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-sot-red" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl text-foreground">{applicantName}</CardTitle>
                                    <p className="text-muted-foreground">
                                        Applied for {jobTitle}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Star className="w-6 h-6 text-yellow-500" />
                                        <span className="text-3xl font-bold text-foreground">{assessment.score.overall}%</span>
                                        <span className="text-lg text-muted-foreground">Overall Match</span>
                                    </div>
                                    <p className="text-muted-foreground">{assessment.summary}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-xl text-foreground">Score Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <AssessmentRadarChart data={assessment.score} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-xl text-foreground">Detailed Scores</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {getScoreKeys().map((item) => (
                                    <div
                                        key={item.key}
                                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <div className={`p-1 rounded ${getScoreColor(assessment.score[item.key])}`}>{item.icon}</div>
                                            <span className="font-medium text-foreground">{item.label}</span>
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

                    <Card className="bg-card border-border mb-6">
                        <CardHeader>
                            <CardTitle className="text-xl text-foreground">Candidate Strengths</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {assessment.assessment_highlights.map((highlight: string, index: number) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-muted-foreground">{highlight}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border mb-6">
                        <CardHeader>
                            <CardTitle className="text-xl text-foreground">Development Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {assessment.recommendations_for_candidate.map((recommendation: string, index: number) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-muted-foreground">{recommendation}</p>
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
