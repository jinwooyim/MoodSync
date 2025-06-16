"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchContactAnalytics } from "@/lib/api/analytics"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { DatePicker } from "@/components/ui/date-picker"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Loader2 } from "lucide-react"
import { moodsyncTheme } from "@/lib/theme-config"

export function ContactTimeChart() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetchContactAnalytics(date)

        // 응답 데이터를 차트에 맞게 변환
        const chartData = Object.entries(response).map(([hour, count]) => ({
          hour: `${hour}시`,
          count: Number(count),
        }))

        setData(chartData)
      } catch (error) {
        console.error("Failed to load contact analytics:", error)
        setError("시간대별 문의 데이터를 불러오는데 실패했습니다.")
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
          <CardTitle className="text-sm font-medium">시간대별 문의 수</CardTitle>
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
                label: "문의 수",
                color: moodsyncTheme.chart.primary,
              },
            }}
          >
            <ResponsiveContainer width="99%" height="99%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 10 }}
                  interval={0}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 10 }} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill={moodsyncTheme.chart.primary} radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
