"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"
import { usePathname } from "next/navigation"

// 定义组件的属性接口
interface StudentPortalHeaderProps {
    /** 当前用户的申请总数 */
    applicationCount: number
    /** 是否显示返回按钮 (通常在子页面显示) */
    showBackButton?: boolean
    /** 返回按钮的链接 (默认为 /student) */
    backHref?: string
}

export function StudentPortalHeader({
                                        applicationCount,
                                        showBackButton = true,
                                        backHref = "/student",
                                    }: StudentPortalHeaderProps) {
    const pathname = usePathname()

    // 辅助函数: 根据当前路径判断是否在主页（/student），如果在主页则不显示"Back"按钮
    const isStudentRoot = pathname === "/student" || pathname === "/student/"
    const shouldShowBack = showBackButton && !isStudentRoot

    return (
        <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3">
                {/* ======================= Desktop Layout ======================= */}
                <div className="hidden md:flex items-center justify-between">
                    {/* Left Side */}
                    <div className="flex items-center space-x-3">
                        {shouldShowBack && (
                            <Link href={backHref}>
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                            </Link>
                        )}
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">SoT</span>
                        </div>
                        <h1 className="text-lg font-semibold text-gray-900">Student Portal</h1>
                    </div>

                    {/* Right Side - Applications Button */}
                    <div className="flex items-center space-x-3">
                        <Link href="/student/applications">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Applications ({applicationCount})
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* ======================= Mobile Layout ======================= */}
                <div className="md:hidden flex items-center justify-between">
                    {/* Left side - Back button or placeholder */}
                    {shouldShowBack ? (
                        <Link href={backHref}>
                            <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                    ) : (
                        // 在主页时不显示返回按钮，可以放置一个占位符或 Home 链接
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
                        <span className="text-sm font-medium text-gray-900">Portal</span>
                    </div>

                    {/* Right side - Applications button */}
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
                </div>
            </div>
        </header>
    )
}
