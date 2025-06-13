"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Star, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { fetchContactStats, fetchPendingContactsCount } from "@/lib/api/contact"
import { fetchFeedbackStats } from "@/lib/api/feedback"

import { ContactTimeChart } from "@/components/analytics/contact-time-chart"
import { FeedbackCategoryChart } from "@/components/analytics/feedback-category-chart"
import { ChurnPredictionChart } from "@/components/analytics/churn-prediction-chart"

export function AdminStats() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalFeedbacks: 0,
    pendingContacts: 0,
    averageRating: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [contactStats, feedbackStats, pendingStats] = await Promise.all([
          fetchContactStats(),
          fetchFeedbackStats(),
          fetchPendingContactsCount(),
        ])

        setStats({
          totalContacts: contactStats.totalContacts,
          totalFeedbacks: feedbackStats.totalFeedbacks,
          pendingContacts: pendingStats.pendingContacts,
          averageRating: feedbackStats.averageScore || 0, // 실제 평균 점수 사용
        })
      } catch (error) {
        console.error("Failed to load admin stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 문의</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContacts}</div>
            <p className="text-xs text-muted-foreground">전체 접수된 문의</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 피드백</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFeedbacks}</div>
            <p className="text-xs text-muted-foreground">사용자 피드백 수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">대기 중인 문의</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingContacts}</div>
            <p className="text-xs text-muted-foreground">답변 대기 중</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 만족도</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}/5</div>
            <p className="text-xs text-muted-foreground">피드백 평균 점수</p>
          </CardContent>
        </Card>
      </div>

      {/* 분석 차트 */}
      <div>
        <h2 className="text-2xl font-bold mb-4">분석 차트</h2>

        {/* 시간대별 문의 수와 카테고리별 피드백 차트를 나란히 배치 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 h-200">
          <ContactTimeChart />
          <FeedbackCategoryChart />
        </div>

        {/* 이탈 예측 차트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChurnPredictionChart />
        </div>
      </div>

    </div>
  )
}
