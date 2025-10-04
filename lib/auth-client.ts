import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://your-domain.com'
    : process.env.VITE_AUTH_BASE_URL || 'http://localhost:3000'
})
