import { z } from "zod";

// Validate external data at the API boundary; consumers use the inferred types.
export const postSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  title: z.string(),
  body: z.string(),
});

export const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

export type Post = z.infer<typeof postSchema>;
export type User = z.infer<typeof userSchema>;
export type PostWithAuthor = Post & { authorName: string };
