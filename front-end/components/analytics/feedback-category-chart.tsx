"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchFeedbackAnalytics } from "@/lib/api/analytics"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { DatePicker } from "@/components/ui/date-picker"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Loader2 } from "lucide-react"
import { moodsyncTheme } from "@/lib/theme-config"

export function FeedbackCategoryChart() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetchFeedbackAnalytics(date)

        // 카테고리명을 한글로 변환하는 함수
        const getCategoryName = (category: string) => {
          const categoryMap: Record<string, string> = {
            UI: "UI/UX",
            PERFORMANCE: "성능",
            FEATURE: "기능",
            BUG: "버그",
            OTHER: "기타",
          }
          return categoryMap[category] || category
        }

        // 응답 데이터를 차트에 맞게 변환
        const chartData = response.map((item: any) => ({
          category: getCategoryName(item.feedback_category),
          count: Number(item.count),
          score: Number(item.avg_score).toFixed(1),
        }))

        setData(chartData)
      } catch (error) {
        console.error("Failed to load feedback analytics:", error)
        setError("카테고리별 피드백 데이터를 불러오는데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [date])

  // 현재 표시 중인 날짜 (date가 undefined면 오늘 날짜 사용)
  const displayDate = date || new Date()

  return (
    <Card className="w-full h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">카테고리별 피드백</CardTitle>
          <CardDescription className="text-xs">
            {format(displayDate, "yyyy년 MM월 dd일", { locale: ko })} 기준
          </CardDescription>
        </div>
        <DatePicker date={date} onDateChange={setDate} placeholder="날짜 선택 (기본: 오늘)" />
      </CardHeader>
      <CardContent className="h-[300px] pt-4 px-2">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <p>{error}</p>
          </div>
        ) : (
          <ChartContainer
            config={{
              count: {
                label: "피드백 수",
                color: moodsyncTheme.chart.secondary,
              },
            }}
          >
            <ResponsiveContainer width="99%" height="99%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 10 }}
                  interval={0}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 10 }} />
                <ChartTooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">카테고리</span>
                              <span className="font-bold text-muted-foreground">{payload[0].payload.category}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">피드백 수</span>
                              <span className="font-bold">{payload[0].value}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">평균 점수</span>
                              <span className="font-bold">{payload[0].payload.score}/5</span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="count" fill={moodsyncTheme.chart.secondary} radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
