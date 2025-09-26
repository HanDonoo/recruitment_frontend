"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, Eye, Star, TrendingUp, Award } from "lucide-react"
import { JobCard } from "@/components/job-card"
import { CandidateList } from "@/components/candidate-list"

const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "My Company",
    location: "Wellington",
    salary: "$28.90/hour",
    experience: "1-3 years",
    tags: ["React", "TypeScript", "Vue.js"],
    description: "Lead frontend development for our core products, participate in architecture design...",
    applicants: 156,
    status: "active",
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "My Company",
    location: "Auckland",
    salary: "$28.90/hour",
    experience: "2-5 years",
    tags: ["Node.js", "Python", "PostgreSQL"],
    description: "Work on full-stack development for innovative tech solutions...",
    applicants: 89,
    status: "active",
  },
]

const mockCandidates = [
  {
    id: 1,
    name: "Alex Johnson",
    title: "Frontend Developer",
    experience: "2 years",
    education: "Bachelor - Computer Science",
    skills: ["React", "TypeScript", "Node.js"],
    score: 92,
    status: "pending",
    appliedAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Sarah Chen",
    title: "Full Stack Developer",
    experience: "3 years",
    education: "Master - Software Engineering",
    skills: ["Vue.js", "Python", "PostgreSQL"],
    score: 88,
    status: "reviewed",
    appliedAt: "2024-01-14",
  },
  {
    id: 3,
    name: "Michael Brown",
    title: "Frontend Developer",
    experience: "1 year",
    education: "Bachelor - Information Technology",
    skills: ["React", "JavaScript", "CSS"],
    score: 76,
    status: "pending",
    appliedAt: "2024-01-13",
  },
]

export default function RecruiterPage() {
  const [jobs] = useState(mockJobs)
  const [candidates] = useState(mockCandidates)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showTopCandidates, setShowTopCandidates] = useState(false)

  const handleViewCandidates = (job: any) => {
    setSelectedJob(job)
  }

  const handleShowTopCandidates = () => {
    setShowTopCandidates(true)
  }

  const topCandidates = candidates.sort((a, b) => b.score - a.score).slice(0, 5)

  const displayCandidates = showTopCandidates ? topCandidates : candidates

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-sot-red rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Summer of Tech</h1>
            </div>
            <Badge variant="secondary" className="text-xs bg-sot-red text-white">
              Recruiter Portal
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2 text-balance">Smart Recruitment Platform</h2>
          <p className="text-muted-foreground text-lg">
            Use AI technology to quickly screen the best candidates and improve recruitment efficiency
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-sot-red/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-sot-red" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Roles</p>
                  <p className="text-xl font-bold text-foreground">{jobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                  <p className="text-xl font-bold text-foreground">245</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-xl font-bold text-foreground">85.3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-sot-red/10 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-sot-red" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Top 5 Candidates</p>
                  <p className="text-xl font-bold text-foreground">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="jobs">Role Management</TabsTrigger>
            <TabsTrigger value="candidates">Candidate Management</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">My Roles ({jobs.length})</h3>
              <Button className="bg-sot-red hover:bg-sot-red-dark text-white">Post New Role</Button>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewCandidates={() => handleViewCandidates(job)}
                  showViewButton={true}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="candidates" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Candidate List ({displayCandidates.length})</h3>
              <div className="flex space-x-2">
                <Button
                  variant={showTopCandidates ? "default" : "outline"}
                  onClick={handleShowTopCandidates}
                  className={
                    showTopCandidates
                      ? "bg-sot-red hover:bg-sot-red-dark text-white"
                      : "border-sot-red text-sot-red hover:bg-sot-red hover:text-white"
                  }
                >
                  <Award className="w-4 h-4 mr-2" />
                  Top 5
                </Button>
                <Button
                  variant={!showTopCandidates ? "default" : "outline"}
                  onClick={() => setShowTopCandidates(false)}
                  className={!showTopCandidates ? "bg-sot-red hover:bg-sot-red-dark text-white" : ""}
                >
                  All Candidates
                </Button>
              </div>
            </div>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border focus:border-sot-red"
              />
            </div>

            <CandidateList candidates={displayCandidates} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
