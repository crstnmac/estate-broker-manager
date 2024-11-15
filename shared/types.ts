import {z} from 'zod'
import type {ApiRoutes} from '../server/app'

export {type ApiRoutes}

export type SuccessResponse<T = void> = {
  success: true
  message: string
} & (T extends void ? {} : {data: T})

export type ErrorResponse = {
  success: false
  error: string
  isFormError?: boolean
}

export const registerSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(3).max(255),
})

export const loginSchema = z.object({
  email: z.string().min(3).max(255),
  password: z.string().min(3).max(255),
})


export interface TimelineEvent {
  id: number
  leadId: number
  type: 'status_change' | 'note_added' | 'contact' | 'meeting_scheduled' | 'document_added'
  description: string
  metadata?: Record<string, unknown>
  createdAt: string
  createdById: number
}

export interface Lead {
  id: number
  name: string
  email: string
  phone?: string
  status: 'new' | 'contacted' | 'qualified' | 'lost'
  source: string
  notes?: string
  assignedToId?: number
  lastContact?: Date
  createdAt: string
  updatedAt: string
}


