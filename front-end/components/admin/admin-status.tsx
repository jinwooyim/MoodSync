"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  MessageSquare,
  Star,
  TrendingUp,
  Clock,
  Calendar,
} from "lucide-react"
import {
  fetchContactStats,
  fetchPendingContactsCount,
} from "@/lib/api/contact"
import { fetchFeedbackStats } from "@/lib/api/feedback"
import { fetchCohesiveEmotionStats } from "@/lib/api/emotion"
import { DatePicker } from "../ui/date-picker"
import { format } from "date-fns"

import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Stats {
  totalContacts: number
  totalFeedbacks: number
  pendingContacts: number
  averageRating: number
}

interface EmotionCluster {
  mostCohesiveEmotion: string
  mostCohesiveValue: number
}

type EmotionStats = Record<string, EmotionCluster>

import { ContactTimeChart } from "@/components/analytics/contact-time-chart"
import { FeedbackCategoryChart } from "@/components/analytics/feedback-category-chart"
import { ChurnPredictionChart } from "@/components/analytics/churn-prediction-chart"

export function AdminStats() {
  const [emotionStats, setEmotionStats] = useState<EmotionStats>({})
  const [stats, setStats] = useState<Stats>({
    totalContacts: 0,
    totalFeedbacks: 0,
    pendingContacts: 0,
    averageRating: 0,
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [emotionLoading, setEmotionLoading] = useState<boolean>(true)
  const [date, setDate] = useState<Date>(new Date())

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
          averageRating: feedbackStats.averageScore || 0,
        })
      } catch (error) {
        console.error("Failed to load main stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  useEffect(() => {
    const loadEmotionStats = async () => {
      setEmotionLoading(true)
      try {
        const formattedDate = format(date, "yyyyMMdd")
        const emotionStatsData: EmotionStats = await fetchCohesiveEmotionStats(formattedDate)
        setEmotionStats(emotionStatsData)
      } catch (error) {
        console.error("Failed to load emotion stats:", error)
        setEmotionStats({})
      } finally {
        setEmotionLoading(false)
      }
    }

    loadEmotionStats()
  }, [date])

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

  const emotions = Object.keys(emotionStats)
  const mostCohesiveValues = emotions.map(
    (emotion) => emotionStats[emotion]?.mostCohesiveValue ?? 0,
  )
  const mostCohesiveEmotions = emotions.map(
    (emotion) => emotionStats[emotion]?.mostCohesiveEmotion ?? "",
  )

  const emotionColors: Record<string, string> = {
    기쁨: "rgba(255, 193, 7, 0.7)",
    슬픔: "rgba(3, 169, 244, 0.7)",
    분노: "rgba(244, 67, 54, 0.7)",
    공포: "rgba(156, 39, 176, 0.7)",
    혐오: "rgba(76, 175, 80, 0.7)",
    놀람: "rgba(255, 152, 0, 0.7)",
    중립: "rgba(158, 158, 158, 0.7)",
    default: "rgba(99, 102, 241, 0.7)",
  }

  const backgroundColors = emotions.map(
    (emotion) => emotionColors[emotion] ?? emotionColors.default,
  )

  const data = {
    labels: emotions,
    datasets: [
      {
        label: "응집도 값",
        data: mostCohesiveValues,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map((color) => color.replace("0.7", "1")),
        borderWidth: 1,
        borderRadius: 6,
        maxBarThickness: 50,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "'Pretendard', sans-serif",
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "감정별 응집도 분석",
        font: {
          family: "'Pretendard', sans-serif",
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#333",
        titleFont: {
          family: "'Pretendard', sans-serif",
          size: 14,
        },
        bodyFont: {
          family: "'Pretendard', sans-serif",
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        callbacks: {
          title: (items) => {
            const idx = items[0].dataIndex
            return `${emotions[idx]} 감정 분석`
          },
          label: (context) => {
            const idx = context.dataIndex
            const emotion = emotions[idx]
            const mostCohesiveEmotion = mostCohesiveEmotions[idx]
            const value = mostCohesiveValues[idx].toFixed(2)
            return [`가장 응집된 감정: ${mostCohesiveEmotion}`, `응집도 값: ${value}`]
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          // drawBorder: false,
        },
        ticks: {
          font: {
            family: "'Pretendard', sans-serif",
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Pretendard', sans-serif",
            size: 12,
          },
        },
      },
    },
    animation: {
      // animateRotate: true,
      // animateScale: true,
      duration: 1000,
      easing: "easeOutQuart",
    },
    layout: {
      padding: {
        top: 10,
        right: 16,
        bottom: 10,
        left: 16,
      },
    },
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

<<<<<<< HEAD
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

=======
      {/* 감정 응집도 차트 */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>감정 응집도 시각화</CardTitle>
            <CardDescription>각 감정별 가장 응집된 감정과 응집도 값 표시</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <DatePicker date={date} onDateChange={setDate as (date: Date | undefined) => void} placeholder="날짜 선택" /> 
          </div>
        </CardHeader>
        <CardContent>
          {emotionLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : emotions.length > 0 ? (
            <div className="h-[300px] w-full">
              <Bar data={data} options={options} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <p>선택한 날짜에 대한 감정 데이터가 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>
>>>>>>> 3298310830a2bba1298b6c028042b7cc2077838e
    </div>
  )
}
