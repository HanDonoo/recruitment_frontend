"use client"

import { useEffect, useState } from "react"
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const chartData = [
    {
      subject: "Skills",
      A: data.skills_match,
      fullMark: 100,
    },
    {
      subject: "Experience",
      A: data.experience_depth,
      fullMark: 100,
    },
    {
      subject: "Education",
      A: data.education_match,
      fullMark: 100,
    },
    {
      subject: "Potential",
      A: data.potential_fit,
      fullMark: 100,
    },
    {
      subject: "Overall",
      A: data.overall,
      fullMark: 100,
    },
  ]

  if (!mounted) {
    return (
        <div className={`flex items-center justify-center h-80 ${className}`}>
          <div className="text-gray-500">Loading chart...</div>
        </div>
    )
  }

  return (
      <div className={`w-full h-full ${className}`} style={{ minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
              data={chartData}
              margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis domain={[0, 100]} />
            <Radar
                dataKey="A"
                stroke="#dc2626"
                fill="#dc2626"
                fillOpacity={0.3}
                strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
  )
}


export function StableRadarChart({ data, className }: RadarChartProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  const radarData = [
    { metric: "Skills", value: data.skills_match, max: 100 },
    { metric: "Experience", value: data.experience_depth, max: 100 },
    { metric: "Education", value: data.education_match, max: 100 },
    { metric: "Potential", value: data.potential_fit, max: 100 },
    { metric: "Overall", value: data.overall, max: 100 },
  ]

  if (!isReady) {
    return <div className="h-80 bg-gray-100 animate-pulse rounded-lg" />
  }

  return (
      <div className={className} style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="60%">
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis
                dataKey="metric"
                className="text-xs fill-gray-600"
                tick={{ fontSize: 12 }}
            />
            <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                className="text-xs"
                tick={false}
                axisLine={false}
            />
            <Radar
                name="Assessment"
                dataKey="value"
                stroke="#dc2626"
                fill="#dc2626"
                fillOpacity={0.25}
                strokeWidth={2}
                dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
  )
}
