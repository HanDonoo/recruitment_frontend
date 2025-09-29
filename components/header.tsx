"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, TrendingUp, Home, LayoutDashboard } from "lucide-react"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"

interface HeaderProps {
    variant?: "main" | "student" | "recruiter" | "organization"
    showBackButton?: boolean
    applicationCount?: number
    backHref?: string
}

function getVariantConfig(variant: HeaderProps['variant'], isMobile: boolean) {
    const config = {
        main: {
            title: "Summer of Tech",
            subtitle: "",
            mobileText: "SoT",
            badgeText: isMobile ? "Main" : "Main Portal",
            badgeClass: "bg-gray-200 text-gray-700",
            icon: LayoutDashboard,
            mobileIcon: 'SoT',
        },
        student: {
            title: "Student Portal",
            subtitle: "Find your tech job",
            mobileText: "Student",
            badgeText: isMobile ? "Student" : "Student Portal",
            badgeClass: "bg-red-600 text-white",
            icon: FileText,
            mobileIcon: 'SoT',
        },
        recruiter: {
            title: "Recruiter Portal",
            subtitle: "Manage job listings",
            mobileText: "Recruiter",
            badgeText: isMobile ? "HR" : "Recruiter Portal", // 保持 RecruiterPortalHeader 的 HR 徽章风格
            badgeClass: "bg-red-600 text-white",
            icon: TrendingUp, // 使用 TrendingUp 图标
            mobileIcon: 'SoT',
        },
        organization: {
            title: "Organization Analytics",
            subtitle: "Platform Overview",
            mobileText: "Analytics",
            badgeText: isMobile ? "Org" : "Organization Portal",
            badgeClass: "bg-red-600 text-white",
            icon: TrendingUp, // 使用 TrendingUp 图标
            mobileIcon: 'SoT',
        },
    };
    return config[variant || 'main'];
}

export function Header({
                           variant = "main",
                           showBackButton = false,
                           applicationCount = 0,
                           backHref,
                       }: HeaderProps) {
    const pathname = usePathname()
    const isMobile = useIsMobile()
    const config = getVariantConfig(variant, isMobile)

    const effectiveBackHref = backHref || (variant === 'main' ? '/' : `/${variant}`);

    const isRoot = pathname === "/"
    const isPortalRoot = pathname === `/${variant}` || pathname === `/${variant}/`
    const shouldShowBack = showBackButton && !isRoot && !isPortalRoot


    if (isMobile) {
        return (
            <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">

                        {/* 1. Left Side: Back button or Home link */}
                        {shouldShowBack ? (
                            <Link href={effectiveBackHref}>
                                <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/">
                                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-gray-600">
                                    <Home className="w-4 h-4" />
                                </Button>
                            </Link>
                        )}

                        {/* 2. Center: Logo and Variant text */}
                        <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xs">{config.mobileIcon}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                                {config.mobileText}
                            </span>
                        </div>

                        {/* 3. Right Side: Action/Badge */}
                        {variant === "student" ? (
                            <Link href="/student/applications">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-600 text-red-600 hover:bg-red-50 text-xs px-3 py-1.5 h-8"
                                >
                                    <FileText className="w-3 h-3 mr-1" />
                                    {applicationCount}
                                </Button>
                            </Link>
                        ) : (
                            <Badge className={config.badgeClass + " text-xs px-2 py-1 shadow-sm"}>
                                {config.badgeText.split(' ')[0]}
                            </Badge>
                        )}
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">

                    {/* 1. Left Side: Logo and Title */}
                    <div className="flex items-center space-x-3">
                        {/* 智能 Back Button */}
                        {shouldShowBack && (
                            <Link href={effectiveBackHref}>
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                            </Link>
                        )}

                        {/* Logo and Main Title */}
                        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-md">
                                {variant !== 'main' ? (
                                    <config.icon className="w-5 h-5 text-white" />
                                ) : (
                                    <span className="text-white font-bold text-sm">SoT</span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Summer of Tech</h1>
                                <p className="text-xs text-gray-500 -mt-1">
                                    {variant !== 'main' ? config.title : config.subtitle}
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* 2. Right Side: Actions and Badge */}
                    <div className="flex items-center space-x-3">
                        {variant === "student" && (
                            <Link href="/student/applications">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent shadow-sm"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    My Applications ({applicationCount})
                                </Button>
                            </Link>
                        )}

                        {/* Portal Badge */}
                        {variant !== "main" && (
                            <Badge className={config.badgeClass + " hover:bg-red-700 shadow-sm"}>
                                {config.badgeText}
                            </Badge>
                        )}
                        {variant === "main" && (
                            <Badge className={config.badgeClass + " shadow-sm"}>
                                {config.badgeText}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
