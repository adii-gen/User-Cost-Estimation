// import { db } from '@/db';
// import { TicketMessages, Tickets } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { TicketMessages, Tickets } from '@/drizzle/schema';
import { auth } from '@/auth';
import { useSession } from 'next-auth/react';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
 
 const session=await auth();
     const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify user owns the ticket
    const ticket = await db.query.Tickets.findFirst({
      where: and(
        eq(Tickets.id, params.id),
        eq(Tickets.userId, userId)
      )
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const messages = await db.query.TicketMessages.findMany({
      where: eq(TicketMessages.ticketId, params.id),
      orderBy: (messages, { asc }) => [asc(messages.createdAt)]
    });

    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
const session=await auth();
     const userId = session?.user?.id;
  const { message } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!message) {
    return NextResponse.json(
      { error: 'Message is required' },
      { status: 400 }
    );
  }

  try {
    // Verify user owns the ticket
    const ticket = await db.query.Tickets.findFirst({
      where: and(
        eq(Tickets.id, params.id),
        eq(Tickets.userId, userId)
      )
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const [newMessage] = await db.insert(TicketMessages).values({
      ticketId: params.id,
      senderId: userId,
      direction: 'user_to_admin',
      message
    }).returning();

    // Update ticket updatedAt
    await db.update(Tickets)
      .set({ updatedAt: new Date() })
      .where(eq(Tickets.id, params.id));

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}