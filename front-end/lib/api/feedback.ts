import api from "./base"

export interface CreateFeedbackParams {
  feedback_category: string
  feedback_score: number
  feedback_content: string
}

export interface FeedbackResponse {
  status: string
  message: string
  feedbackId?: number
}

export async function createFeedback(params: CreateFeedbackParams): Promise<FeedbackResponse> {
  const res = await api.get("/api/create_feedback", {
    params: {
      feedback_category: params.feedback_category,
      feedback_score: params.feedback_score,
      feedback_content: params.feedback_content,
    },
  })
  return res.data
}

export async function fetchAllFeedbacks(
  pageNum = 1,
  amount = 10,
): Promise<{
  feedbacks: any[]
  pagination: {
    currentPage: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}> {
  const res = await api.get("/api/all_feedbacks", {
    params: {
      pageNum,
      amount,
    },
  })

  if (res.data.status === "success") {
    return {
      feedbacks: res.data.data,
      pagination: res.data.pagination,
    }
  } else {
    throw new Error(res.data.message || "피드백 목록 조회에 실패했습니다.")
  }
}

export async function fetchFeedbackStats(): Promise<{ totalFeedbacks: number }> {
  const res = await api.get("/api/feedback_stats")

  if (res.data.status === "success") {
    return {
      totalFeedbacks: res.data.totalFeedbacks,
    }
  } else {
    throw new Error(res.data.message || "피드백 통계 조회에 실패했습니다.")
  }
}
