import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agents } from "@/db/schema";
import { agentsInsertSchema } from "../schemas";
import { eq, getTableColumns} from "drizzle-orm";
import { z } from "zod";


export const agentsRouter = createTRPCRouter({
    // TODO change getMany to use protectedProcedure when auth is set up
    getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({input, ctx}) => {
        const [existingAgent] = await db
            .select({
                ...getTableColumns(agents),
                meetingCount: db.$count(agents, eq(agents.userId, ctx.auth.session.userId)),
            })
            .from(agents)
            .where(eq(agents.id, input.id));
        return existingAgent;
    }),

    getMany: protectedProcedure.query(async () => {
        const data = await db.select().from(agents);
        return data;
    }),

    create: protectedProcedure
        .input(agentsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdAgent] = await db.insert(agents).values({
                ...input,
                userId: ctx.auth.user.id
            }).returning();
            return createdAgent;
        }),
});
