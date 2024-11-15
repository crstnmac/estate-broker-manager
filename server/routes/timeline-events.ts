import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '@/db'
import { timelineEventTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { isLoggedIn } from '@/middleware/isLoggedIn'

const timelineEventSchema = z.object({
  leadId: z.number().int().positive(),
  type: z.enum(['status_change', 'note_added', 'contact', 'meeting_scheduled', 'document_added']),
  description: z.string(),
  metadata: z.record(z.unknown()).optional(),
})

export const timelineRouter = new Hono()
  .use('*', isLoggedIn)
  .get('/:leadId', async (c) => {
    const leadId = Number(c.req.param('leadId'))
    
    const events = await db
      .select()
      .from(timelineEventTable)
      .where(eq(timelineEventTable.leadId, leadId))
      .orderBy(timelineEventTable.createdAt)

    return c.json(events)
  })
  .post('/', async (c) => {
    const user = c.get('user')
    const body = await c.req.json()
    const event = timelineEventSchema.parse(body)

    const result = await db.insert(timelineEventTable).values({
      ...event,
      createdById: user?.id!,
    })

    return c.json(result)
  })
