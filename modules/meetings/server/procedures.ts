import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agents, meetings } from "@/db/schema";
import { and, eq, desc, getTableColumns, count } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { meetingsInsertSchema } from "../schemas";
import { streamVideo } from "@/lib/stream-video";
import { generateAvatarUri } from "@/lib/avatar";

export const meetingsRouter = createTRPCRouter({
  generateToken: protectedProcedure.mutation(async ({ ctx }) => {
    await streamVideo.upsertUsers([
      {
        id: ctx.auth.user.id,
        name: ctx.auth.user.name,
        role: "admin",
        image:
          ctx.auth.user.image ??
          generateAvatarUri({ seed: ctx.auth.user.name, variant: "initials" })
      }
    ]);
    const expirationTime = Math.floor(Date.now() / 1000) + 3600;
    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamVideo.generateUserToken(
      {
        user_id: ctx.auth.user.id,
        exp: expirationTime,
        iat: issuedAt,
      }
    )
    return token;
  }),

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


  // Create a new meetings
  create: protectedProcedure
    .input(meetingsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          ...input,
          userId,
        })
        .returning();

      const call = streamVideo.video.call("default", createdMeeting.id)
      await call.create({
        data: {
          created_by_id: ctx.auth.user.id,
          custom: {
            meetingId: createdMeeting.id,
            meetingName: createdMeeting.name,
          },
          settings_override: {
            transcription: {
              language: "en",
              mode: "auto-on",
              closed_caption_mode: "auto-on",
            },
            recording: {
              mode: "auto-on",
              quality: "1080p",
            }
          }
        }
      })

      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, createdMeeting.agentId));

      if (!existingAgent) throw new TRPCError({
        code: "NOT_FOUND",
        message: "Agent not found",
      })

      await streamVideo.upsertUsers([
        {
          id: existingAgent.id,
          name: existingAgent.name,
          role: "user",
          image: generateAvatarUri({
            seed: existingAgent.name,
            variant: "botttsNeutral"
          })
        }
      ])

      return createdMeeting;
    }),

  // Update an existing meeting
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: meetingsInsertSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      // First verify the meeting belongs to the user
      const existingMeeting = await db
        .select()
        .from(meetings)
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, userId)
          )
        )
        .limit(1);

      if (!existingMeeting.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found or you don't have permission to update it"
        });
      }

      const [updatedMeeting] = await db
        .update(meetings)
        .set({
          ...input.data,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, userId)
          )
        )
        .returning();

      return updatedMeeting;
    }),

  // Delete a meeting
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      // First verify the meeting belongs to the user
      const existingMeeting = await db
        .select()
        .from(meetings)
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, userId)
          )
        )
        .limit(1);

      if (!existingMeeting.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found or you don't have permission to delete it"
        });
      }

      await db
        .delete(meetings)
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, userId)
          )
        );

      return { success: true };
    }),
});
