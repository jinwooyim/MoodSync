"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { login } from "@/lib/api/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import useAuthStore from "@/store/authStore"

export default function UserLoginPage() {
  const [userId, setUserId] = useState("")
  const [userPw, setUserPw] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const authLoading = useAuthStore((state) => state.loading)
  const loginSuccess = useAuthStore((state) => state.loginSuccess)

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.replace("/record")
    }
  }, [isLoggedIn, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const userData = await login({ userId, userPw })
      loginSuccess(userData)
      router.push("/")
    } catch (err: any) {
      console.error("로그인 에러:", err)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else if (err.message) {
        setError(err.message)
      } else {
        setError("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <p className="text-lg text-gray-600">로그인 상태 확인 중...</p>
        </div>
      </div>
    )
  }

  if (isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden">
      <div className="container max-w-md mx-auto py-16 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">
            <i className="fa-solid fa-train-subway text-indigo-600"></i>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">MoodSync</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">로그인</h2>
          <p className="text-lg text-gray-600">감정 기반 맞춤 추천 서비스에 오신 것을 환영합니다</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="userId" className="block text-sm font-semibold text-gray-700 mb-2">
                아이디
              </label>
              <input
                id="userId"
                name="userId"
                type="text"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="아이디를 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="userPw" className="block text-sm font-semibold text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                id="userPw"
                name="userPw"
                type="password"
                required
                value={userPw}
                onChange={(e) => setUserPw(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="text-red-600 text-sm font-medium">{error}</div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  로그인 중...
                </div>
              ) : (
                "로그인"
              )}
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p className="text-gray-600 mb-2">MoodSync 회원이 아니신가요?</p>
            <Link
              href="/user/join"
              className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors duration-200"
            >
              회원가입하기
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
