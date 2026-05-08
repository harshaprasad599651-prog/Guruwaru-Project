export interface Review {
  id: number
  teacher_id: number
  student_name: string
  rating: number
  review: string
  created_at?: string
}