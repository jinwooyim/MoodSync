"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { moodsyncTheme } from "@/lib/theme-config"

export function ChurnPredictionChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const loadChurnData = async () => {
    setLoading(true)
    setError(null)

    try {
      // 예시 데이터 - 실제로는 필요한 사용자 데이터를 전달해야 함
      const userData = {
        // 이탈 예측에 필요한 데이터
        userActivity: {
          loginFrequency: 3,
          avgSessionTime: 15,
          daysInactive: 5,
        },
        userFeedback: {
          avgScore: 3.2,
        },
      }

      // 직접 TensorFlow 서버로 요청
      const response = await fetch("http://localhost:4000/predict-churn-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      console.log("@# userData =>" , userData);

      if (!response.ok) {
        throw new Error("Failed to fetch churn analytics")
      }

      const result = await response.json()

      // 응답 데이터를 차트에 맞게 변환
      const chartData = [
        { name: "이탈 위험", value: result.churnProbability * 100 },
        { name: "유지 예상", value: (1 - result.churnProbability) * 100 },
      ]

      setData(chartData)
    } catch (error) {
      console.error("Failed to load churn analytics:", error)
      setError("이탈 예측 데이터를 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // 컴포넌트가 마운트될 때 데이터 로드
  useEffect(() => {
    // 초기 데이터 로드
    loadChurnData()
  }, [])

  // moodsync 테마에 맞는 색상
  const COLORS = [moodsyncTheme.error, moodsyncTheme.success]

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card className="w-full h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">사용자 이탈 예측</CardTitle>
          <CardDescription className="text-xs">머신러닝 기반 사용자 이탈 위험도 분석</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadChurnData}
          disabled={loading}
          className="bg-white hover:bg-gray-100 text-gray-800 border-gray-300"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          분석 실행
        </Button>
      </CardHeader>
      <CardContent className="h-[300px] pt-4 px-2">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p>{error}</p>
          </div>
        ) : (
          <ChartContainer
            config={{
              value: {
                label: "이탈 예측",
                color: moodsyncTheme.chart.accent,
              },
            }}
          >
            <ResponsiveContainer width="99%" height="99%">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, ""]} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
