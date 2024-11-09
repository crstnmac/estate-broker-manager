import {relations, type InferSelectModel} from 'drizzle-orm'
import {
  boolean,
  decimal,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['admin', 'agent', 'assistant'])
export const propertyTypeEnum = pgEnum('property_type', [
  'single_family',
  'multi_family',
  'condo',
  'townhouse',
  'land',
  'commercial',
])
export const propertyStatusEnum = pgEnum('property_status', [
  'active',
  'pending',
  'sold',
  'off_market',
  'draft',
])
export const leadStatusEnum = pgEnum('lead_status', [
  'new',
  'contacted',
  'qualified',
  'lost',
  'converted',
])
export const taskPriorityEnum = pgEnum('task_priority', [
  'low',
  'medium',
  'high',
])
export const taskStatusEnum = pgEnum('task_status', [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
])
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'canceled',
  'past_due',
  'trialing',
  'paused',
])
export const lifeCycleStageEnum = pgEnum('life_cycle_stage', [
  'lead',
  'prospect',
  'customer',
  'opportunity',
  'other',
])
export const leadSourceEnum = pgEnum('lead_source', [
  'website',
  'email',
  'phone',
  'chat',
  'social_media',
  'other',
])
export const appointmentStatusEnum = pgEnum('appointment_status', [
  'scheduled',
  'completed',
  'cancelled',
  'no_show',
])
export const transactionTypeEnum = pgEnum('transaction_type', [
  'purchase',
  'sale',
  'rental_lease',
  'property_management',
  'consultation',
])
export const documentTypeEnum = pgEnum('document_type', [
  'contract',
  'listing_agreement',
  'property_photos',
  'inspection_report',
  'financial_statement',
])
export const notificationTypeEnum = pgEnum('notification_type', [
  'info',
  'warning',
  'error',
  'success',
])

export const userTable = pgTable('user', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar('username', {length: 100}).notNull(),
  name: varchar('name', {length: 255}).notNull(),
  email: varchar('email', {length: 255}).notNull(),
  password: varchar('password', {length: 255}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  role: userRoleEnum('role').notNull().default('agent'),
  phone: varchar('phone', {length: 20}),
  avatar: text('avatar')
    .notNull()
    .default('https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Leo'),
  lastLoginAt: timestamp('last_login_at'),
  isActive: boolean('is_active').default(true),
  verifiedAt: timestamp('verified_at'),
  metadata: json('metadata').$type<{
    theme: 'light' | 'dark'
    notifications: boolean
    timezone: string
  }>(),
})

export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
})

export const propertyTable = pgTable(
  'property',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar('title', {length: 255}).notNull(),
    description: text('description').notNull(),
    type: propertyTypeEnum('type').notNull(),
    status: propertyStatusEnum('status').notNull().default('active'),
    price: decimal('price', {precision: 12, scale: 2}).notNull(),
    address: text('address').notNull(),
    city: varchar('city', {length: 100}).notNull(),
    state: varchar('state', {length: 50}).notNull(),
    zipCode: varchar('zip_code', {length: 20}).notNull(),
    bedrooms: integer('bedrooms'),
    bathrooms: decimal('bathrooms', {precision: 4, scale: 1}),
    squareFeet: integer('square_feet'),
    lotSize: decimal('lot_size', {precision: 10, scale: 2}),
    yearBuilt: integer('year_built'),
    features: json('features').$type<string[]>(),
    images: json('images').$type<string[]>(),
    listingAgentId: integer('listing_agent_id').references(() => userTable.id),
    virtualTourUrl: text('virtual_tour_url'),
    coordinates: json('coordinates').$type<{
      latitude: number
      longitude: number
    }>(),
    viewCount: integer('view_count').default(0),
    lastViewedAt: timestamp('last_viewed_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    propertyStatusIndex: index('property_status_index').on(table.status),
    propertyTypePriceIndex: index('property_type_price_index').on(table.price),
    propertyLocationIndex: index('property_location_index').on(
      table.city,
      table.state
    ),
  })
)

export const clientTable = pgTable('client', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar('first_name', {length: 100}).notNull(),
  lastName: varchar('last_name', {length: 100}).notNull(),
  email: varchar('email', {length: 255}),
  phone: varchar('phone', {length: 20}),
  address: text('address'),
  notes: text('notes'),
  tags: json('tags').$type<string[]>(),
  nextFollowUpDate: timestamp('next_follow_up_date'),
  lifcycleStage: lifeCycleStageEnum('lifecycle_stage')
    .notNull()
    .default('customer'),
  assignedAgentId: integer('assigned_agent_id').references(() => userTable.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const leadTable = pgTable(
  'lead',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    firstName: varchar('first_name', {length: 100}).notNull(),
    lastName: varchar('last_name', {length: 100}).notNull(),
    email: varchar('email', {length: 255}),
    phone: varchar('phone', {length: 20}),
    source: varchar('source', {length: 100}),
    status: leadStatusEnum('status').notNull().default('new'),
    notes: text('notes'),
    assignedAgentId: integer('assigned_agent_id').references(
      () => userTable.id
    ),
    tags: json('tags').$type<string[]>(),
    nextFollowUpDate: timestamp('next_follow_up_date'),
    leadSource: text('lead_source'),
    liefcycleStage: lifeCycleStageEnum('lifecycle_stage')
      .notNull()
      .default('lead'),
    lastContactedAt: timestamp('last_contacted_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
      leadStatusIndex: index('lead_status_index').on(table.status),
      leadAgentIndex: index('lead_agent_index').on(table.assignedAgentId),
  })
)

export const taskTable = pgTable('task', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar('title', {length: 255}).notNull(),
  description: text('description'),
  status: taskStatusEnum('status').notNull().default('pending'),
  priority: taskPriorityEnum('priority').notNull().default('medium'),
  dueDate: timestamp('due_date'),
  assignedToId: integer('assigned_to_id').references(() => userTable.id),
  propertyId: integer('property_id').references(() => propertyTable.id),
  clientId: integer('client_id').references(() => clientTable.id),
  leadId: integer('lead_id').references(() => leadTable.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export const appointmentTable = pgTable(
  'appointment',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar('title', {length: 255}).notNull(),
    description: text('description'),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time').notNull(),
    location: text('location'),
    propertyId: integer('property_id').references(() => propertyTable.id),
    clientId: integer('client_id').references(() => clientTable.id),
    status: appointmentStatusEnum('status').notNull().default('scheduled'),
    reminderSent: boolean('reminder_sent').default(false),
    agentId: integer('agent_id').references(() => userTable.id),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
      appointmentDateIndex: index('appointment_date_index').on(table.startTime),
      appointmentAgentIndex: index('appointment_agent_index').on(table.agentId),
  })
)

export const documentTable = pgTable('document', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', {length: 255}).notNull(),
  type: varchar('type', {length: 50}).notNull(),
  url: text('url').notNull(),
  propertyId: integer('property_id').references(() => propertyTable.id),
  clientId: integer('client_id').references(() => clientTable.id),
  uploadedById: integer('uploaded_by_id').references(() => userTable.id),
  createdAt: timestamp('created_at').defaultNow(),
  expiryDate: timestamp('expiry_date'),
  documentType: documentTypeEnum('document_type').notNull(),
})

export const transactionTable = pgTable('transaction', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  propertyId: integer('property_id')
    .references(() => propertyTable.id)
    .notNull(),
  clientId: integer('client_id')
    .references(() => clientTable.id)
    .notNull(),
  agentId: integer('agent_id')
    .references(() => userTable.id)
    .notNull(),
  type: transactionTypeEnum('type').notNull().default('sale'),
  amount: decimal('amount', {precision: 12, scale: 2}).notNull(),
  status: varchar('status', {length: 50}).notNull(),
  closingDate: timestamp('closing_date'),
  commission: decimal('commission', {precision: 12, scale: 2}),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const messageTable = pgTable('message', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  senderId: integer('sender_id')
    .references(() => userTable.id)
    .notNull(),
  receiverId: integer('receiver_id')
    .references(() => userTable.id)
    .notNull(),
  content: text('content').notNull(),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

export const subscriptionPlanTable = pgTable('subscription_plan', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', {precision: 10, scale: 2}).notNull(),
  interval: text('interval').notNull(), // monthly, yearly
  features: text('features').array(),
  maxListings: integer('max_listings').notNull(),
  maxUsers: integer('max_users').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const subscriptionTable = pgTable('subscription', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .references(() => userTable.id)
    .notNull(),
  planId: integer('plan_id')
    .references(() => subscriptionPlanTable.id)
    .notNull(),
  status: subscriptionStatusEnum('status').notNull().default('active'),
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const invoices = pgTable('invoices', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .references(() => userTable.id)
    .notNull(),
  subscriptionId: integer('subscription_id')
    .references(() => subscriptionTable.id)
    .notNull(),
  amount: decimal('amount', {precision: 10, scale: 2}).notNull(),
  status: text('status').notNull(), // paid, unpaid, void
  paidAt: timestamp('paid_at'),
  invoiceUrl: text('invoice_url'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const amenityTable = pgTable('amenity', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Relations
export const userRelations = relations(userTable, ({many}) => ({
  properties: many(propertyTable),
  clients: many(clientTable),
  leads: many(leadTable),
  tasks: many(taskTable),
  appointments: many(appointmentTable),
  documents: many(documentTable),
  transactions: many(transactionTable),
  sentMessages: many(messageTable, {relationName: 'sentMessages'}),
  receivedMessages: many(messageTable, {relationName: 'receivedMessages'}),
}))

export const propertyRelations = relations(propertyTable, ({one, many}) => ({
  listingAgent: one(userTable, {
    fields: [propertyTable.listingAgentId],
    references: [userTable.id],
  }),
  appointments: many(appointmentTable),
  documents: many(documentTable),
  tasks: many(taskTable),
  transactions: many(transactionTable),
}))

export const clientRelations = relations(clientTable, ({one, many}) => ({
  assignedAgent: one(userTable, {
    fields: [clientTable.assignedAgentId],
    references: [userTable.id],
  }),
  appointments: many(appointmentTable),
  documents: many(documentTable),
  tasks: many(taskTable),
  transactions: many(transactionTable),
}))

export const leadRelations = relations(leadTable, ({one, many}) => ({
  assignedAgent: one(userTable, {
    fields: [leadTable.assignedAgentId],
    references: [userTable.id],
  }),
  tasks: many(taskTable),
}))

export const taskRelations = relations(taskTable, ({one, many}) => ({
  assignedTo: one(userTable, {
    fields: [taskTable.assignedToId],
    references: [userTable.id],
  }),
  property: one(propertyTable, {
    fields: [taskTable.propertyId],
    references: [propertyTable.id],
  }),
  client: one(clientTable, {
    fields: [taskTable.clientId],
    references: [clientTable.id],
  }),
  lead: one(leadTable, {
    fields: [taskTable.leadId],
    references: [leadTable.id],
  }),
}))

export const appointmentRelations = relations(
  appointmentTable,
  ({one, many}) => ({
    property: one(propertyTable, {
      fields: [appointmentTable.propertyId],
      references: [propertyTable.id],
    }),
    client: one(clientTable, {
      fields: [appointmentTable.clientId],
      references: [clientTable.id],
    }),
    agent: one(userTable, {
      fields: [appointmentTable.agentId],
      references: [userTable.id],
    }),
  })
)

export const documentRelations = relations(documentTable, ({one, many}) => ({
  property: one(propertyTable, {
    fields: [documentTable.propertyId],
    references: [propertyTable.id],
  }),
  client: one(clientTable, {
    fields: [documentTable.clientId],
    references: [clientTable.id],
  }),
  uploadedBy: one(userTable, {
    fields: [documentTable.uploadedById],
    references: [userTable.id],
  }),
}))

export const transactionRelations = relations(
  transactionTable,
  ({one, many}) => ({
    property: one(propertyTable, {
      fields: [transactionTable.propertyId],
      references: [propertyTable.id],
    }),
    client: one(clientTable, {
      fields: [transactionTable.clientId],
      references: [clientTable.id],
    }),
    agent: one(userTable, {
      fields: [transactionTable.agentId],
      references: [userTable.id],
    }),
  })
)

export const messageRelations = relations(messageTable, ({one}) => ({
  sender: one(userTable, {
    fields: [messageTable.senderId],
    references: [userTable.id],
  }),
  receiver: one(userTable, {
    fields: [messageTable.receiverId],
    references: [userTable.id],
  }),
}))

export const notificationTable = pgTable('notification', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => userTable.id),
  type: notificationTypeEnum('type'),
  content: text('content'),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

export const activityLogTable = pgTable('activity_log', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => userTable.id),
  entityType: text('entity_type'), // 'property', 'lead', etc.
  entityId: integer('entity_id'),
  action: text('action'), // 'created', 'updated', etc.
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Export types

export type Property = InferSelectModel<typeof propertyTable>
export type Client = InferSelectModel<typeof clientTable>
export type Lead = InferSelectModel<typeof leadTable>
export type Task = InferSelectModel<typeof taskTable>
export type Appointment = InferSelectModel<typeof appointmentTable>
export type Document = InferSelectModel<typeof documentTable>
export type Transaction = InferSelectModel<typeof transactionTable>
export type Message = InferSelectModel<typeof messageTable>
export type User = InferSelectModel<typeof userTable>
export type Session = InferSelectModel<typeof sessionTable>
export type Subscription = InferSelectModel<typeof subscriptionTable>
export type SubscriptionPlan = InferSelectModel<typeof subscriptionPlanTable>
export type Invoice = InferSelectModel<typeof invoices>
export type Notification = InferSelectModel<typeof notificationTable>
export type ActivityLog = InferSelectModel<typeof activityLogTable>
export type Amenity = InferSelectModel<typeof amenityTable>