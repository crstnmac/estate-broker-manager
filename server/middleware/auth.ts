import {createFactory, createMiddleware} from 'hono/factory'
import {sessisonManager} from '../utils/sessionManager'
import {Jwt} from 'hono/utils/jwt'
import {config} from '../config'

export type UserProfile = {
  name: string
  email: string
  role: 'admin' | 'user'
}

type Env = {
  Variables: {
    user: UserProfile
  }
}

export const getUser = createMiddleware(async (c, next) => {
  try {
    const manager = sessisonManager(c)

    const token = await manager.getSessionItem('token')

    if (!token) {
      return c.json({message: 'Unauthorized'}, 401)
    }

    const user = await Jwt.verify(token, config.jwt.secret)

    c.set('user', user)

    await next()
  } catch (e) {
    console.error(e)
    return c.json({message: 'Unauthorized'}, 401)
  }
})
