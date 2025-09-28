"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp } from "lucide-react"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"

interface RecruiterPortalHeaderProps {
    /** 是否显示返回按钮 */
    showBackButton?: boolean
    /** 返回按钮的链接 (默认为 /recruiter) */
    backHref?: string
    /** 自定义页面标题 (默认为 "Recruiter Portal") */
    pageTitle?: string
}

export function RecruiterPortalHeader({
                                          showBackButton = false,
                                          backHref = "/recruiter",
                                          pageTitle = "Recruiter Portal",
                                      }: RecruiterPortalHeaderProps) {
    const pathname = usePathname()
    const isMobile = useIsMobile()

    // 判断是否在主页
    const isRecruiterRoot = pathname === "/recruiter" || pathname === "/recruiter/"
    const shouldShowBack = showBackButton && !isRecruiterRoot

    if (isMobile) {
        return (
            <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Left side - Back button or Home link */}
                        {shouldShowBack ? (
                            <Link href={backHref}>
                                <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/">
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-900">Home</span>
                                </div>
                            </Link>
                        )}

                        {/* Center - Logo and Portal text */}
                        <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xs">SoT</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">Recruiter</span>
                        </div>

                        {/* Right side - Badge */}
                        <Badge className="bg-red-600 text-white text-xs px-2 py-1">
                            HR
                        </Badge>
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Left Side */}
                    <div className="flex items-center">
                        {shouldShowBack && (
                            <Link href={backHref}>
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 mr-3">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Center - Logo and Title */}
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">SOT</h1>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center">
                        <Badge className="bg-red-600 text-white hover:bg-red-700">
                            {pageTitle}
                        </Badge>
                    </div>
                </div>
            </div>
        </header>
    )
}
