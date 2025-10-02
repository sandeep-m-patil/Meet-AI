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
          id: agents.id,
          name: agents.name,
          userId: agents.userId,
          instructions: agents.instructions,
          createdAt: agents.createdAt,
          updatedAt: agents.updatedAt,
        })
        .from(agents)
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.userId, userId)
          )
        );

      // Add default values for new fields until migration is run
      const agentWithDefaults = agent ? {
        ...agent,
        description: null,
        isActive: true,
        tags: null,
        meetingCount: 0,
      } : null;

      return agentWithDefaults;
    }),

  // Get many agents with pagination and search
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().min(1).max(100).default(10),
        search: z.string().nullish(),
        isActive: z.boolean().nullish(),
        tags: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, isActive, tags } = input;
      const userId = ctx.auth.user.id;

      // Build dynamic WHERE clause (only use existing columns)
      const conditions = [eq(agents.userId, userId)];
      
      if (search) {
        conditions.push(ilike(agents.name, `%${search}%`));
      }
      
      // Skip isActive and tags filters until migration is run
      // if (isActive !== null && isActive !== undefined) {
      //   conditions.push(eq(agents.isActive, isActive));
      // }
      // if (tags) {
      //   conditions.push(ilike(agents.tags, `%${tags}%`));
      // }

      // Fetch paginated items (only existing columns)
      const rawItems = await db
        .select({
          id: agents.id,
          name: agents.name,
          userId: agents.userId,
          instructions: agents.instructions,
          createdAt: agents.createdAt,
          updatedAt: agents.updatedAt,
        })
        .from(agents)
        .where(and(...conditions))
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      // Add default values for new fields until migration is run
      const items = rawItems.map(item => ({
        ...item,
        description: null,
        isActive: true,
        tags: null,
        meetingCount: 0,
      }));

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

  // Update an existing agent
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: agentsInsertSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      // First verify the agent belongs to the user
      const existingAgent = await db
        .select()
        .from(agents)
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.userId, userId)
          )
        )
        .limit(1);

      if (!existingAgent.length) {
        throw new Error("Agent not found or you don't have permission to update it");
      }

      const [updatedAgent] = await db
        .update(agents)
        .set({
          ...input.data,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.userId, userId)
          )
        )
        .returning();

      return updatedAgent;
    }),

  // Delete an agent
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      // First verify the agent belongs to the user
      const existingAgent = await db
        .select()
        .from(agents)
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.userId, userId)
          )
        )
        .limit(1);

      if (!existingAgent.length) {
        throw new Error("Agent not found or you don't have permission to delete it");
      }

      await db
        .delete(agents)
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.userId, userId)
          )
        );

      return { success: true };
    }),
});
