export interface User {
  id: string
  email: string
  credits: number
}

export interface AuthResponse {
  success: boolean
  token: string
  user: User
}

export interface AuthPayload {
  email: string
  password: string
}
