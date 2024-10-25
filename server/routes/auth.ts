import {Hono, type Context} from 'hono'
import {config} from '../config'
import bcrypt from 'bcrypt'
import {zValidator} from '@hono/zod-validator'
import {createUserSchema} from './users'
import {db} from '../db'
import {users} from '../db/schema'
import {eq} from 'drizzle-orm'
import {Jwt} from 'hono/utils/jwt'
import {deleteCookie, getCookie, setCookie} from 'hono/cookie'
import { sessisonManager } from '../utils/sessionManager'
import type { UserProfile } from '../middleware/auth'

// const JWT_OPTIONS = {
//   expiresIn: config.jwt.accessExpirationMinutes,
//   httpOnly: true,
//   secure: config.env === 'production',
//   sameSite: 'Lax' as const,
//   path: '/',
// }

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export const authRoutes = new Hono()
  .post('/register', zValidator('form', createUserSchema), async (c) => {
    const {name, email, password, role} = await c.req.valid('form')

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (user.length) {
      return c.json({message: 'User already exists'}, 400)
    }

    const hashedPassword = await hashPassword(password)

    const result = await db
      .insert(users)
      .values({name, email, password: hashedPassword, role})
      .returning()

    return c.json(
      {
        message: 'User created successfully',
        data: result[0],
      },
      201
    )
  })
  .post(
    '/login',
    zValidator(
      'form',
      createUserSchema.pick({email: true, password: true}),
      (result, c) => {
        if (!result.success) {
          c.json({message: 'Invalid email or password'}, 400)
        }
      }
    ),
    async (c) => {
      const {email, password} = await c.req.valid('form')
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
      if (!user.length) {
        return c.json({message: 'User not found please signup'}, 400)
      }

      const isValid = await verifyPassword(password, user[0].password)
      if (!isValid) {
        return c.json({message: 'Invalid email or password'}, 400)
      }

      const session = sessisonManager(c)

      const token = await Jwt.sign(
        {id: user[0].id, email: user[0].email, role: user[0].role},
        config.jwt.secret
      )

      await session.setSessionItem('token', token)

      return c.json({message: 'Login successful'}, 200)
    }
  )
  .post('/logout', async (c) => {
    const session = sessisonManager(c)
    await session.destroySession()
    return c.json({message: 'Logout successful'}, 200)
  })
  .get('/me', async (c) => {
    const session = sessisonManager(c)
    const isAuthenticated = await session.getSessionItem('token')
    if (!isAuthenticated) {
      return c.json({message: 'Unauthorized'}, 401)
    }
    const token = await session.getSessionItem('token')
    const user = await Jwt.verify(token!, config.jwt.secret) as UserProfile

    return c.json({user}, 200)
  })
