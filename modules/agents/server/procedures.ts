import { db } from "@/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { agents } from "@/db/schema";

export const agentsRouter = createTRPCRouter({
    getMany: baseProcedure.query(async () => {
        const data = await db.select().from(agents);

        // throw new TRPCError({ code : "bad_request", message : "This is a forced error for testing purposes" });
        //await new Promise((resolve) => setTimeout(resolve, 5000));
        return data;
    })

})