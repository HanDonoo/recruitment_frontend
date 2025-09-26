"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users, Star, Eye } from "lucide-react"

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
  }
  onAssess?: () => void
  onViewCandidates?: () => void
  showAssessButton?: boolean
  showViewButton?: boolean
}

export function JobCard({
  job,
  onAssess,
  onViewCandidates,
  showAssessButton = false,
  showViewButton = false,
}: JobCardProps) {
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
            {showAssessButton && (
              <Button onClick={onAssess} className="bg-red-600 hover:bg-red-700 text-white" size="sm">
                Assess Match
              </Button>
            )}
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
