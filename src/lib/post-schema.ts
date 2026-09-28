import { z } from "zod";
import { POST_LIMITS } from "@/lib/post-limits";

export const postInputSchema = z.object({
  title: z
    .string({ error: "Введите заголовок текстом." })
    .trim()
    .min(
      POST_LIMITS.title.min,
      `В заголовке должно быть не меньше ${POST_LIMITS.title.min} символов.`,
    )
    .max(
      POST_LIMITS.title.max,
      `В заголовке должно быть не больше ${POST_LIMITS.title.max} символов.`,
    ),
  body: z
    .string({ error: "Введите текст поста." })
    .trim()
    .min(POST_LIMITS.body.min, `В тексте должно быть не меньше ${POST_LIMITS.body.min} символов.`)
    .max(POST_LIMITS.body.max, `В тексте должно быть не больше ${POST_LIMITS.body.max} символов.`),
});

export type PostInput = z.infer<typeof postInputSchema>;
