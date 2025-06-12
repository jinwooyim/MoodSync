import api from "./base"
import type { Contact } from "@/types/contact"

export interface CreateContactParams {
  contact_title: string
  contact_content: string
}

export interface ReadContactParams {
  contact_title: string
  contact_content: string
}

export interface UpdateContactParams {
  contact_title: string
  contact_content: string
}

export interface DeleteContactParams {
  contact_title: string
  contact_content: string
}

export async function createContact(params: CreateContactParams) {
  const res = await api.get("/api/create_contact", {
    params: {
      contact_title: params.contact_title,
      contact_content: params.contact_content,
    },
  })
  return res.data
}

export async function readContact(params: ReadContactParams) {
  const res = await api.get("/api/read_contact", {
    params: {
      contact_title: params.contact_title,
      contact_content: params.contact_content,
    },
  })
  return res.data
}

export async function updateContact(params: UpdateContactParams) {
  const res = await api.get("/api/update_contact", {
    params: {
      contact_title: params.contact_title,
      contact_content: params.contact_content,
    },
  })
  return res.data
}

export async function deleteContact(params: DeleteContactParams) {
  const res = await api.get("/api/delete_contact", {
    params: {
      contact_title: params.contact_title,
      contact_content: params.contact_content,
    },
  })
  return res.data
}

export async function fetchContacts(
  pageNum = 1,
  amount = 10,
): Promise<{
  contacts: Contact[]
  pagination: {
    currentPage: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}> {
  const res = await api.get("/api/all_contacts", {
    params: {
      pageNum,
      amount,
    },
  })

  if (res.data.status === "success") {
    return {
      contacts: res.data.data.map((dto: any) => ({
        contactId: String(dto.contactId),
        userNumber: dto.userNumber,
        contactTitle: dto.contactTitle,
        contactContent: dto.contactContent,
      })),
      pagination: res.data.pagination,
    }
  } else {
    throw new Error(res.data.message || "문의 목록 조회에 실패했습니다.")
  }
}

// 🆕 나의 문의 조회 함수 추가
export async function fetchMyContacts(
  pageNum = 1,
  amount = 5,
): Promise<{
  contacts: Contact[]
  pagination: {
    currentPage: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}> {
  const res = await api.get("/api/my_contacts", {
    params: {
      pageNum,
      amount,
    },
  })

  if (res.data.status === "success") {
    return {
      contacts: res.data.data.map((dto: any) => ({
        contactId: String(dto.contactId),
        userNumber: dto.userNumber,
        contactTitle: dto.contactTitle,
        contactContent: dto.contactContent,
        createdDate: dto.createdDate,
      })),
      pagination: res.data.pagination,
    }
  } else {
    throw new Error(res.data.message || "나의 문의 목록 조회에 실패했습니다.")
  }
}

export async function fetchContactStats(): Promise<{ totalContacts: number }> {
  const res = await api.get("/api/contact_stats")

  if (res.data.status === "success") {
    return {
      totalContacts: res.data.totalContacts,
    }
  } else {
    throw new Error(res.data.message || "문의 통계 조회에 실패했습니다.")
  }
}
