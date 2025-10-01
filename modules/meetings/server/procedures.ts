import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { meetings } from "@/db/schema";
import { and, eq, desc, getTableColumns, count } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const meetingsRouter = createTRPCRouter({
  // Get one meeting by ID
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingMeeting] = await db
        .select({
          ...getTableColumns(meetings),
        })
        .from(meetings)
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, ctx.auth.user.id),
          )
        );

      if (!existingMeeting) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" });
      }

      return existingMeeting;
    }),

  // Get many meetings with pagination and search
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().min(1).max(50).default(10),
        search: z.string().nullish(),
        isActive: z.boolean().nullish(),
        tags: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, isActive, tags } = input;
      const userId = ctx.auth.user.id;

      const conditions = [eq(meetings.userId, userId)];

     
      // Fetch paginated results
      const data = await db
        .select({
          ...getTableColumns(meetings),
        })
        .from(meetings)
        .where(and(...conditions))
        .orderBy(desc(meetings.createdAt)) // ✅ ensure `createdAt` exists
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      // Fetch total count
      const [totalResult] = await db
        .select({ count: count() })
        .from(meetings)
        .where(and(...conditions));

      return {
        data,
        pagination: {
          page,
          pageSize,
          total: Number(totalResult?.count ?? 0),
          totalPages: Math.ceil((Number(totalResult?.count ?? 0)) / pageSize),
        },
      };
    }),
});
