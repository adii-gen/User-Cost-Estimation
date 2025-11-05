// // import { db } from '@/lib/db';
// // import { Tickets, TicketMessages } from '@/drizzle/schema';
// // import { eq, and } from 'drizzle-orm';
// // import { NextResponse } from 'next/server';


// // export async function PUT(request: Request) {
// //   const { searchParams } = new URL(request.url);
// //   const userId = searchParams.get('userId');
// //   const ticketId = searchParams.get('ticketId');

// //   if (!userId ) {
// //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// //   }

// //   if (!ticketId ) {
// //     return NextResponse.json({ error: 'Valid ticket ID is required' }, { status: 400 });
// //   }

// //   try {
// //     const body = await request.json();
// //     const { status, message } = body; // Assuming you're just updating status

// //     // Get ticket with relationships
// //     const ticket = await db.query.Tickets.findFirst({
// //       where: eq(Tickets.id, ticketId),
// //       with: {
// //         user: { columns: { id: true } },
// //         assignedAdmin: { columns: { id: true } }
// //       }
// //     });

// //     if (!ticket) {
// //       return NextResponse.json(
// //         { error: 'Ticket not found' },
// //         { status: 404 }
// //       );
// //     }

// //     // Check permissions
// //     const isOwner = ticket.user.id === userId;
// //     const isAssignedAdmin = ticket.assignedAdmin?.id === userId;
// //     const isAdmin = true;

// //     if (!isOwner && !isAssignedAdmin  && !isAdmin ) {
// //       return NextResponse.json(
// //         { error: 'Unauthorized - You do not have permission to update this ticket' },
// //         { status: 403 }
// //       );
// //     }

// //     // Build update data
// //     const updateData: any = { 
// //       updatedAt: new Date(),
// //       status // assuming status is being updated
// //     };

// //     if (status === 'resolved' || status === 'closed') {
// //       updateData.resolvedAt = new Date();
// //     }

// //     // Perform update
// //     const [updatedTicket] = await db
// //       .update(Tickets)
// //       .set(updateData)
// //       .where(eq(Tickets.id, ticketId))
// //       .returning();

// //     // Add message if provided
// //     if (message && message.trim()) {
// //       await db.insert(TicketMessages).values({
// //         ticketId,
// //         senderId: userId,
// //         direction: isOwner ? 'user_to_admin' : 'admin_to_user',
// //         message: message.trim(),
// //         isRead: false,
// //       });
// //     }

// //     return NextResponse.json({ success: true, ticket: updatedTicket });

// //   } catch (error) {
// //     console.error('Error updating ticket status:', error);
// //     return NextResponse.json(
// //       { error: 'Failed to update ticket status' },
// //       { status: 500 }
// //     );
// //   }
// // }
// import { db } from '@/lib/db';
// import { Tickets, TicketMessages } from '@/drizzle/schema';
// import { eq, and } from 'drizzle-orm';
// import { NextResponse } from 'next/server';

// export async function PUT(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const userId = searchParams.get('userId');
//   const ticketId = searchParams.get('ticketId');

//   if (!userId) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   if (!ticketId) {
//     return NextResponse.json({ error: 'Valid ticket ID is required' }, { status: 400 });
//   }

//   try {
//     const body = await request.json();
//     const { status, message, priority } = body; // Now accepting priority as well

//     // Get ticket with relationships
//     const ticket = await db.query.Tickets.findFirst({
//       where: eq(Tickets.id, ticketId),
//       with: {
//         user: { columns: { id: true } },
//         assignedAdmin: { columns: { id: true } }
//       }
//     });

//     if (!ticket) {
//       return NextResponse.json(
//         { error: 'Ticket not found' },
//         { status: 404 }
//       );
//     }

//     // Check permissions - admin can update
//     const isOwner = ticket.user.id === userId;
//     const isAssignedAdmin = ticket.assignedAdmin?.id === userId;
//     const isAdmin = true; // You might want to check actual admin role here

//     if (!isOwner && !isAssignedAdmin && !isAdmin) {
//       return NextResponse.json(
//         { error: 'Unauthorized - You do not have permission to update this ticket' },
//         { status: 403 }
//       );
//     }

//     // Build update data
//     const updateData: any = { 
//       updatedAt: new Date()
//     };

//     // Add status if provided
//     if (status) {
//       updateData.status = status;
//       if (status === 'resolved' || status === 'closed') {
//         updateData.resolvedAt = new Date();
//       }
//     }

//     // Add priority if provided
//     if (priority) {
//       updateData.priority = priority;
//     }

//     // Perform update if there's anything to update
//     let updatedTicket = ticket;
//     if (Object.keys(updateData).length > 1) { // More than just updatedAt
//       [updatedTicket] = await db
//         .update(Tickets)
//         .set(updateData)
//         .where(eq(Tickets.id, ticketId))
//         .returning();
//     }

//     // Add message if provided
//     if (message && message.trim()) {
//       await db.insert(TicketMessages).values({
//         ticketId,
//         senderId: userId,
//         direction: isOwner ? 'user_to_admin' : 'admin_to_user',
//         message: message.trim(),
//         isRead: false,
//       });
//     }

//     return NextResponse.json({ 
//       success: true, 
//       ticket: updatedTicket,
//       message: message ? 'Ticket and message updated successfully' : 'Ticket updated successfully'
//     });

//   } catch (error) {
//     console.error('Error updating ticket:', error);
//     return NextResponse.json(
//       { error: 'Failed to update ticket' },
//       { status: 500 }
//     );
//   }
// }
import { db } from '@/lib/db';
import { Tickets, TicketMessages } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const ticketId = searchParams.get('ticketId');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!ticketId) {
    return NextResponse.json({ error: 'Valid ticket ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { status, message, priority } = body; // Now accepting priority as well

    // Get ticket with relationships
    const ticket = await db.query.Tickets.findFirst({
      where: eq(Tickets.id, ticketId),
      with: {
        user: { columns: { id: true } },
        assignedAdmin: { columns: { id: true } }
      }
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Check permissions - admin can update
    const isOwner = ticket.user.id === userId;
    const isAssignedAdmin = ticket.assignedAdmin?.id === userId;
    const isAdmin = true; // You might want to check actual admin role here

    if (!isOwner && !isAssignedAdmin && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - You do not have permission to update this ticket' },
        { status: 403 }
      );
    }

    // Build update data
    const updateData: any = { 
      updatedAt: new Date()
    };

    // Add status if provided
    if (status) {
      updateData.status = status;
      if (status === 'resolved' || status === 'closed') {
        updateData.resolvedAt = new Date();
      }
    }

    // Add priority if provided
    if (priority) {
      updateData.priority = priority;
    }

    // Perform update if there's anything to update
    let updatedTicket = ticket;
    if (Object.keys(updateData).length > 1) { // More than just updatedAt
      await db
        .update(Tickets)
        .set(updateData)
        .where(eq(Tickets.id, ticketId));

      // Fetch the updated ticket with relationships
      const refreshedTicket = await db.query.Tickets.findFirst({
        where: eq(Tickets.id, ticketId),
        with: {
          user: { columns: { id: true } },
          assignedAdmin: { columns: { id: true } }
        }
      });

      if (refreshedTicket) {
        updatedTicket = refreshedTicket;
      }
    }

    // Add message if provided
    if (message && message.trim()) {
      await db.insert(TicketMessages).values({
        ticketId,
        senderId: userId,
        direction: isOwner ? 'user_to_admin' : 'admin_to_user',
        message: message.trim(),
        isRead: false,
      });
    }

    return NextResponse.json({ 
      success: true, 
      ticket: updatedTicket,
      message: message ? 'Ticket and message updated successfully' : 'Ticket updated successfully'
    });

  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}