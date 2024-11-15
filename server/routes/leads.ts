import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '@/db'
import { leadTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { isLoggedIn } from '@/middleware/isLoggedIn'
import { zValidator } from '@hono/zod-validator'

const leadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'lost']),
  source: z.string(),
  assignedToId: z.number().int().positive(),
  notes: z.string().optional(),
  lastContact: z.date().optional(),
})

export const leadRouter = new Hono()
  .use('*', isLoggedIn)
  .get('/', async (c) => {
    const user = c.get('user')
    const leads = await db
      .select()
      .from(leadTable)
      .where(
        user?.role === 'admin'
          ? undefined
          : eq(leadTable.assignedToId, user?.id!)
      )
    return c.json(leads)
  })
  .post('/', async (c) => {
    const body = await c.req.json()
    const lead = leadSchema.parse(body)

    const result = await db.insert(leadTable).values({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      source: lead.source,
      assignedToId: lead.assignedToId,
      notes: lead.notes,
      lastContact: lead.lastContact,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return c.json(result)
  })
  .patch('/:id',
    zValidator(
      'json',
      leadSchema.partial(),
      (result, c) => {
        if (!result.success) {
          c.json({message: 'Invalid lead data'}, 400)
        }
      }
    ),
    async (c) => {
    const id = Number(c.req.param('id'))
    const body = await c.req.json()
  
    const result = await db
      .update(leadTable)
      .set({
        ...body,
        updatedAt: new Date()
      })
      .where(eq(leadTable.id, id))
      .returning()

    return c.json(result[0])
  })
  .delete('/:id', async (c) => {
    const id = Number(c.req.param('id'))

    const result = await db
      .delete(leadTable)
      .where(eq(leadTable.id, id))
      .returning()

    return c.json(result[0])
  })
