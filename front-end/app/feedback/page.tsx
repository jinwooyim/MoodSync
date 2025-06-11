"use client"

import type React from "react"

import { Heart, Star, ThumbsUp, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    rating: 0,
    message: "",
  })

  const categories = [
    "음악 추천 기능",
    "활동 추천 기능",
    "사용자 인터페이스",
    "성능 및 속도",
    "새로운 기능 제안",
    "기타",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 실제 구현에서는 서버로 데이터를 전송
    console.log("Feedback submitted:", formData)
    alert("소중한 피드백을 보내주셔서 감사합니다! 서비스 개선에 적극 반영하겠습니다.")
    setFormData({ name: "", email: "", category: "", rating: 0, message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRating = (rating: number) => {
    setFormData({
      ...formData,
      rating,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold">피드백</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            MoodSync를 더 나은 서비스로 만들기 위해 여러분의 소중한 의견을 들려주세요
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feedback Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-green-500" />
                피드백이 중요한 이유
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• 사용자 경험 개선에 직접적으로 반영됩니다</p>
                <p>• 새로운 기능 개발의 우선순위를 결정합니다</p>
                <p>• 버그 수정과 성능 최적화에 도움이 됩니다</p>
                <p>• 더 나은 MoodSync를 만드는 원동력입니다</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                피드백 작성 가이드
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 구체적인 상황과 예시를 포함해주세요</li>
                <li>• 개선되었으면 하는 점을 명확히 해주세요</li>
                <li>• 긍정적인 부분도 함께 알려주세요</li>
                <li>• 새로운 아이디어나 제안도 환영합니다</li>
              </ul>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">피드백 양식</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      이름 (선택사항)
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="이름을 입력해주세요"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      이메일 (선택사항)
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="답변을 받고 싶다면 이메일을 입력해주세요"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    피드백 카테고리 *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">카테고리를 선택해주세요</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">전체적인 만족도 *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRating(star)}
                        className={`p-1 rounded transition-colors ${
                          star <= formData.rating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{formData.rating > 0 && `${formData.rating}/5`}</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    피드백 내용 *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="MoodSync에 대한 솔직한 의견을 자유롭게 작성해주세요. 좋았던 점, 개선이 필요한 점, 새로운 아이디어 등 무엇이든 환영합니다."
                    rows={6}
                  />
                </div>

                <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600">
                  <Send className="w-4 h-4 mr-2" />
                  피드백 보내기
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
