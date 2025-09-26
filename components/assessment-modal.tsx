"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Star, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

interface AssessmentModalProps {
  job: {
    id: number
    title: string
    company: string
    tags: string[]
  }
  onClose: () => void
  onComplete: (assessmentResult: any) => void
}

export function AssessmentModal({ job, onClose, onComplete }: AssessmentModalProps) {
  const [step, setStep] = useState<"upload" | "analyzing" | "result">("upload")
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
    }
  }

  const handleAnalyze = () => {
    if (!file) return

    setStep("analyzing")
    setProgress(0)

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setStep("result"), 500)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const mockResult = {
    jobId: job.id,
    jobTitle: job.title,
    summary: `Your resume shows strong potential for the ${job.title} position at ${job.company}. While there are areas for improvement, your technical foundation and learning attitude make you a promising candidate.`,
    score: {
      overall: 75,
      skills_match: 65,
      experience_depth: 55,
      education_match: 85,
      potential_fit: 90,
    },
    assessment_highlights: [
      `Strong educational background that aligns well with ${job.title} requirements`,
      "Demonstrates continuous learning and adaptability to new technologies",
      "Shows good understanding of modern development practices and tools",
      "Portfolio projects indicate practical application of theoretical knowledge",
    ],
    recommendations_for_candidate: [
      `Consider gaining more hands-on experience with ${job.tags.slice(0, 2).join(" and ")} through personal projects`,
      "Participate in open source projects to demonstrate collaboration skills",
      "Build a more comprehensive portfolio showcasing end-to-end project development",
      "Consider obtaining relevant certifications to strengthen your technical credentials",
    ],
    createdAt: new Date().toISOString(),
  }

  const handleComplete = () => {
    localStorage.setItem(`assessment_${job.id}`, JSON.stringify(mockResult))
    onComplete(mockResult)
    onClose()
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">CV Match Assessment</DialogTitle>
          <DialogDescription className="text-gray-600">
            Assess how well your CV matches the "{job.title}" role
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Info */}
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-gray-900">{job.title}</CardTitle>
              <CardDescription className="text-gray-600">{job.company}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {job.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload Step */}
          {step === "upload" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your CV</h3>
                <p className="text-gray-600 mb-4">Supports PDF, DOC, DOCX formats, max file size 10MB</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload">
                  <Button className="bg-red-600 hover:bg-red-700 text-white" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
              </div>

              {file && (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-gray-900">{file.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </Badge>
                </div>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={!file}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Start Assessment
              </Button>
            </div>
          )}

          {/* Analyzing Step */}
          {step === "analyzing" && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-red-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">AI is analyzing your CV...</h3>
              <p className="text-gray-600">This may take a few seconds, please be patient</p>
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-600">{progress}%</p>
              </div>
            </div>
          )}

          {/* Result Step */}
          {step === "result" && (
            <div className="space-y-6">
              {/* Score */}
              <div className="text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className={`text-2xl font-bold ${getScoreColor(mockResult.score.overall)}`}>
                    {mockResult.score.overall}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Match Score</h3>
                <p className="text-gray-600">Your CV matches this role at {mockResult.score.overall}%</p>
              </div>

              {/* Summary */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-blue-800">Assessment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{mockResult.summary}</p>
                </CardContent>
              </Card>

              {/* Key Highlights */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-green-800 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Key Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockResult.assessment_highlights.slice(0, 3).map((highlight, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <Star className="w-3 h-3 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Recommendations Preview */}
              <Card className="bg-orange-50 border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-orange-800 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Improvement Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockResult.recommendations_for_candidate.slice(0, 2).map((recommendation, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <TrendingUp className="w-3 h-3 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">View detailed results for complete analysis</p>
                </CardContent>
              </Card>

              <Button onClick={handleComplete} className="w-full bg-red-600 hover:bg-red-700 text-white">
                View Detailed Results
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
