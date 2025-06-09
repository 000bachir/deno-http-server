import { z } from "zod/v4";


export const UserSchemaLoginValidation = z.object({
  email: z.string().min(6).max(255).email({ pattern: z.regexes.email }),
  password: z.string().min(6).max(1024),
});
