"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, User, GraduationCap, Briefcase, MessageSquare, Video, Eye, Clock } from "lucide-react"

import { useRouter } from 'next/navigation';
import { useIsMobile } from "@/hooks/use-mobile";

import { api, InterviewCreate } from "@/lib/api";

interface Candidate {
  id: number
  name: string
  title: string
  experience: string
  education: string
  skills: string[]
  score?: number
  status: "pending" | "reviewed" | "interviewed"
  appliedAt: string
  jobId?: number
  applicationId?: number
}

interface CandidateListProps {
  candidates: Candidate[]
}

export function CandidateList({ candidates }: CandidateListProps) {
  const router = useRouter();

  const isMobile = useIsMobile();
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [interviewDialogOpen, setInterviewDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [message, setMessage] = useState("")
  const [interviewDate, setInterviewDate] = useState("")
  const [interviewTime, setInterviewTime] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false);


  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-50 text-orange-600 border-orange-200"
      case "reviewed":
        return "bg-red-50 text-red-600 border-red-200"
      case "interviewed":
        return "bg-green-50 text-green-600 border-green-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending Review"
      case "reviewed":
        return "Reviewed"
      case "interviewed":
        return "Interviewed"
      default:
        return status
    }
  }

  const handleSendMessage = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setMessage("")
    setMessageDialogOpen(true)
  }

  const handleScheduleInterview = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setInterviewDate("")
    setInterviewTime("")
    setInterviewDialogOpen(true)
  }

  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setDetailDialogOpen(true)
  }

  const submitMessage = () => {
    console.log("Sending message to", selectedCandidate?.name, ":", message)
    setMessage("")
    setMessageDialogOpen(false)
  }

  const submitInterview = async () => {
    if (!selectedCandidate || !selectedCandidate.jobId || !selectedCandidate.applicationId) {
      alert("Error: Missing candidate, job ID, or application ID. Cannot schedule interview.")
      return
    }

    const companyId = 1;
    const interviewerId = 5;

    const scheduledTime = `${interviewDate}T${interviewTime}:00Z`;

    const interviewPayload: InterviewCreate = {
      application_id: selectedCandidate.applicationId,
      job_id: selectedCandidate.jobId,
      applicant_id: selectedCandidate.id,
      company_id: companyId,
      interviewer_id: interviewerId,
      scheduled_time: scheduledTime,
      duration_minutes: 30,
      type: 'Video Call',
      status: 'Pending',
      location_url: null,
      notes: null
    };

    setIsSubmitting(true);
    try {
      const result = await api.interviews.create(interviewPayload);

      if (result.success) {
        alert(`Interview successfully scheduled with ${selectedCandidate.name}!`);
      } else {
        alert(`Failed to schedule interview: ${result.error}`);
      }
    } catch (error) {
      alert("An unexpected error occurred while scheduling the interview.");
      console.error("Interview submission error:", error);
    } finally {
      setIsSubmitting(false);
      setInterviewDate("");
      setInterviewTime("");
      setInterviewDialogOpen(false);
    }
  }

  if (!candidates || candidates.length === 0) {
    return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates yet</h3>
          <p className="text-gray-600">Candidates will appear here once they apply for this position.</p>
        </div>
    )
  }

  const buildAssessmentUrl = (candidateId: number, jobId?: number) => {
    let url = `/recruiter/candidate/${candidateId}/assessment`;
    if (jobId !== undefined && jobId !== null) {
      url += `?jobId=${jobId}`;
    }
    return url;
  };

  return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Top Candidates ({candidates.length})</h3>
          <div className="text-sm text-gray-600 hidden sm:block">Sorted by match score</div>
        </div>

        <div className="space-y-4">
          {candidates?.map((candidate, index) => (
              <Card
                  key={candidate.id}
                  className="bg-white border-gray-200 hover:border-red-300 hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                        </div>
                        {index < 3 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-white">#{index + 1}</span>
                            </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{candidate.name}</h4>
                        <p className="text-sm text-gray-600 mb-1 truncate">{candidate.title}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>Applied {new Date(candidate.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-1 sm:space-y-2 flex-shrink-0 ml-2">
                      <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 text-green-600" />
                        <div className="text-sm font-bold text-green-600">{candidate.score ?? 0}%</div>
                        <div className="text-xs text-green-600 hidden sm:inline">Match</div>
                      </div>
                      <Badge className={`${getStatusColor(candidate.status)} border text-xs`}>
                        {getStatusText(candidate.status)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 sm:mb-6">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Briefcase className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">EXPERIENCE</div>
                        <div className="text-sm font-medium text-gray-900 truncate">{candidate.experience}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <GraduationCap className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">EDUCATION</div>
                        <div className="text-sm font-medium text-gray-900 truncate">{candidate.education}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">SKILLS</div>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills?.map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-gray-100 text-gray-700 text-xs hover:bg-gray-200">
                            {skill}
                          </Badge>
                      )) ?? <div className="text-sm text-gray-400">No skills listed.</div>}
                    </div>
                  </div>

                  <div
                      className={`pt-4 border-t border-gray-100 ${
                          isMobile
                              ? 'flex flex-col space-y-2'
                              : 'flex flex-row flex-wrap gap-3 justify-end'
                      }`}
                  >

                    <Button
                        size="sm"
                        className={`bg-red-600 hover:bg-red-700 text-white ${isMobile ? 'w-full' : 'w-auto'}`}
                        onClick={() => router.push(buildAssessmentUrl(candidate.id, candidate.jobId))}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Assessment
                    </Button>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleScheduleInterview(candidate)}
                        className={`border-gray-300 text-gray-700 hover:bg-gray-50 ${isMobile ? 'w-full' : 'w-auto'}`}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Schedule Interview
                    </Button>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(candidate)}
                        className={`border-gray-300 text-gray-700 hover:bg-gray-50 ${isMobile ? 'w-full' : 'w-auto'}`}
                    >
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendMessage(candidate)}
                        className={`border-gray-300 text-gray-700 hover:bg-gray-50 ${isMobile ? 'w-full' : 'w-auto'}`}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>

        <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Send Message to {selectedCandidate?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="message" className="text-sm font-medium">
                  Message
                </Label>
                <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px] mt-1"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                    onClick={submitMessage}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    disabled={!message.trim()}
                >
                  Send Message
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={interviewDialogOpen} onOpenChange={setInterviewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Schedule Interview with {selectedCandidate?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="date" className="text-sm font-medium">
                  Interview Date
                </Label>
                <Input
                    id="date"
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-sm font-medium">
                  Interview Time
                </Label>
                <Input
                    id="time"
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setInterviewDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                    onClick={submitInterview}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    disabled={!interviewDate || !interviewTime || isSubmitting}
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Interview'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">{selectedCandidate?.name} - Candidate Profile</DialogTitle>
            </DialogHeader>
            {selectedCandidate && (
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{selectedCandidate.name}</h3>
                      <p className="text-gray-600 mb-2">{selectedCandidate.title}</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded">
                          <Star className="w-3 h-3 text-green-600" />
                          <span className="text-sm font-medium text-green-600">{selectedCandidate.score ?? 0}% Match</span>
                        </div>
                        <Badge className={getStatusColor(selectedCandidate.status)}>
                          {getStatusText(selectedCandidate.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Experience</Label>
                        <p className="text-gray-900 mt-1">{selectedCandidate.experience}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Education</Label>
                        <p className="text-gray-900 mt-1">{selectedCandidate.education}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Applied</Label>
                        <p className="text-gray-900 mt-1">{selectedCandidate.appliedAt}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Match Score</Label>
                        <p className="text-gray-900 font-semibold mt-1">{selectedCandidate.score ?? 0}%</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Skills & Technologies
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCandidate.skills?.map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-gray-100 text-gray-700">
                            {skill}
                          </Badge>
                      )) ?? <div className="text-sm text-gray-400">No skills listed.</div>}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                      Close
                    </Button>
                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => router.push(buildAssessmentUrl(selectedCandidate.id, selectedCandidate.jobId))}
                    >
                      View Full Assessment
                    </Button>
                  </div>
                </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
  )
}
