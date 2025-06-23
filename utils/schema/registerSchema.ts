import { z } from "zod/v4";



export const UserSchemaValidation = z.object({
    name: z.string().min(4).max(32),
    email: z.string().min(6).max(255).email({ pattern: z.regexes.email }),
    password: z.string().min(6).max(1024),
});