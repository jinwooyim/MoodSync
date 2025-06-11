"use client"

import { useEffect, useState, useRef } from "react"
import {
  getUserRecord,
  getLatestRecords,
  type UserRecord,
} from "@/lib/mypage/mypage-types"
import { Calendar, TrendingUp, BookOpen, BarChart3 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { DailyEmotionView } from "@/components/mypage/daily-emotion-view"
import { WeeklyTrendView } from "@/components/mypage/weekly-trend-view"
import { WeeklyRecommendationsView } from "@/components/mypage/weekly-recommendations-view"

const menuItems = [
  {
    title: "일별 감정 차트",
    icon: BarChart3,
    id: "daily-emotions",
  },
  {
    title: "주간 감정 추세",
    icon: TrendingUp,
    id: "weekly-trend",
  },
  {
    title: "주간 추천 기록",
    icon: BookOpen,
    id: "weekly-recommendations",
  },
]


export function EmotionDashboard() {
  const [activeView, setActiveView] = useState("daily-emotions")
  const [currentRecord, setCurrentRecord] = useState<UserRecord | null>(null)
  const [allRecords, setAllRecords] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const hasFetched = useRef(false)

  useEffect(() => {
    // 1번만 실행되도록
    if (hasFetched.current) return
    hasFetched.current = true

    async function fetchData() {
      setLoading(true)
      try {
        const [current, latest] = await Promise.all([
          getUserRecord(),
          getLatestRecords(),
        ])
        setCurrentRecord(current)
        setAllRecords(latest)
      } catch (error) {
        console.error("데이터 로딩 실패:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const renderContent = () => {
    if (loading) {
      return <p className="p-4">데이터 로딩 중...</p>
    }

    switch (activeView) {
      case "daily-emotions":
        return (
          <DailyEmotionView
            currentRecord={currentRecord}
            allRecords={allRecords}
          />
        )
      case "weekly-trend":
        return <WeeklyTrendView allRecords={allRecords} />
      case "weekly-recommendations":
        return (
          <WeeklyRecommendationsView
            allRecords={allRecords}
          />
        )
      default:
        return <DailyEmotionView currentRecord={currentRecord} allRecords={allRecords} />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex flex-grow">
      <Sidebar className="flex pt-[70px] ">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Calendar className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold">감정 대시보드</span>
              <span className="text-xs text-muted-foreground">Emotion Tracker</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>메뉴</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild isActive={activeView === item.id} onClick={() => setActiveView(item.id)}>
                      <button className="flex items-center gap-2">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">
            {menuItems.find((item) => item.id === activeView)?.title || "감정 대시보드"}
          </h1>
        </header>
        <div className="flex-1 overflow-auto">{renderContent()}</div>
      </SidebarInset>
    </div>
    </SidebarProvider>
  )
}
