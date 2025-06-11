import { Heart, Music, Activity, BookOpen, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const faqs = [
    {
      question: "MoodSync는 어떻게 사용하나요?",
      answer:
        "현재 감정 상태를 선택하면, AI가 당신의 기분에 맞는 음악과 활동을 추천해드립니다. 추천받은 콘텐츠를 통해 감정을 관리하고 더 나은 하루를 만들어보세요.",
    },
    {
      question: "음악 추천은 어떤 기준으로 이루어지나요?",
      answer: "선택하신 감정 상태, 시간대, 날씨, 그리고 이전 선호도 데이터를 종합하여 가장 적합한 음악을 추천합니다.",
    },
    {
      question: "감정 기록은 어떻게 확인할 수 있나요?",
      answer:
        "마이페이지에서 일별, 주별, 월별 감정 변화를 그래프로 확인할 수 있습니다. 패턴을 파악하여 더 나은 감정 관리를 도와드립니다.",
    },
    {
      question: "개인정보는 안전하게 보호되나요?",
      answer:
        "네, 모든 개인정보와 감정 데이터는 암호화되어 안전하게 저장됩니다. 자세한 내용은 개인정보처리방침을 확인해주세요.",
    },
    {
      question: "추천이 마음에 들지 않으면 어떻게 하나요?",
      answer: "추천 결과에 대해 좋아요/싫어요 피드백을 주시면, AI가 학습하여 더 정확한 추천을 제공합니다.",
    },
  ]

  const guides = [
    {
      icon: Heart,
      title: "감정 선택하기",
      description: "현재 기분을 정확히 선택하여 맞춤 추천을 받아보세요",
    },
    {
      icon: Music,
      title: "음악 듣기",
      description: "추천받은 음악을 들으며 감정을 조절해보세요",
    },
    {
      icon: Activity,
      title: "활동 참여하기",
      description: "제안된 활동을 통해 긍정적인 변화를 경험하세요",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold">MoodSync 도움말</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">MoodSync 사용법과 자주 묻는 질문들을 확인해보세요</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Guide */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                빠른 시작 가이드
              </h2>
              <div className="space-y-4">
                {guides.map((guide, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                      <guide.icon className="w-4 h-4 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{guide.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{guide.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-500" />
                추가 도움이 필요하신가요?
              </h2>
              <div className="space-y-3">
                <Link href="/contact" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="font-medium text-blue-900">문의하기</div>
                  <div className="text-sm text-blue-700">직접 문의사항을 보내주세요</div>
                </Link>
                <Link
                  href="/feedback"
                  className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="font-medium text-green-900">피드백 보내기</div>
                  <div className="text-sm text-green-700">서비스 개선 의견을 알려주세요</div>
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">자주 묻는 질문</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <h3 className="font-medium text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
