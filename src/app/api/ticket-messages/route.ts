// app/api/ticket-messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Your database instance

import { eq } from 'drizzle-orm';
import { TicketMessages } from '@/drizzle/schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketId, senderId, direction, message, attachments, isRead } = body;

    // Validate required fields
    if (!ticketId || !senderId || !direction || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate direction enum
    if (!['user_to_admin', 'admin_to_user'].includes(direction)) {
      return NextResponse.json(
        { success: false, error: 'Invalid message direction' },
        { status: 400 }
      );
    }

    // Insert new message
    const [newMessage] = await db.insert(TicketMessages).values({
      ticketId,
      senderId,
      direction,
      message,
      attachments: attachments || null,
      isRead: isRead || false,
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Message created successfully',
      data: newMessage
    });

  } catch (error) {
    console.error('Error creating ticket message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json(
        { success: false, error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    // Get all messages for a ticket
    const messages = await db.select()
      .from(TicketMessages)
      .where(eq(TicketMessages.ticketId, ticketId))
      .orderBy(TicketMessages.createdAt);

    return NextResponse.json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error('Error fetching ticket messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}