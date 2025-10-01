import {z} from "zod";

// Temporary schema for existing database structure
export const agentsInsertSchema = z.object({
    name: z.string().min(1, "Name is required"),
    instructions: z.string().min(1, "Instructions are required"),
});

// Full schema for after migration
export const agentsInsertSchemaFull = z.object({
    name: z.string().min(1, "Name is required"),
    instructions: z.string().min(1, "Instructions are required"),
    meetingCount: z.number().min(0, "Meeting count must be a positive number"),
});

export const agentsUpdateSchema = agentsInsertSchema.partial();