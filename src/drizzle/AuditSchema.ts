import { relations, sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  foreignKey,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { UserTable } from "./schema";

export const AuditableEventTable = pgTable(
  "auditable_events",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    priority: integer("priority").notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", {
      precision: 3,
      mode: "date",
    }).notNull(),
  },
  (table) => {
    return {
      nameKey: uniqueIndex("auditable_events_name_key").using(
        "btree",
        table.name.asc().nullsLast()
      ),
    };
  }
);

export const AuditableEventTableRelations = relations(
  AuditableEventTable,
  ({ many }) => ({
    auditTrails: many(AuditTrailTable),
  })
);

export const AuditTrailTable = pgTable(
  "audit_trails",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    details: jsonb("details").notNull(),
    eventId: uuid("event_id").notNull(),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      eventIdIdx: index("audit_trails_event_id_idx").using(
        "btree",
        table.eventId.asc().nullsLast()
      ),
      userIdIdx: index("audit_trails_user_id_idx").using(
        "btree",
        table.userId.asc().nullsLast()
      ),
      auditTrailEventIdFkey: foreignKey({
        columns: [table.eventId],
        foreignColumns: [AuditableEventTable.id],
        name: "audit_trails_event_id_fkey",
      })
        .onUpdate("cascade")
        .onDelete("restrict"),
      auditTrailUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [UserTable.id],
        name: "audit_trails_user_id_fkey",
      })
        .onUpdate("cascade")
        .onDelete("restrict"),
    };
  }
);

export const AuditTrailTableRelations = relations(
  AuditTrailTable,
  ({ one }) => ({
    auditableEvent: one(AuditableEventTable, {
      fields: [AuditTrailTable.eventId],
      references: [AuditableEventTable.id],
    }),
    user: one(UserTable, {
      fields: [AuditTrailTable.userId],
      references: [UserTable.id],
    }),
  })
);
