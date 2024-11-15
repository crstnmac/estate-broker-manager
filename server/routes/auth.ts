import {Hono} from 'hono'
import {zValidator} from '@hono/zod-validator'
import {eq} from 'drizzle-orm'
import {
  createSession,
  generateSessionToken,
  invalidateSession,
} from '@/utils/authUtils'
import {userTable} from '@/db/schema'
import {db} from '@/db'
import {loginSchema, registerSchema, type SuccessResponse} from '@/shared/types'
import {deleteCookie, setCookie} from 'hono/cookie'
import postgres from 'postgres'
import {HTTPException} from 'hono/http-exception'
import type {Context} from '@/context'
import {isLoggedIn} from '@/middleware/isLoggedIn'
import {config} from '@/config'

export const authRouter = new Hono<Context>()
  .post('/signup', zValidator('form', registerSchema), async (c) => {
    const {name, email, password} = c.req.valid('form')

    const passwordHash = await Bun.password.hash(password) // Use Bun for hashing

    try {
      const res = await db
        .insert(userTable)
        .values({
          name,
          email,
          password: passwordHash,
        })
        .returning()

      const token = generateSessionToken()

      const session = await createSession(token, res[0].id)

      setCookie(c, 'session', token, {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'Lax',
        expires: session.expiresAt,
        path: '/',
      })

      c.set('user', res[0])
      c.set('session', session)

      return c.json<SuccessResponse>(
        {
          message: 'User created',
          success: true,
        },
        201
      )
    } catch (error) {
      if (error instanceof postgres.PostgresError && error.code === '23505') {
        throw new HTTPException(409, {
          message: 'User already exists',
        })
      }
      console.log(error)
      throw new HTTPException(500, {
        message: 'Failed to create User',
      })
    }
  })
  .post(
    '/login',
    zValidator('form', loginSchema, (result, c) => {
      if (!result.success) {
        c.json({message: 'Invalid email or password'}, 400)
      }
    }),
    async (c) => {
      const {email, password} = await c.req.valid('form')

      const [existingUser] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email))
        .limit(1)

      if (!existingUser) {
        throw new HTTPException(401, {
          message: 'Incorrect email or password',
        })
      }

      const validPassword = await Bun.password.verify(
        password,
        existingUser.password
      )

      if (!validPassword) {
        throw new HTTPException(401, {
          message: 'Incorrect password',
        })
      }

      const token = generateSessionToken()

      const session = await createSession(token, existingUser.id)

      console.log('session', session)
      console.log('token', token)

      setCookie(c, 'session', token, {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'Lax',
        expires: session.expiresAt,
        path: '/',
      })

      c.set('user', existingUser)
      c.set('session', session)

      return c.json<SuccessResponse>(
        {
          message: 'Logged In',
          success: true,
        },
        200
      )
    }
  )
  .get('/logout', async (c) => {
    const session = c.get('session')
    if (!session) {
      return c.redirect('/')
    }

    invalidateSession(session.id)
    deleteCookie(c, 'session')

    return c.redirect('/')
  })
  .get('/user', isLoggedIn, async (c) => {
    const user = c.get('user')!
    return c.json<
      SuccessResponse<{
        email: string
        name: string
        avatar: string
        phone: string
      }>
    >({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone ?? '',
      },
      message: 'User found',
    })
  })
