import { Tickets, TicketMessages, UserTable } from '@/drizzle/schema';

// Base types from schema
export type User = typeof UserTable.$inferSelect;
export type Ticket = typeof Tickets.$inferSelect;
export type Message = typeof TicketMessages.$inferSelect;

// Extended types with relations
export type UserWithRelations = User & {
  createdTickets?: Ticket[];
  assignedTickets?: Ticket[];
  sentMessages?: Message[];
};

export type TicketWithRelations = Ticket & {
  user?: User;
  assignedAdmin?: User;
  messages?: Message[];
};

export type MessageWithRelations = Message & {
  sender?: User;
  ticket?: Ticket;
};