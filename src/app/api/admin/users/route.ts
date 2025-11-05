// // app/api/admin/users/route.ts
// import { Tickets, UserTable } from "@/drizzle/schema";
// import { db } from "@/lib/db";

// import { and, eq } from "drizzle-orm";
// import { NextResponse } from "next/server";

// export const dynamic = 'force-dynamic';
// export async function GET() {
//   try {
//     const usersWithTickets = await db
//       .select({
//         user: UserTable,
//         tickets: Tickets,
//       })
//       .from(UserTable)
//       .innerJoin(Tickets, eq(UserTable.id, Tickets.userId))
//       .orderBy(UserTable.createdAt);

//     // Group tickets by user
//     const groupedResults = usersWithTickets.reduce((acc, row) => {
//       const existingUser = acc.find((u) => u.user.id === row.user.id);
//       if (existingUser) {
//         existingUser.tickets.push(row.tickets);
//       } else {
//         acc.push({
//           user: row.user,
//           tickets: [row.tickets],
//         });
//       }
//       return acc;
//     }, [] as { user: typeof UserTable.$inferSelect; tickets: typeof Tickets.$inferSelect[] }[]);

//     return NextResponse.json({ success: true, data: groupedResults });
//   } catch (error) {
//     console.error("Error fetching users with tickets:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// app/api/admin/users/route.ts (rename from users-with-tickets)
import { Tickets, UserTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const usersWithTickets = await db
      .select({
        user: UserTable,
        tickets: Tickets,
      })
      .from(UserTable)
      .innerJoin(Tickets, eq(UserTable.id, Tickets.userId))
      .orderBy(UserTable.createdAt);

    // Group tickets by user
    const groupedResults = usersWithTickets.reduce((acc, row) => {
      const existingUser = acc.find((u) => u.user.id === row.user.id);
      if (existingUser) {
        existingUser.tickets.push(row.tickets);
      } else {
        acc.push({
          user: row.user,
          tickets: [row.tickets],
        });
      }
      return acc;
    }, [] as { user: typeof UserTable.$inferSelect; tickets: typeof Tickets.$inferSelect[] }[]);

    return NextResponse.json({ success: true, data: groupedResults });
  } catch (error) {
    console.error("Error fetching users with tickets:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
