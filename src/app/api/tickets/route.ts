// // import { db } from '@/db';
// // import { Tickets, TicketMessages } from '@/db/schema';
// import { eq, and, desc } from 'drizzle-orm';
// import { NextResponse } from 'next/server';
// // import { auth } from '@clerk/nextjs';
// import { db } from '@/lib/db';
// import { Tickets ,TicketMessages} from '@/drizzle/schema';
// import { useSession } from 'next-auth/react';

// export async function GET(request: Request) {
//   const data=useSession()
//       const userId = data.data?.user.id

//   if (!userId) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const tickets = await db.query.Tickets.findMany({
//       where: eq(Tickets.userId, userId),
//       with: {
//         messages: {
//           orderBy: (messages, { desc }) => [desc(messages.createdAt)],
//           limit: 1
//         }
//       },
//       orderBy: (tickets, { desc }) => [desc(tickets.createdAt)]
//     });

//     return NextResponse.json({ tickets });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to fetch tickets' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   const data=useSession()
//     const userId = data.data?.user.id
//   const { subject, description, category, priority } = await request.json();

//   if (!userId) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   if (!subject || !description) {
//     return NextResponse.json(
//       { error: 'Subject and description are required' },
//       { status: 400 }
//     );
//   }

//   try {
//     // Generate ticket number (simple timestamp-based for demo)
//     const ticketNumber = `T-${Date.now()}`;

//     const [newTicket] = await db.insert(Tickets).values({
//       userId,
//       ticketNumber,
//       subject,
//       description,
//       category: category || 'general',
//       priority: priority || 'medium',
//       status: 'open'
//     }).returning();

//     // Add initial message
//     await db.insert(TicketMessages).values({
//       ticketId: newTicket.id,
//       senderId: userId,
//       direction: 'user_to_admin',
//       message: description
//     });

//     return NextResponse.json({ ticket: newTicket }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to create ticket' },
//       { status: 500 }
//     );
//   }
// }
import { db } from '@/lib/db';
import { Tickets, TicketMessages } from '@/drizzle/schema';
import { eq, desc, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tickets = await db.query.Tickets.findMany({
      where: eq(Tickets.userId, userId),
      with: {
        messages: {
          orderBy: (messages, { desc }) => [desc(messages.createdAt)],
          limit: 1,
        },
      },
      orderBy: (tickets, { desc }) => [desc(tickets.createdAt)],
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, category, priority ,attachments} = await request.json();
const subject=title;
  if (!subject || !description) {
    return NextResponse.json(
      { error: 'Subject and description are required' },
      { status: 400 }
    );
  }

  try {
    const ticketNumber = `T-${Date.now()}`;

    const [newTicket] = await db
      .insert(Tickets)
      .values({
        userId,
        ticketNumber,
        subject,
        description,
        attachment: attachments,
        category: category || 'general',
        priority: priority || 'medium',
        status: 'open',
      })
      .returning();

    await db.insert(TicketMessages).values({
      ticketId: newTicket.id,
      senderId: userId,
      direction: 'user_to_admin',
      message: description,
    });

    return NextResponse.json({ ticket: newTicket }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const ticketId = searchParams.get('ticketId');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!ticketId) {
    return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { 
      subject, 
      description, 
      category, 
      priority, 
      status, 
      assignedTo,
      resolutionNotes,
      message // Optional message to add when updating
    } = body;

    // Build update object with only provided fields
    const updateData: any = {};
    if (subject !== undefined) updateData.subject = subject;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) {
      updateData.status = status;
      // If status is being set to resolved/closed, set resolvedAt timestamp
      if (status === 'resolved' || status === 'closed') {
        updateData.resolvedAt = new Date();
      }
    }
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (resolutionNotes !== undefined) updateData.resolutionNotes = resolutionNotes;

    // Always update the updatedAt timestamp
    updateData.updatedAt = new Date();

    if (Object.keys(updateData).length === 1) { // Only updatedAt
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Update ticket (ensure user owns the ticket)
    const [updatedTicket] = await db
      .update(Tickets)
      .set(updateData)
      .where(and(
        eq(Tickets.id, ticketId),
        eq(Tickets.userId, userId)
      ))
      .returning();

    if (!updatedTicket) {
      return NextResponse.json(
        { error: 'Ticket not found or unauthorized' },
        { status: 404 }
      );
    }

    // If a message was provided, add it to the ticket
    if (message && message.trim()) {
      await db.insert(TicketMessages).values({
        ticketId: updatedTicket.id,
        senderId: userId,
        direction: 'user_to_admin',
        message: message.trim(),
        isRead: false,
      });
    }

    // Fetch the updated ticket with its latest message
    const ticketWithMessages = await db.query.Tickets.findFirst({
      where: eq(Tickets.id, updatedTicket.id),
      with: {
        messages: {
          orderBy: (messages, { desc }) => [desc(messages.createdAt)],
          limit: 1,
        },
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          }
        },
        assignedAdmin: {
          columns: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
    });

    return NextResponse.json({ ticket: ticketWithMessages });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}