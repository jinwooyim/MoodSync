"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Brain, Play, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { trainModel } from "@/lib/api/admin"
import { useToast } from "@/hooks/use-toast"

export function ModelTraining() {
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)
  const [trainingStatus, setTrainingStatus] = useState<"idle" | "training" | "success" | "error">("idle")
  const [lastTrainingTime, setLastTrainingTime] = useState<string | null>(null)
  const { toast } = useToast()

  const handleStartTraining = async () => {
    if (isTraining) return

    const confirmed = window.confirm(
      "모델 학습을 시작하시겠습니까?\n\n기존 모델 파일들이 삭제되고 새로운 모델이 생성됩니다.\n이 과정은 시간이 오래 걸릴 수 있습니다.",
    )

    if (!confirmed) return

    setIsTraining(true)
    setTrainingStatus("training")
    setProgress(0)

    // 진행률 시뮬레이션
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 10
      })
    }, 1000)

    try {
      const response = await trainModel()

      clearInterval(progressInterval)
      setProgress(100)

      if (response.status === "success") {
        setTrainingStatus("success")
        setLastTrainingTime(new Date().toLocaleString("ko-KR"))
        toast({
          title: "학습 완료",
          description: "모델 학습이 성공적으로 완료되었습니다.",
        })
      } else {
        setTrainingStatus("error")
        toast({
          title: "학습 실패",
          description: response.message || "모델 학습 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      clearInterval(progressInterval)
      setTrainingStatus("error")
      console.error("Training error:", error)
      toast({
        title: "오류 발생",
        description: "모델 학습 중 예상치 못한 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsTraining(false)
      setTimeout(() => {
        setProgress(0)
        setTrainingStatus("idle")
      }, 3000)
    }
  }

  const getStatusIcon = () => {
    switch (trainingStatus) {
      case "training":
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Brain className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = () => {
    switch (trainingStatus) {
      case "training":
        return "모델 학습 중..."
      case "success":
        return "학습 완료"
      case "error":
        return "학습 실패"
      default:
        return "대기 중"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI 모델 학습
          </CardTitle>
          <CardDescription>추천 시스템의 AI 모델을 새로운 데이터로 재학습시킵니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 현재 상태 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <p className="font-medium">{getStatusText()}</p>
                {lastTrainingTime && <p className="text-sm text-gray-600">마지막 학습: {lastTrainingTime}</p>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">진행률</p>
              <p className="text-lg font-bold">{Math.round(progress)}%</p>
            </div>
          </div>

          {/* 진행률 바 */}
          {isTraining && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">모델 학습 중... 잠시만 기다려주세요.</p>
            </div>
          )}

          {/* 경고 메시지 */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>주의사항:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• 모델 학습은 시간이 오래 걸릴 수 있습니다 (10-30분)</li>
                <li>• 학습 중에는 추천 기능이 일시적으로 중단될 수 있습니다</li>
                <li>• 기존 모델 파일들이 삭제되고 새로운 모델이 생성됩니다</li>
                <li>• 학습 중에는 페이지를 새로고침하지 마세요</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* 모델 정보 */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">활동 추천 모델</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>파일:</span>
                    <span className="text-gray-600">act_model/</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>상태:</span>
                    <span className="text-green-600">활성</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">도서 추천 모델</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>파일:</span>
                    <span className="text-gray-600">book_model/</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>상태:</span>
                    <span className="text-green-600">활성</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">음악 추천 모델</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>파일:</span>
                    <span className="text-gray-600">music_model/</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>상태:</span>
                    <span className="text-green-600">활성</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 학습 시작 버튼 */}
          <div className="flex justify-center">
            <Button
              onClick={handleStartTraining}
              disabled={isTraining}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isTraining ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  학습 중...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  모델 학습 시작
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
