"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageSquare, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { fetchMyContacts } from "@/lib/api/contact"
import type { Contact } from "@/types/contact"

interface MyContactsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function MyContactsModal({ isOpen, onClose }: MyContactsModalProps) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 5,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  })

  const loadContacts = async (page = 1) => {
    setLoading(true)
    try {
      const response = await fetchMyContacts(page, 5)
      setContacts(response.contacts)
      setPagination(response.pagination)
      setCurrentPage(page)
    } catch (error) {
      console.error("Failed to load contacts:", error)
      setContacts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadContacts(1)
    }
  }, [isOpen])

  const handlePrevPage = () => {
    if (pagination.hasPrevious) {
      loadContacts(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (pagination.hasNext) {
      loadContacts(currentPage + 1)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "날짜 정보 없음"
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-pink-500" />
            나의 문의 목록
          </DialogTitle>
          <DialogDescription>등록하신 문의 내역을 확인할 수 있습니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
              <span className="ml-2 text-sm text-gray-600">문의 목록을 불러오는 중...</span>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">등록된 문의가 없습니다.</p>
            </div>
          ) : (
            <>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <div
                      key={contact.contactId}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                          {contact.contactTitle}
                        </h3>
                        <Badge variant="secondary" className="ml-2 shrink-0">
                          #{contact.contactId}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {contact.contactContent}
                      </p>

                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(contact.createdDate)}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* 페이지네이션 */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    총 {pagination.totalCount}개 중 {(currentPage - 1) * pagination.pageSize + 1}-
                    {Math.min(currentPage * pagination.pageSize, pagination.totalCount)}개 표시
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={!pagination.hasPrevious}>
                      <ChevronLeft className="h-4 w-4" />
                      이전
                    </Button>

                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {currentPage} / {pagination.totalPages}
                    </span>

                    <Button variant="outline" size="sm" onClick={handleNextPage} disabled={!pagination.hasNext}>
                      다음
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
