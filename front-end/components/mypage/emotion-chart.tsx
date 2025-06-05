"use client"

import { useEffect, useRef } from "react"
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js"

// Register the required components
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend)

interface EmotionChartProps {
  emotions: {
    happiness: number
    sadness: number
    anger: number
    fear: number
    surprise: number
    disgust: number
  }
}

export function EmotionChart({ emotions }: EmotionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["행복", "슬픔", "분노", "두려움", "놀람", "혐오"],
        datasets: [
          {
            label: "감정 수치",
            data: [
              emotions.happiness,
              emotions.sadness,
              emotions.anger,
              emotions.fear,
              emotions.surprise,
              emotions.disgust,
            ],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(75, 192, 192, 1)",
          },
        ],
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    })

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [emotions])

  return (
    <div className="w-full aspect-square">
      <canvas ref={chartRef} />
    </div>
  )
}
