import {z} from "zod";

export const meetingsInsertSchema = z.object({
    name: z.string().min(1, "Meeting name is required"),
    agentId: z.string().min(1, "Agent selection is required"),
});

export const meetingsUpdateSchema = meetingsInsertSchema.extend({
  id: z.string().min(1,{ message:"Id is required"}),
});

