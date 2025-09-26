import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Building, BarChart3, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">SoT</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Summer of Tech</h1>
            </div>
            <div className="text-sm text-gray-600">AI Resume Matcher</div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">AI-Powered Resume Assessment Platform</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-pretty">
            Advanced AI technology to match students with perfect summer tech internships and help recruiters find top
            talent efficiently
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="bg-white border-gray-200 hover:border-red-300 transition-colors group hover:shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-100 transition-colors">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Student Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Find your perfect summer tech role and get AI-powered career guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 mb-6 space-y-2 text-left">
                <li>• Browse summer tech internships</li>
                <li>• AI resume assessment & scoring</li>
                <li>• Personalized career recommendations</li>
                <li>• Real-time match analysis</li>
              </ul>
              <Link href="/student">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Enter Student Portal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:border-red-300 transition-colors group hover:shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-100 transition-colors">
                <Building className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Recruiter Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Smart candidate screening to find the best summer tech talent
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 mb-6 space-y-2 text-left">
                <li>• Manage internship postings</li>
                <li>• AI-powered candidate screening</li>
                <li>• Top 5 candidate recommendations</li>
                <li>• Detailed assessment insights</li>
              </ul>
              <Link href="/recruiter">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Enter Recruiter Portal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Platform Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI Smart Assessment</h4>
              <p className="text-sm text-gray-600">
                Multi-dimensional resume evaluation using advanced language models for precise matching
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Efficient Matching</h4>
              <p className="text-sm text-gray-600">
                Fast candidate screening with average response time under 2 seconds
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Data Insights</h4>
              <p className="text-sm text-gray-600">
                Detailed scoring explanations and personalized career development advice
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
