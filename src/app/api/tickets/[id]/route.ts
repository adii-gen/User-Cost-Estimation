// import { db } from '@/db';
// import { Tickets } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs';
import { Tickets } from '@/drizzle/schema';
import { db } from '@/lib/db';
import { auth } from '@/auth';
import { useSession } from 'next-auth/react';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
//   const { userId } = auth();
const session=await auth();
     const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const ticket = await db.query.Tickets.findFirst({
      where: and(
        eq(Tickets.id, params.id),
        eq(Tickets.userId, userId)
      ),
      with: {
        messages: true
      }
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}