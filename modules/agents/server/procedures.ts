import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agents } from "@/db/schema";
import { agentsInsertSchema } from "../schemas";
import { and, eq, ilike, desc, getTableColumns, count } from "drizzle-orm";
import { z } from "zod";

export const agentsRouter = createTRPCRouter({
  // Get one agent by ID
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      const [agent] = await db
        .select({
          ...getTableColumns(agents),
          // meetingCount can be added later if needed
         meetingCount: db
            .select({ count: count() })
            .from("meetings")
            .where(eq("meetings.agentId", input.id))
            .as("meetingCount"),
        })
        .from(agents)
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.userId, userId)
          )
        );

      return agent;
    }),

  // Get many agents with pagination and search
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().min(1).max(100).default(10),
        search: z.string().nullish()
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const userId = ctx.auth.user.id;

      // Build dynamic WHERE clause
      const conditions = [eq(agents.userId, userId)];
      if (search) {
        conditions.push(ilike(agents.name, `%${search}%`));
      }

      // Fetch paginated items
      const items = await db
        .select({
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(and(...conditions))
        .orderBy(agents.createdAt, desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      // Fetch total count for pagination
      const [totalResult] = await db
        .select({ count: count() })
        .from(agents)
        .where(and(...conditions));

      const total = totalResult?.count ?? 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items,
        total,
        totalPages,
      };
    }),

  // Create a new agent
  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input,
          userId,
        })
        .returning();

      return createdAgent;
    }),
});
