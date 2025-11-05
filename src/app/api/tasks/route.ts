// ====================================
// app/api/tasks/route.ts
// ====================================

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { eq, desc, and } from 'drizzle-orm';
import { Tasks, Projects, UserTable } from '@/drizzle/schema';

// GET all tasks (with filters)
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const employeeId = searchParams.get('employeeId');

    let query = db
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
      .orderBy(desc(Tasks.createdAt));

    // Apply filters
    const conditions = [];
    if (projectId) conditions.push(eq(Tasks.projectId, projectId));
    if (status) conditions.push(eq(Tasks.status, status as any));
    if (employeeId) conditions.push(eq(Tasks.employeeId, employeeId));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const tasks = await query;

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST - Create new task (Employee)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { projectId, taskName, description, expectedHours, actualHours } = body;

    // Validation
    if (!projectId || !taskName || !expectedHours || !actualHours) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if project exists
    const [project] = await db
      .select()
      .from(Projects)
      .where(eq(Projects.id, projectId))
      .limit(1);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const [task] = await db
      .insert(Tasks)
      .values({
        projectId,
        employeeId: session.user.id,
        taskName,
        description,
        expectedHours: expectedHours.toString(),
        actualHours: actualHours.toString(),
        status: 'pending',
      })
      .returning();

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
