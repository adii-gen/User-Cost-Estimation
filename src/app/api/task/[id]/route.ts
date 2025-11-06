
// ====================================
// app/api/tasks/[id]/route.ts
// ====================================

import { db } from '@/lib/db';
// import { Tasks, UserTable, Projects } from '@/lib/schema';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { Tasks, Projects, UserTable } from '@/drizzle/schema';

// GET single task
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const task = await db
      .select({
        taskId: Tasks.id,
        taskName: Tasks.taskName,
        description: Tasks.description,
        expectedHours: Tasks.expectedHours,
        actualHours: Tasks.actualHours,
        status: Tasks.status,
        approvedAt: Tasks.approvedAt,
        rejectionReason: Tasks.rejectionReason,
        createdAt: Tasks.createdAt,
        updatedAt: Tasks.updatedAt,
        projectId: Projects.id,
        projectName: Projects.projectName,
        employeeId: UserTable.id,
        employeeName: UserTable.name,
        employeeEmail: UserTable.email,
      })
      .from(Tasks)
      .leftJoin(UserTable, eq(Tasks.employeeId, UserTable.id))
      .leftJoin(Projects, eq(Tasks.projectId, Projects.id))
      .where(eq(Tasks.id, params.id))
      .limit(1);

    if (!task || task.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task: task[0] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PUT - Update task
// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await auth();
//     if (!session?.user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const body = await req.json();
//     const { taskName, description, expectedHours, actualHours } = body;

//     // Check if task exists and belongs to user
//     const [existingTask] = await db
//       .select()
//       .from(Tasks)
//       .where(eq(Tasks.id, params.id))
//       .limit(1);

//     if (!existingTask) {
//       return NextResponse.json({ error: 'Task not found' }, { status: 404 });
//     }

//     // Only employee who created task can edit (if not approved yet)
//     if (
//       existingTask.employeeId !== session.user.id &&
//       session.user.role !== 'platform_admin'
//     ) {
//       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//     }

//     // Cannot edit approved tasks (unless admin)
//     if (
//       existingTask.status !== 'pending' &&
//       session.user.role !== 'platform_admin'
//     ) {
//       return NextResponse.json(
//         { error: 'Cannot edit approved/rejected tasks' },
//         { status: 403 }
//       );
//     }

//     const [task] = await db
//       .update(Tasks)
//       .set({
//         taskName,
//         description,
//         expectedHours: expectedHours?.toString(),
//         actualHours: actualHours?.toString(),
//         updatedAt: new Date(),
//       })
//       .where(eq(Tasks.id, params.id))
//       .returning();

//     return NextResponse.json({ task }, { status: 200 });
//   } catch (error) {
//     console.error('Error updating task:', error);
//     return NextResponse.json(
//       { error: 'Failed to update task' },
//       { status: 500 }
//     );
//   }
// }
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { taskName, description, expectedHours, actualHours } = body;

    // Validate required fields
    if (!taskName?.trim()) {
      return NextResponse.json({ error: 'Task name is required' }, { status: 400 });
    }

    if (actualHours !== undefined && (isNaN(parseFloat(actualHours)) || parseFloat(actualHours) < 0)) {
      return NextResponse.json({ error: 'Actual hours must be a positive number' }, { status: 400 });
    }

    // Check if task exists and belongs to user
    const [existingTask] = await db
      .select()
      .from(Tasks)
      .where(eq(Tasks.id, params.id))
      .limit(1);

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Only employee who created task can edit (if not approved yet)
    if (
      existingTask.employeeId !== session.user.id &&
      session.user.role !== 'platform_admin'
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Cannot edit approved tasks (unless admin)
    if (
      existingTask.status !== 'pending' &&
      session.user.role !== 'platform_admin'
    ) {
      return NextResponse.json(
        { error: 'Cannot edit approved/rejected tasks' },
        { status: 403 }
      );
    }

    const [task] = await db
      .update(Tasks)
      .set({
        taskName: taskName.trim(),
        description: description?.trim() || null,
        expectedHours: expectedHours?.toString(),
        actualHours: actualHours?.toString(),
        updatedAt: new Date(),
      })
      .where(eq(Tasks.id, params.id))
      .returning();

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}
// DELETE task
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if task exists
    const [existingTask] = await db
      .select()
      .from(Tasks)
      .where(eq(Tasks.id, params.id))
      .limit(1);

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Only employee who created task or admin can delete
    if (
      existingTask.employeeId !== session.user.id &&
      session.user.role !== 'platform_admin'
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.delete(Tasks).where(eq(Tasks.id, params.id));

    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
