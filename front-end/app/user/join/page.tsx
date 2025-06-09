"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { register, sendVerificationEmail } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Loader2,
  Mail,
  Shield,
  User,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Unlock,
  MapPin,
  Calendar,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  Heart,
  Music,
  BookOpen,
} from "lucide-react"

interface FormData {
  userEmail: string
  userId: string
  userName: string
  userPw: string
  pwdConfirm: string
  userTel: string
  userBirth: string
  userZipCode: string
  userAddress: string
  userDetailAddress: string
}

export default function UserJoinPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [form, setForm] = useState<FormData>({
    userEmail: "",
    userId: "",
    userName: "",
    userPw: "",
    pwdConfirm: "",
    userTel: "",
    userBirth: "",
    userZipCode: "",
    userAddress: "",
    userDetailAddress: "",
  })

  // 약관 동의 상태
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
    allAgree: false,
  })

  // 이메일 인증 상태
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [serverCode, setServerCode] = useState("")
  const [showVerificationInput, setShowVerificationInput] = useState(false)
  const [emailLocked, setEmailLocked] = useState(false)
  const [verificationLocked, setVerificationLocked] = useState(false)

  // UI 상태
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  // 에러 및 성공 메시지
  const [emailError, setEmailError] = useState("")
  const [emailSuccess, setEmailSuccess] = useState("")
  const [passwordMatchError, setPasswordMatchError] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const router = useRouter()

  const steps = [
    { id: 1, title: "약관 동의", icon: Shield },
    { id: 2, title: "이메일 인증", icon: Mail },
    { id: 3, title: "정보 입력", icon: User },
    { id: 4, title: "가입 완료", icon: CheckCircle },
  ]

  const progress = (currentStep / steps.length) * 100

  // 약관 동의 핸들러
  const handleAgreementChange = (type: string, checked: boolean) => {
    if (type === "allAgree") {
      setAgreements({
        terms: checked,
        privacy: checked,
        marketing: checked,
        allAgree: checked,
      })
    } else {
      const newAgreements = { ...agreements, [type]: checked }
      newAgreements.allAgree = newAgreements.terms && newAgreements.privacy && newAgreements.marketing
      setAgreements(newAgreements)
    }
  }

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prevForm) => ({ ...prevForm, [name]: value }))

    // 비밀번호 확인 실시간 체크
    if (name === "pwdConfirm" || name === "userPw") {
      if (name === "pwdConfirm" && value !== form.userPw) {
        setPasswordMatchError("비밀번호가 일치하지 않습니다.")
      } else if (name === "userPw" && value !== form.pwdConfirm && form.pwdConfirm !== "") {
        setPasswordMatchError("비밀번호가 일치하지 않습니다.")
      } else {
        setPasswordMatchError("")
      }
    }
  }

  // 전화번호 자동 하이픈 추가
  const handleTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let newValue = value.replace(/\D/g, "")

    if (newValue.length > 11) {
      newValue = newValue.substring(0, 11)
    }

    if (newValue.length <= 3) {
      newValue = newValue
    } else if (newValue.length <= 7) {
      newValue = `${newValue.substring(0, 3)}-${newValue.substring(3)}`
    } else {
      newValue = `${newValue.substring(0, 3)}-${newValue.substring(3, 7)}-${newValue.substring(7)}`
    }
    setForm((prevForm) => ({ ...prevForm, [name]: newValue }))
  }

  // 이메일 인증번호 발송
  const handleSendCode = async () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailPattern.test(form.userEmail)) {
      setEmailError("올바른 이메일 주소 형식으로 입력해주세요.")
      setEmailSuccess("")
      return
    }

    setEmailError("")
    setEmailSuccess("인증번호 발송 중...")
    setEmailLoading(true)

    try {
      const response = await sendVerificationEmail(form.userEmail)

      // 응답 구조 디버깅
      console.log("서버 응답:", response)

      if (response.success) {
        // 다양한 응답 구조에 대응
        // const code = response.code || response.verificationCode || response.authCode
        const code = response.code
        console.log("추출된 인증번호:", code)

        setServerCode(String(code)) // 문자열로 변환하여 저장
        setShowVerificationInput(true)
        setEmailLocked(true) // 이메일 입력 잠금
        setEmailSuccess(`인증번호가 발송되었습니다. 이메일을 확인해주세요.`)
      } else {
        setEmailError(response.message || "인증번호 발송에 실패했습니다.")
        setEmailSuccess("")
      }
    } catch (err: any) {
      console.error("인증번호 발송 실패:", err.response?.data || err.message)
      setEmailError(err.response?.data?.message || "인증번호 발송에 실패했습니다. 다시 시도해주세요.")
      setEmailSuccess("")
    } finally {
      setEmailLoading(false)
    }
  }

  // 인증번호 확인
  const handleVerifyCode = () => {
    // 디버깅을 위한 콘솔 로그 추가
    console.log("입력한 인증번호:", verificationCode)
    console.log("서버 인증번호:", serverCode)
    console.log("타입 확인 - 입력:", typeof verificationCode, "서버:", typeof serverCode)

    // 공백 제거 및 문자열로 변환하여 비교
    const inputCode = String(verificationCode).trim()
    const serverCodeStr = String(serverCode).trim()

    console.log("정제된 비교 - 입력:", inputCode, "서버:", serverCodeStr)

    if (inputCode === serverCodeStr && inputCode !== "") {
      setEmailVerified(true)
      setVerificationLocked(true) // 인증번호 입력 잠금
      setEmailError("")
      setEmailSuccess("이메일 인증이 완료되었습니다!")
      setShowVerificationInput(false)
    } else {
      setEmailVerified(false)
      setEmailError(`인증번호가 일치하지 않습니다. (입력: ${inputCode}, 예상: ${serverCodeStr})`)
      setEmailSuccess("")
    }
  }

  // 주소 검색
  const handleOpenPostcode = () => {
    if (typeof window !== "undefined" && window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: (data: any) => {
          let fullAddress = data.address
          let extraAddress = ""

          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraAddress += data.bname
          }
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraAddress += extraAddress !== "" ? ", " + data.buildingName : data.buildingName
          }
          if (extraAddress !== "") {
            fullAddress += " (" + extraAddress + ")"
          }

          setForm((prevForm) => ({
            ...prevForm,
            userZipCode: data.zonecode,
            userAddress: fullAddress,
          }))
        },
      }).open()
    }
  }

  // 다음 단계로
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  // 이전 단계로
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // 회원가입 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!emailVerified) {
      setError("이메일 인증을 완료해주세요.")
      return
    }
    if (form.userPw !== form.pwdConfirm) {
      setPasswordMatchError("비밀번호가 일치하지 않습니다.")
      setError("비밀번호를 확인해주세요.")
      return
    }

    setLoading(true)
    try {
      await register(form)
      setSuccess("회원가입이 완료되었습니다!")
      setCurrentStep(4)
      setTimeout(() => {
        router.push("/user/login")
      }, 3000)
    } catch (err: any) {
      console.error("회원가입 중 오류 발생:", err.response?.data || err.message)

      // 아이디 중복 에러 처리
      if (err.response?.data?.message?.includes("아이디") || err.response?.data?.message?.includes("중복")) {
        setError("이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.")
      } else {
        setError(err.response?.data?.message || "회원가입 중 오류가 발생했습니다.")
      }
    } finally {
      setLoading(false)
    }
  }

  // 단계별 유효성 검사
  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return agreements.terms && agreements.privacy
      case 2:
        return emailVerified
      case 3:
        return (
          form.userId &&
          form.userName &&
          form.userPw &&
          form.pwdConfirm &&
          form.userTel &&
          form.userBirth &&
          form.userZipCode &&
          form.userAddress &&
          !passwordMatchError
        )
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container max-w-2xl mx-auto py-8 px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
            </div>
            <div className="relative bg-gradient-to-br from-violet-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            MoodSync 회원가입
          </h1>
          <p className="text-gray-600">감정 기반 맞춤 추천 서비스에 가입하세요</p>

          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
            <Heart className="w-4 h-4 text-pink-500" />
            <Music className="w-4 h-4 text-blue-500" />
            <BookOpen className="w-4 h-4 text-green-500" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                          ? "bg-violet-500 text-white"
                          : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isActive ? "text-violet-600" : isCompleted ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold text-gray-800">{steps[currentStep - 1]?.title}</CardTitle>
            <CardDescription className="text-gray-600">
              {currentStep === 1 && "서비스 이용약관에 동의해주세요"}
              {currentStep === 2 && "이메일 인증을 완료해주세요"}
              {currentStep === 3 && "회원 정보를 입력해주세요"}
              {currentStep === 4 && "회원가입이 완료되었습니다!"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: 약관 동의 */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allAgree"
                      checked={agreements.allAgree}
                      onCheckedChange={(checked) => handleAgreementChange("allAgree", checked as boolean)}
                    />
                    <Label htmlFor="allAgree" className="font-semibold text-gray-800">
                      전체 동의
                    </Label>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreements.terms}
                        onCheckedChange={(checked) => handleAgreementChange("terms", checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-gray-700">
                        서비스 이용약관 동의 <span className="text-red-500">*</span>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="privacy"
                        checked={agreements.privacy}
                        onCheckedChange={(checked) => handleAgreementChange("privacy", checked as boolean)}
                      />
                      <Label htmlFor="privacy" className="text-gray-700">
                        개인정보 처리방침 동의 <span className="text-red-500">*</span>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="marketing"
                        checked={agreements.marketing}
                        onCheckedChange={(checked) => handleAgreementChange("marketing", checked as boolean)}
                      />
                      <Label htmlFor="marketing" className="text-gray-700">
                        마케팅 정보 수신 동의 (선택)
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: 이메일 인증 */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userEmail" className="text-sm font-semibold text-gray-700">
                    이메일 주소 <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="userEmail"
                        name="userEmail"
                        type="email"
                        value={form.userEmail}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        className="h-12 pr-10"
                        disabled={emailLocked}
                      />
                      {emailLocked ? (
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      ) : (
                        <Unlock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={handleSendCode}
                      disabled={emailLoading || emailLocked || !form.userEmail}
                      className="h-12 px-6"
                    >
                      {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "인증번호 발송"}
                    </Button>
                  </div>
                </div>

                {showVerificationInput && !verificationLocked && (
                  <div className="space-y-2">
                    <Label htmlFor="verificationCode" className="text-sm font-semibold text-gray-700">
                      인증번호
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="verificationCode"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="인증번호 8자리 입력"
                        className="h-12"
                        maxLength={10}
                      />
                      <Button
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={verificationCode.length === 0}
                        className="h-12 px-6"
                      >
                        인증 확인
                      </Button>
                    </div>
                  </div>
                )}

                {emailVerified && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-600 font-medium">
                      이메일 인증이 완료되었습니다!
                    </AlertDescription>
                  </Alert>
                )}

                {emailError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-600">{emailError}</AlertDescription>
                  </Alert>
                )}

                {emailSuccess && !emailError && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertDescription className="text-blue-600">{emailSuccess}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Step 3: 정보 입력 */}
            {currentStep === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userId" className="text-sm font-semibold text-gray-700">
                      아이디 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="userId"
                      name="userId"
                      value={form.userId}
                      onChange={handleChange}
                      placeholder="영문, 숫자 4~12자"
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userName" className="text-sm font-semibold text-gray-700">
                      이름 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="userName"
                      name="userName"
                      value={form.userName}
                      onChange={handleChange}
                      placeholder="한글 2~4자"
                      className="h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userPw" className="text-sm font-semibold text-gray-700">
                    비밀번호 <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="userPw"
                      name="userPw"
                      type={showPassword ? "text" : "password"}
                      value={form.userPw}
                      onChange={handleChange}
                      placeholder="영문, 숫자, 특수문자 포함 8~16자"
                      className="h-12 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pwdConfirm" className="text-sm font-semibold text-gray-700">
                    비밀번호 확인 <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="pwdConfirm"
                      name="pwdConfirm"
                      type={showPasswordConfirm ? "text" : "password"}
                      value={form.pwdConfirm}
                      onChange={handleChange}
                      placeholder="비밀번호를 다시 입력"
                      className="h-12 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    >
                      {showPasswordConfirm ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {passwordMatchError && <p className="text-sm text-red-500">{passwordMatchError}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userTel" className="text-sm font-semibold text-gray-700">
                      전화번호 <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="userTel"
                        name="userTel"
                        value={form.userTel}
                        onChange={handleTelChange}
                        placeholder="010-0000-0000"
                        className="h-12 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userBirth" className="text-sm font-semibold text-gray-700">
                      생년월일 <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="userBirth"
                        name="userBirth"
                        type="date"
                        value={form.userBirth}
                        onChange={handleChange}
                        className="h-12 pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    주소 <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        name="userZipCode"
                        value={form.userZipCode}
                        placeholder="우편번호"
                        className="h-12"
                        readOnly
                        required
                      />
                      <Button type="button" onClick={handleOpenPostcode} className="h-12 px-6" variant="outline">
                        <MapPin className="w-4 h-4 mr-2" />
                        주소 검색
                      </Button>
                    </div>
                    <Input
                      name="userAddress"
                      value={form.userAddress}
                      placeholder="도로명 또는 지번 주소"
                      className="h-12"
                      readOnly
                      required
                    />
                    <Input
                      name="userDetailAddress"
                      value={form.userDetailAddress}
                      onChange={handleChange}
                      placeholder="상세 주소 (선택사항)"
                      className="h-12"
                    />
                  </div>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-600">{error}</AlertDescription>
                  </Alert>
                )}
              </form>
            )}

            {/* Step 4: 완료 */}
            {currentStep === 4 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">회원가입 완료!</h3>
                  <p className="text-gray-600">
                    MoodSync에 오신 것을 환영합니다.
                    <br />
                    잠시 후 로그인 페이지로 이동합니다.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span>감정 기반 맞춤 추천 서비스</span>
                  <Music className="w-4 h-4 text-blue-500" />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className="h-12 px-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  이전
                </Button>

                {currentStep === 3 ? (
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading || !canProceedToNext()}
                    className="h-12 px-6"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        가입 중...
                      </>
                    ) : (
                      <>
                        회원가입
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNext} disabled={!canProceedToNext()} className="h-12 px-6">
                    다음
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            이미 계정이 있으신가요?{" "}
            <Link href="/user/login" className="text-violet-600 font-semibold hover:text-violet-700">
              로그인하기
            </Link>
          </p>
        </div>
      </div>

      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="beforeInteractive" />
    </div>
  )
}

declare global {
  interface Window {
    daum: any
  }
}
