"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

interface RadarChartProps {
  data: {
    overall: number
    skills_match: number
    experience_depth: number
    education_match: number
    potential_fit: number
  }
  className?: string
}

export function AssessmentRadarChart({ data, className }: RadarChartProps) {
  const chartData = [
    {
      subject: "Skills Match",
      score: data.skills_match,
      fullMark: 100,
    },
    {
      subject: "Experience",
      score: data.experience_depth,
      fullMark: 100,
    },
    {
      subject: "Education",
      score: data.education_match,
      fullMark: 100,
    },
    {
      subject: "Potential",
      score: data.potential_fit,
      fullMark: 100,
    },
    {
      subject: "Overall",
      score: data.overall,
      fullMark: 100,
    },
  ]

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" className="text-xs" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" tickCount={6} />
          <Radar name="Score" dataKey="score" stroke="#dc2626" fill="#dc2626" fillOpacity={0.1} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
