import api from "./base"
import type { Contact } from "@/types/contact"

export interface CreateContactParams {
  userName: string
  userEmail: string
  contact_title: string
  contact_content: string
}

export interface UpdateContactParams {
  contactId: number
  userName: string
  userEmail: string
  contact_title: string
  contact_content: string
}

export async function createContact(params: CreateContactParams) {
  const res = await api.post("/api/contacts", params)
  return res.data
}

export async function updateContact(params: UpdateContactParams) {
  const { contactId, ...rest } = params
  const res = await api.put(`/api/contacts/${contactId}`, rest)
  return res.data
}

export async function deleteContact(contactId: number) {
  const res = await api.delete(`/api/contacts/${contactId}`)
  return res.data
}

export async function fetchContacts(): Promise<Contact[]> {
  const res = await api.get("/api/contacts/user-contacts") // 백엔드 @GetMapping("/user-contacts")를 호출

  return res.data.map((dto: any) => ({
    contactId: String(dto.contactId),
    userNumber: dto.userNumber,
    contactTitle: dto.contactTitle,
    contactContent: dto.contactContent,
  }))
}

export async function fetchContact(contactId: string): Promise<Contact> {
  const res = await api.get(`/api/contacts/${contactId}`)
  const dto = res.data
  return {
    contactId: String(dto.contactId),
    userNumber: dto.userNumber,
    contactTitle: dto.contactTitle,
    contactContent: dto.contactContent,
  }
}