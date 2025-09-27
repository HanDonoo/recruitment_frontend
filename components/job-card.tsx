"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users, Star, Eye, FileText, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"

interface JobCardProps {
  job: {
    id: number
    title: string
    company: string
    location: string
    salary: string
    experience: string
    tags: string[]
    description: string
    applicants: number
    matchScore?: number | null
    isApplied?: boolean
  }
  onAssess?: () => void
  onViewCandidates?: () => void
  onApply?: (jobId: number) => void
  showAssessButton?: boolean
  showViewButton?: boolean
}

export function JobCard({
                          job,
                          onAssess,
                          onViewCandidates,
                          onApply,
                          showAssessButton = false,
                          showViewButton = false,
                        }: JobCardProps) {
  const [isCheckingAssessment, setIsCheckingAssessment] = useState(false)
  const [hasAssessment, setHasAssessment] = useState<boolean | null>(null) // null 表示未检查
  const [isApplying, setIsApplying] = useState(false)
  const [isApplied, setIsApplied] = useState(job.isApplied ?? false)  // 这里用状态管理

  useEffect(() => {
    if (showAssessButton) {
      const checkAssessmentStatus = async () => {
        setIsCheckingAssessment(true)
        try {
          const checkResult = await api.assessment.checkAssessment(1, job.id)
          if (checkResult.success) {
            setHasAssessment(checkResult.data?.hasAssessment ?? false)
          } else {
            setHasAssessment(false)
          }
        } catch (error) {
          console.error("Failed to check assessment on load", error)
          setHasAssessment(false)
        } finally {
          setIsCheckingAssessment(false)
        }
      }

      const checkApplicationStatus = async () => {
        try {
          const result = await api.applications.getApplication(1, job.id)
          if (result.success) {
            setIsApplied(!!result.data)
          } else {
            setIsApplied(false)
            console.error("Failed to check application status", result.error)
          }
        } catch (error) {
          setIsApplied(false)
          console.error("Error checking application status", error)
        }
      }

      checkAssessmentStatus()
      checkApplicationStatus()
    }
  }, [job.id, showAssessButton])

  const handleApplyClick = async () => {
    setIsApplying(true)
    try {
      const applicantId = 1  // TODO: 未来从登录状态中获取

      // 1. 检查是否有评估
      let assessmentStatus = hasAssessment
      if (assessmentStatus === null) {
        setIsCheckingAssessment(true)
        const checkResult = await api.assessment.checkAssessment(applicantId, job.id)
        setIsCheckingAssessment(false)

        if (!checkResult.success) {
          alert("Failed to check assessment status. Please try again.")
          return
        }

        assessmentStatus = checkResult.data?.hasAssessment || false
        setHasAssessment(assessmentStatus)
      }

      if (!assessmentStatus) {
        alert("Please complete the CV assessment before applying for this position.")
        return
      }

      // 2. 发起申请
      const result = await api.applications.applyToJob(applicantId, job.id)
      if (result.success) {
        alert("Application submitted successfully.")
        setIsApplied(true)  // 申请成功更新状态
      } else {
        alert(`Application failed: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error during apply process:', error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsApplying(false)
    }
  }

  const getApplyButtonText = () => {
    if (isCheckingAssessment) return "Checking..."
    if (isApplying) return "Applying..."
    return isApplied ? "Applied" : "Apply"
  }

  const getApplyButtonStyle = () => {
    return isApplied
        ? "bg-green-600 hover:bg-green-700 text-white"
        : "bg-red-600 hover:bg-red-700 text-white"
  }

  const isButtonDisabled = () => {
    return isApplied || isCheckingAssessment || isApplying
  }

  return (
      <Card className="bg-white border-gray-200 hover:border-red-300 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Link href={`/student/job/${job.id}`}>
                <CardTitle className="text-lg text-gray-900 hover:text-red-600 transition-colors cursor-pointer">
                  {job.title}
                </CardTitle>
              </Link>
              <CardDescription className="text-gray-600">{job.company}</CardDescription>
            </div>
            {job.matchScore && (
                <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-medium text-green-600">{job.matchScore}%</span>
                </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{job.experience}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{job.applicants} applicants</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>

          <div className="flex flex-wrap gap-1">
            {job.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
            ))}
          </div>

          {/* 评估状态提示 - 只在已知没有评估时显示 */}
          {showAssessButton && hasAssessment === false && (
              <div className="flex items-center space-x-2 bg-orange-50 border border-orange-200 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-700">
              Complete CV assessment to unlock application
            </span>
              </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="font-semibold text-red-600 text-lg">{job.salary}</span>

            <div className="flex space-x-2">
              <Link href={`/student/job/${job.id}`}>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  View Details
                </Button>
              </Link>

              {/* 申请按钮 */}
              {showAssessButton && (
                  <Button
                      onClick={handleApplyClick}
                      disabled={isButtonDisabled()}
                      className={getApplyButtonStyle()}
                      size="sm"
                  >
                    {getApplyButtonText()}
                  </Button>
              )}

              {/* HR 查看候选人按钮 */}
              {showViewButton && (
                  <Button
                      onClick={onViewCandidates}
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Candidates
                  </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
  )
}
