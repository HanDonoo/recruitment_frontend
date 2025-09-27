"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, TrendingUp, BookOpen, Target, Award, User } from "lucide-react"
import { AssessmentRadarChart } from "@/components/radar-chart"

// Mock candidate data - in real app this would come from API
const mockCandidateData = {
    1: { name: "Alex Johnson", title: "Frontend Developer", jobId: 1, jobTitle: "Frontend Developer Intern" },
    2: { name: "Sarah Chen", title: "Full Stack Developer", jobId: 2, jobTitle: "Full Stack Developer Intern" },
    3: { name: "Michael Brown", title: "Frontend Developer", jobId: 1, jobTitle: "Frontend Developer Intern" },
}

// Mock assessment data - in real app this would come from API
const mockAssessmentData = {
    1: {
        summary:
            "Alex Johnson's resume shows strong alignment with the Frontend Developer position, with excellent React and TypeScript skills and solid project experience.",
        score: {
            overall: 92,
            skills_match: 95,
            experience_depth: 85,
            education_match: 90,
            potential_fit: 98,
        },
        assessment_highlights: [
            "Strong proficiency in React, TypeScript, and modern frontend frameworks",
            "Excellent project portfolio demonstrating real-world application development",
            "Good understanding of responsive design and user experience principles",
            "Active contributor to open-source projects showing continuous learning",
        ],
        recommendations_for_candidate: [
            "Consider gaining experience with backend technologies to become more versatile",
            "Explore advanced React patterns like state management with Redux or Zustand",
            "Build projects that demonstrate scalability and performance optimization skills",
        ],
    },
    2: {
        summary:
            "Sarah Chen demonstrates excellent full-stack capabilities with strong technical foundation and leadership potential.",
        score: {
            overall: 88,
            skills_match: 90,
            experience_depth: 85,
            education_match: 95,
            potential_fit: 85,
        },
        assessment_highlights: [
            "Comprehensive full-stack development experience with modern technologies",
            "Strong academic background with Master's degree in Software Engineering",
            "Demonstrated leadership skills through team projects and internships",
            "Good understanding of database design and API development",
        ],
        recommendations_for_candidate: [
            "Focus on cloud technologies and DevOps practices for better deployment skills",
            "Develop expertise in microservices architecture and containerization",
            "Consider contributing to larger open-source projects to showcase collaboration skills",
        ],
    },
    3: {
        summary: "Michael Brown shows good potential as a junior developer with solid fundamentals and eagerness to learn.",
        score: {
            overall: 76,
            skills_match: 70,
            experience_depth: 65,
            education_match: 85,
            potential_fit: 85,
        },
        assessment_highlights: [
            "Solid foundation in React and JavaScript with good coding practices",
            "Strong educational background in Information Technology",
            "Demonstrates enthusiasm for learning and professional development",
            "Good problem-solving skills evident from academic projects",
        ],
        recommendations_for_candidate: [
            "Gain more hands-on experience through personal projects or contributions",
            "Learn TypeScript to improve code quality and developer experience",
            "Focus on building a portfolio that showcases diverse technical skills",
        ],
    },
}

export default function RecruiterAssessmentPage() {
    const params = useParams()
    const candidateId = Number.parseInt(params.id as string)
    const [candidate, setCandidate] = useState<any>(null)
    const [assessment, setAssessment] = useState<any>(null)

    useEffect(() => {
        // In real app, fetch candidate and assessment data from API
        const candidateData = mockCandidateData[candidateId as keyof typeof mockCandidateData]
        const assessmentData = mockAssessmentData[candidateId as keyof typeof mockAssessmentData]

        if (candidateData && assessmentData) {
            setCandidate(candidateData)
            setAssessment(assessmentData)
        }
    }, [candidateId])

    if (!candidate || !assessment) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Not Found</h2>
                    <p className="text-gray-600 mb-4">The assessment data for this candidate is not available.</p>
                    <Link href="/recruiter">
                        <Button className="bg-red-600 hover:bg-red-700 text-white">Back to Dashboard</Button>
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
                            <Link href="/recruiter">
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xs">SoT</span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">Assessment Results</h1>
                        </div>
                        <Badge className="bg-red-600 text-white hover:bg-red-700">Recruiter Portal</Badge>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Candidate Header */}
                    <Card className="bg-white border-gray-200 mb-6">
                        <CardHeader>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl text-gray-900">{candidate.name}</CardTitle>
                                    <p className="text-gray-600">
                                        {candidate.title} • Applied for {candidate.jobTitle}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
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
                            <CardTitle className="text-xl text-gray-900">Candidate Strengths</CardTitle>
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

                    {/* Development Areas */}
                    <Card className="bg-white border-gray-200 mb-6">
                        <CardHeader>
                            <CardTitle className="text-xl text-gray-900">Development Recommendations</CardTitle>
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

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <Button className="bg-red-600 hover:bg-red-700 text-white">Schedule Interview</Button>
                        <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent">
                            Send Message
                        </Button>
                        <Button variant="outline">Download Resume</Button>
                    </div>
                </div>
            </main>
        </div>
    )
}
