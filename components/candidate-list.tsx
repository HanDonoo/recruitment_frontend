import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, User, GraduationCap, Briefcase, Calendar } from "lucide-react"

interface Candidate {
  id: number
  name: string
  title: string
  experience: string
  education: string
  skills: string[]
  score: number
  status: "pending" | "reviewed" | "interviewed"
  appliedAt: string
}

interface CandidateListProps {
  candidates: Candidate[]
}

export function CandidateList({ candidates }: CandidateListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning"
      case "reviewed":
        return "bg-primary/10 text-primary"
      case "interviewed":
        return "bg-success/10 text-success"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "待审核"
      case "reviewed":
        return "已审核"
      case "interviewed":
        return "已面试"
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      {candidates.map((candidate) => (
        <Card key={candidate.id} className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                  <p className="text-sm text-muted-foreground">{candidate.title}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-success/10 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-success" />
                  <span className="text-xs font-medium text-success">{candidate.score}</span>
                </div>
                <Badge className={getStatusColor(candidate.status)}>{getStatusText(candidate.status)}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                <span>{candidate.experience}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <GraduationCap className="w-4 h-4" />
                <span>{candidate.education}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>申请于 {candidate.appliedAt}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {candidate.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex space-x-2">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                查看详情
              </Button>
              <Button size="sm" variant="outline">
                安排面试
              </Button>
              <Button size="sm" variant="outline">
                发送消息
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
