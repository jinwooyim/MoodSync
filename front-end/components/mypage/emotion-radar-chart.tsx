"use client"

import { useEffect, useRef } from "react"
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js"
import type { UserRecord } from "@/lib/api-types"

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend)

interface EmotionRadarChartProps {
  record: UserRecord
}

export function EmotionRadarChart({ record }: EmotionRadarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["행복", "슬픔", "스트레스", "평온함", "신남", "피곤함"],
        datasets: [
          {
            label: "감정 수치",
            data: [record.happy, record.sad, record.stress, record.calm, record.excited, record.tired],
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(59, 130, 246, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(59, 130, 246, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
            },
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            angleLines: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed.r}`,
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [record])

  return (
    <div className="space-y-4">
      <div className="w-full h-80">
        <canvas ref={chartRef} />
      </div>

      {/* 감정 수치 표시 */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex justify-between">
          <span>행복:</span>
          <span className="font-semibold">{record.happy}</span>
        </div>
        <div className="flex justify-between">
          <span>슬픔:</span>
          <span className="font-semibold">{record.sad}</span>
        </div>
        <div className="flex justify-between">
          <span>스트레스:</span>
          <span className="font-semibold">{record.stress}</span>
        </div>
        <div className="flex justify-between">
          <span>평온함:</span>
          <span className="font-semibold">{record.calm}</span>
        </div>
        <div className="flex justify-between">
          <span>신남:</span>
          <span className="font-semibold">{record.excited}</span>
        </div>
        <div className="flex justify-between">
          <span>피곤함:</span>
          <span className="font-semibold">{record.tired}</span>
        </div>
      </div>
    </div>
  )
}
