import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  index,
  integer,
  json,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  serial,
} from "drizzle-orm/pg-core";

// =====================
// Enums
// =====================

export const UserRole = pgEnum("user_role", [
  "USER",
  "platform_admin"
]);

export const TicketStatusEnum = pgEnum('ticket_status', ['open', 'pending', 'resolved', 'closed']);
export const MessageDirectionEnum = pgEnum('message_direction', ['user_to_admin', 'admin_to_user']);

// =====================
// Ticket Tables
// =====================
export const EmailVerificationTokenTable = pgTable(
  "email_verification_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    email: text("email").notNull(),
    token: uuid("token").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  },
  (table) => ({
    emailTokenKey: uniqueIndex("email_verification_tokens_email_token_key").on(
      table.email,
      table.token
    ),
    tokenKey: uniqueIndex("email_verification_tokens_token_key").on(
      table.token
    ),
  })
);

export const PasswordResetTokenTable = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    email: text("email").notNull(),
    token: uuid("token").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  },
  (table) => ({
    emailTokenKey: uniqueIndex("password_reset_tokens_email_token_key").on(
      table.email,
      table.token
    ),
    tokenKey: uniqueIndex("password_reset_tokens_token_key").on(table.token),
  })
);

export const UserTable = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    emailVerifToken: varchar("email_verif_token", { length: 255 }),
    password: varchar("password", { length: 255 }).notNull(),
    mobile: text("mobile"),
    role: UserRole("role").default("USER").notNull(),
    profilePic: text("profile_pic"),
    
    // Additional fields from new schema
    phone: varchar('phone', { length: 15 }).unique(),
    userType: UserRole('user_type'),
    firstName: varchar('first_name', { length: 100 }),
    lastName: varchar('last_name', { length: 100 }),
    isActive: boolean('is_active').default(true),
    isVerified: boolean('is_verified').default(false),
    emailVerifiedAt: timestamp('email_verified_at'),
    phoneVerifiedAt: timestamp('phone_verified_at'),
    lastLoginAt: timestamp('last_login_at'),
    twoFactorEnabled: boolean('two_factor_enabled').default(false),
    twoFactorSecret: varchar('two_factor_secret', { length: 32 }),
    
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailKey: uniqueIndex("users_email_key").on(table.email),
    nameEmailIdx: index("users_name_email_idx").on(table.name, table.email),
  })
);

export const Tickets = pgTable('support_tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => UserTable.id),
  ticketNumber: varchar('ticket_number', { length: 20 }).unique().notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  description: text('description').notNull(),
  attachment: text('image').array(),
  category: varchar('category', { length: 100 }),
  priority: varchar('priority', { length: 20 }).default('medium'),
  status: TicketStatusEnum('status').default('open'),
  assignedTo: uuid('assigned_to').references(() => UserTable.id),
  resolutionNotes: text('resolution_notes'),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdx: index('ticket_user_idx').on(table.userId),
  assignedToIdx: index('ticket_assigned_to_idx').on(table.assignedTo),
  statusIdx: index('ticket_status_idx').on(table.status),
}));

export const TicketMessages = pgTable('ticket_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  ticketId: uuid('ticket_id').notNull().references(() => Tickets.id),
  senderId: uuid('sender_id').notNull().references(() => UserTable.id),
  direction: MessageDirectionEnum('direction').notNull(), // Who sent the message
  message: text('message').notNull(),
  attachments: jsonb('attachments'), // Array of attachment URLs
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  ticketIdx: index('message_ticket_idx').on(table.ticketId),
  senderIdx: index('message_sender_idx').on(table.senderId),
}));

// =====================
// Relations
// =====================

export const TicketRelations = relations(Tickets, ({ one, many }) => ({
  user: one(UserTable, {
    fields: [Tickets.userId],
    references: [UserTable.id],
  }),
  assignedAdmin: one(UserTable, {
    fields: [Tickets.assignedTo],
    references: [UserTable.id],
    relationName: 'assigned_admin'
  }),
  messages: many(TicketMessages),
}));

export const TicketMessageRelations = relations(TicketMessages, ({ one }) => ({
  ticket: one(Tickets, {
    fields: [TicketMessages.ticketId],
    references: [Tickets.id],
  }),
  sender: one(UserTable, {
    fields: [TicketMessages.senderId],
    references: [UserTable.id],
  }),
}));

export const UserRelations = relations(UserTable, ({ many }) => ({
  createdTickets: many(Tickets, { relationName: 'user_tickets' }),
  assignedTickets: many(Tickets, { relationName: 'assigned_admin' }),
  sentMessages: many(TicketMessages),
}));