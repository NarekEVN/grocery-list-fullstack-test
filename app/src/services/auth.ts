import ky, { Hooks } from 'ky'
import { env } from '@constants/env'

export interface Credentials {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  name?: string | null
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

const retriedOnce = new WeakSet<Request>()

const tokenStore = {
  get access() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null
  },
  get refresh() {
    return typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null
  },
  set(tokens: { accessToken: string; refreshToken: string }) {
    localStorage.setItem('token', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
  },
  clear() {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  },
}

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const rt = tokenStore.refresh
  if (!rt) throw new Error('No refresh token')
  if (!refreshPromise) {
    refreshPromise = ky
      .post(`${env.API_URL}/auth/refresh`, { json: { refreshToken: rt } })
      .json<{ data: AuthResponse }>()
      .then(res => {
        tokenStore.set({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken })
        return res.data.accessToken
      })
      .catch(err => {
        tokenStore.clear()
        throw err
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

const hooks: Hooks = {
  beforeRequest: [
    async request => {
      const at = tokenStore.access
      if (at) {
        request.headers.set('Authorization', `Bearer ${at}`)
      }
    },
  ],
  afterResponse: [
    async (request, options, response) => {
      if (response.status !== 401) return
      if (retriedOnce.has(request)) return

      try {
        const newAccess = await refreshAccessToken()
        retriedOnce.add(request)
        const retryHeaders = new Headers(options.headers as HeadersInit | undefined)
        retryHeaders.set('Authorization', `Bearer ${newAccess}`)
        return ky(request, { ...options, headers: retryHeaders })
      } catch {
        throw response
      }
    },
  ],
}

export const api = ky.create({
  prefixUrl: env.API_URL,
  hooks,
  retry: { limit: 0 },
})

export const login = async (payload: Credentials): Promise<AuthResponse> => {
  const res = await ky.post(`${env.API_URL}/auth/login`, { json: payload }).json<{ data: AuthResponse }>()
  tokenStore.set({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken })
  return res.data
}

export const register = async (payload: Credentials): Promise<AuthResponse> => {
  const res = await ky.post(`${env.API_URL}/auth/register`, { json: payload }).json<{ data: AuthResponse }>()
  tokenStore.set({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken })
  return res.data
}

export const getCurrentUser = async (): Promise<User> => {
  const res = await api.get('auth/me').json<{ data: User }>()
  return res.data
}
