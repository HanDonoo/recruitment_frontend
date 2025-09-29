"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid } from "recharts"
import { Users, Building, FileText, Calendar, TrendingUp, Target, Loader2, AlertTriangle } from "lucide-react"


import {
    api,
    OrganizerStats,
    TrendData,
    LeaderboardItem,
    StatusCount
} from "@/lib/api"

// 导入 useIsMobile 钩子
import { useIsMobile } from "@/hooks/use-mobile"

const initialStats: OrganizerStats = {
    total_students: 0,
    total_companies: 0,
    total_applications: 0,
    total_interviews: 0,
    placement_rate: 0,
    active_jobs: 0,
}

// 饼图颜色映射
const statusColors: { [key: string]: string } = {
    "pending": "#3b82f6",
    "under_review": "#3b82f6", // 蓝色
    "interview_scheduled": "#8b5cf6", // 紫色
    "offered": "#f97316", // 橙色
    "accepted": "#10b981", // 绿色
    "rejected": "#ef4444", // 红色
};

export default function OrganizationPage() {
    const isMobile = useIsMobile()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [stats, setStats] = useState<OrganizerStats>(initialStats)
    const [trends, setTrends] = useState<TrendData[]>([])
    const [statusCounts, setStatusCounts] = useState<StatusCount[]>([])
    const [topCompanies, setTopCompanies] = useState<LeaderboardItem[]>([])

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setError(null)
            try {
                const [statsRes, trendsRes, statusRes, companiesRes] = await Promise.all([
                    api.organizer.getStats(),
                    api.organizer.getTrends(30),
                    api.organizer.getStatusCounts(),
                    api.organizer.getLeaderboard(5),
                ])

                // 1. 核心统计数据
                if (statsRes.success && statsRes.data) {
                    setStats(statsRes.data)
                } else {
                    throw new Error(statsRes.error || "Failed to fetch core statistics.")
                }

                // 2. 趋势数据
                setTrends(trendsRes.success && trendsRes.data ? trendsRes.data : [])

                // 3. 申请状态分布
                setStatusCounts(statusRes.success && statusRes.data ? statusRes.data : [])

                // 4. 活跃公司排行榜
                setTopCompanies(companiesRes.success && companiesRes.data ? companiesRes.data : [])

            } catch (err) {
                console.error("API Fetch Error:", err)
                setError("Failed to load dashboard data. Please check the backend connection and API configuration.")
            } finally {
                setTimeout(() => setLoading(false), 500);
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header variant="organization" />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 text-red-600 animate-spin mx-auto mb-4" />
                            <p className="text-gray-600">Loading real-time analytics...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header variant="organization" />
                <div className="container mx-auto px-4 py-8">
                    <Card className="border-red-500 bg-red-50">
                        <CardHeader className="flex flex-row items-center space-x-3">
                            <AlertTriangle className="h-6 w-6 text-red-700" />
                            <CardTitle className="text-red-700">Data Load Error</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-red-600 font-semibold">{error}</p>
                            <p className="text-xs text-red-500 mt-2">Check the Fast API server status (e.g., http://localhost:8000/docs).</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    const chartConfig = statusCounts.reduce((acc, item) => {
        const statusKey = item.status;
        const color = statusColors[statusKey.toLowerCase()] || "#cccccc";
        acc[statusKey] = { label: statusKey, color };
        return acc;
    }, {} as { [key: string]: { label: string, color: string } });

    const chartHeight = isMobile ? '250px' : '300px';

    // @ts-ignore
    return (
        <div className="min-h-screen bg-gray-50">
            {/* 使用您的 Header 组件，并设置 variant */}
            <Header variant="organization" />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Summer of Tech Analytics</h1>
                    <p className="text-gray-600">Overview of platform performance and key metrics</p>
                </div>

                {/* Stats Cards Grid - 移动端优化：从默认 1 列，到 md 2 列，到 lg 3 列 */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                            <Users className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold">{stats.total_students.toLocaleString()}</div>
                            <p className="text-xs text-gray-600">Registered</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Partner Companies</CardTitle>
                            <Building className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold">{stats.total_companies}</div>
                            <p className="text-xs text-gray-600">Active recruiters</p>
                        </CardContent>
                    </Card>

                    <Card className="col-span-2 md:col-span-1 lg:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                            <FileText className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold">{stats.total_applications.toLocaleString()}</div>
                            <p className="text-xs text-gray-600">Total submitted</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
                            <Calendar className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold">{stats.total_interviews}</div>
                            <p className="text-xs text-gray-600">Total interviews</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
                            <Target className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold">{stats.placement_rate.toFixed(1)}%</div>
                            <p className="text-xs text-gray-600">Successful placements</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                            <TrendingUp className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold">{stats.active_jobs}</div>
                            <p className="text-xs text-gray-600">Currently open</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Grid - 移动端优化：默认 1 列，到 lg 2 列 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Trends</CardTitle>
                            <CardDescription>Daily applications and interviews over the last 30 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={{
                                    applications: { label: "Applications", color: "#dc2626" },
                                    interviews: { label: "Interviews", color: "#f97316" },
                                }}
                                className={`h-[${chartHeight}]`}
                            >
                                <LineChart data={trends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="day_label"
                                        tickFormatter={(value) => isMobile ? value.slice(0, 3) : value}
                                    />
                                    <YAxis hide={isMobile}/>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Line
                                        type="monotone"
                                        dataKey="applications"
                                        stroke="var(--color-applications)"
                                        strokeWidth={2}
                                        dot={isMobile ? false : { r: 4 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="interviews"
                                        stroke="var(--color-interviews)"
                                        strokeWidth={2}
                                        dot={isMobile ? false : { r: 4 }}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Application Status</CardTitle>
                            <CardDescription>Current status distribution of all applications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={{ ...chartConfig }}
                                className={`h-[${chartHeight}]`}
                            >
                                <PieChart>
                                    <Pie
                                        data={statusCounts}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={isMobile ? 40 : 60}
                                        outerRadius={isMobile ? 80 : 100}
                                        paddingAngle={2}
                                        dataKey="count"
                                        nameKey="status"
                                        label={!isMobile}
                                    >
                                        {statusCounts.map((entry, index) => (
                                            <Cell
                                                key={`cell-${entry.status}`}
                                                fill={statusColors[entry.status.toLowerCase()] || "#cccccc"}
                                            />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Performing Companies List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Companies</CardTitle>
                        <CardDescription>Top 5 companies with the most activity on the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topCompanies.length > 0 ? (
                                topCompanies.map((company, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <h3 className="font-semibold">{company.company_name}</h3>
                                            <p className="text-sm text-gray-600">
                                                {company.applications} applications • {company.interviews} interviews
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="bg-red-500 text-white hover:bg-red-600">
                                            {company.placements} Placements
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">No company activity data available.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
