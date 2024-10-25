import type { Context } from "hono"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"

export const sessisonManager = (c: Context) => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key)
    return result
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    } as const
    if (typeof value === 'string') {
      setCookie(c, key, value, cookieOptions)
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions)
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key)
  },
  async destroySession() {
    deleteCookie(c, 'token')
  },
})
