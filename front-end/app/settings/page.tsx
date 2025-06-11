"use client"

import { Heart, User, Bell, Music, Shield, Palette, Download, Trash2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // 알림 설정
    pushNotifications: true,
    emailNotifications: false,
    moodReminders: true,
    weeklyReports: true,

    // 개인화 설정
    autoMoodDetection: false,
    shareAnonymousData: true,

    // 앱 설정
    darkMode: false,
    language: "ko",

    // 프로필 설정
    displayName: "사용자",
    email: "user@example.com",
  })

  const [visibleItems, setVisibleItems] = useState<number[]>([])

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      // 각 카드를 순차적으로 나타나게 함
      const totalItems = 7 // 총 카드 개수
      for (let i = 0; i < totalItems; i++) {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, i])
        }, i * 100) // 100ms 간격으로 순차 등장
      }
    }, 200) // 페이지 로드 후 200ms 후 시작

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-6 h-6 text-pink-500" />
            <h1 className="text-2xl font-bold">설정</h1>
          </div>
          <p className="text-gray-600">MoodSync 서비스를 개인화하고 관리하세요</p>
        </div>

        <div className="space-y-6">
          {/* 계정 설정 */}
          <Card
            className={`transition-all duration-500 ease-out ${
              visibleItems.includes(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                계정 설정
              </CardTitle>
              <CardDescription>프로필 정보와 계정 보안을 관리하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayName">표시 이름</Label>
                  <Input
                    id="displayName"
                    value={settings.displayName}
                    onChange={(e) => handleSettingChange("displayName", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange("email", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  비밀번호 변경
                </Button>
                <Button variant="outline" size="sm">
                  프로필 사진 변경
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 알림 설정 */}
          <Card
            className={`transition-all duration-500 ease-out ${
              visibleItems.includes(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-green-500" />
                알림 설정
              </CardTitle>
              <CardDescription>받고 싶은 알림을 선택하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications" className="text-sm font-medium">
                    푸시 알림
                  </Label>
                  <p className="text-xs text-gray-500">앱 내 알림을 받습니다</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications" className="text-sm font-medium">
                    이메일 알림
                  </Label>
                  <p className="text-xs text-gray-500">중요한 업데이트를 이메일로 받습니다</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="moodReminders" className="text-sm font-medium">
                    감정 기록 리마인더
                  </Label>
                  <p className="text-xs text-gray-500">감정을 기록할 시간을 알려드립니다</p>
                </div>
                <Switch
                  id="moodReminders"
                  checked={settings.moodReminders}
                  onCheckedChange={(checked) => handleSettingChange("moodReminders", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyReports" className="text-sm font-medium">
                    주간 감정 리포트
                  </Label>
                  <p className="text-xs text-gray-500">매주 감정 분석 리포트를 받습니다</p>
                </div>
                <Switch
                  id="weeklyReports"
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => handleSettingChange("weeklyReports", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 개인화 설정 */}
          <Card
            className={`transition-all duration-500 ease-out ${
              visibleItems.includes(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-500" />
                개인화 설정
              </CardTitle>
              <CardDescription>추천 서비스를 개인화하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoMoodDetection" className="text-sm font-medium">
                    자동 감정 감지
                  </Label>
                  <p className="text-xs text-gray-500">텍스트 입력을 통해 감정을 자동으로 분석합니다</p>
                </div>
                <Switch
                  id="autoMoodDetection"
                  checked={settings.autoMoodDetection}
                  onCheckedChange={(checked) => handleSettingChange("autoMoodDetection", checked)}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-sm font-medium">음악 선호도</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["팝", "록", "재즈", "클래식", "힙합", "인디", "발라드", "일렉트로닉"].map((genre) => (
                    <Button key={genre} variant="outline" size="sm" className="text-xs">
                      {genre}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">선호 활동</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {["운동", "독서", "산책", "명상", "요리", "그림그리기"].map((activity) => (
                    <Button key={activity} variant="outline" size="sm" className="text-xs">
                      {activity}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 프라이버시 설정 */}
          <Card
            className={`transition-all duration-500 ease-out ${
              visibleItems.includes(3) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                프라이버시 설정
              </CardTitle>
              <CardDescription>개인정보와 데이터 사용을 관리하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="shareAnonymousData" className="text-sm font-medium">
                    익명 데이터 공유
                  </Label>
                  <p className="text-xs text-gray-500">서비스 개선을 위해 익명화된 데이터를 공유합니다</p>
                </div>
                <Switch
                  id="shareAnonymousData"
                  checked={settings.shareAnonymousData}
                  onCheckedChange={(checked) => handleSettingChange("shareAnonymousData", checked)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  개인정보처리방침 보기
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-between">
                  데이터 사용 내역 보기
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 앱 설정 */}
          <Card
            className={`transition-all duration-500 ease-out ${
              visibleItems.includes(4) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-500" />앱 설정
              </CardTitle>
              <CardDescription>앱 모양과 동작을 설정하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode" className="text-sm font-medium">
                    다크 모드
                  </Label>
                  <p className="text-xs text-gray-500">어두운 테마를 사용합니다</p>
                </div>
                <Switch
                  id="darkMode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium">
                  언어
                </Label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => handleSettingChange("language", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* 데이터 관리 */}
          <Card
            className={`transition-all duration-500 ease-out ${
              visibleItems.includes(5) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-orange-500" />
                데이터 관리
              </CardTitle>
              <CardDescription>내 데이터를 관리하고 백업하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  감정 데이터 내보내기
                </Button>
                <Button variant="outline" className="justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  음악 기록 내보내기
                </Button>
              </div>

              <Separator />

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  위험 구역
                </h4>
                <p className="text-sm text-red-700 mb-3">아래 작업들은 되돌릴 수 없습니다. 신중하게 결정해주세요.</p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                    모든 감정 데이터 삭제
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                    계정 완전 삭제
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 지원 및 정보 */}
          <Card
            className={`transition-all duration-500 ease-out ${
              visibleItems.includes(6) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <CardHeader>
              <CardTitle>지원 및 정보</CardTitle>
              <CardDescription>도움이 필요하거나 더 알고 싶은 정보가 있나요?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-between">
                  도움말 센터
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="justify-between">
                  문의하기
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="justify-between">
                  앱 정보
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="justify-between">
                  피드백 보내기
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 저장 버튼 */}
        <div
          className={`mt-8 flex justify-end gap-3 transition-all duration-500 ease-out ${
            visibleItems.includes(6) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Button variant="outline">취소</Button>
          <Button className="bg-pink-500 hover:bg-pink-600">설정 저장</Button>
        </div>
      </div>
    </div>
  )
}
