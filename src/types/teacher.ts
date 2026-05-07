




export interface Teacher {
  id: number
  username: string
  password: string
  name: string
  photoUrl: string
  subject: string
  grade: string
  district: string
  city: string
  modes: string[]
  fee: string
  experience: string
  qualification: string
  phone: string
  whatsapp: string
  description: string
  status: 'pending' | 'approved'
  isActive: boolean
}