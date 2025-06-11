// components/Footer.tsx

import { Heart } from "lucide-react"; // 필요한 아이콘만 임포트
import Link from 'next/link'; // Link 컴포넌트 사용 시 임포트
import { useState } from "react"
import { PrivacyModal } from "../modals/PrivacyModal"
import { TermsModal } from "../modals/TermsModal"
import { AboutModal } from "../modals/AboutModal"

export default function Footer() {
  const [openModal, setOpenModal] = useState<string | null>(null)

  const handleModalOpen = (modalType: string) => {
    setOpenModal(modalType)
  }

  const handleModalClose = () => {
    setOpenModal(null)
  }
  return (
    <>
    <footer className="bg-white border-t " >
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-pink-500" />
              <span className="font-bold text-lg">MoodSync</span>
            </div>
            <p className="text-gray-600 text-sm">감정에 맞는 음악과 활동을 추천하여 더 나은 하루를 만들어갑니다.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                  음악 추천
              </li>
              <li>
                  활동 추천
              </li>
              <li>
                  감정 기록
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">지원</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/help" className="hover:text-gray-900">
                  도움말
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-900">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-gray-900">
                  피드백
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">정보</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                  <button onClick={() => handleModalOpen("privacy")} className="hover:text-gray-900 text-left">
                    개인정보처리방침
                  </button>
                </li>
                <li>
                  <button onClick={() => handleModalOpen("terms")} className="hover:text-gray-900 text-left">
                    이용약관
                  </button>
                </li>
                <li>
                  <button onClick={() => handleModalOpen("about")} className="hover:text-gray-900 text-left">
                    회사소개
                  </button>
                </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 MoodSync. All rights reserved.</p>
        </div>
      </div>
    </footer>
    {/* Modals */}
      <PrivacyModal isOpen={openModal === "privacy"} onClose={handleModalClose} />
      <TermsModal isOpen={openModal === "terms"} onClose={handleModalClose} />
      <AboutModal isOpen={openModal === "about"} onClose={handleModalClose} />
    </>
  );
}