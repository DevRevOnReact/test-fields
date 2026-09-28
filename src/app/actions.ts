"use server";

import { z } from "zod";
import type { PostFormState } from "@/lib/form-state";
import { postInputSchema } from "@/lib/post-schema";
import { createPost } from "@/lib/posts";

export async function submitPost(
  _previousState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const rawInput = {
    title: formData.get("title"),
    body: formData.get("body"),
  };
  const values = {
    title: typeof rawInput.title === "string" ? rawInput.title : "",
    body: typeof rawInput.body === "string" ? rawInput.body : "",
  };
  const submissionId = crypto.randomUUID();
  const parsed = postInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      status: "error",
      values,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      message: "Проверьте поля формы.",
      submissionId,
    };
  }

  try {
    // JSONPlaceholder has no authentication; user 1 is a fixed demo author.
    const post = await createPost({ ...parsed.data, userId: 1 });

    return {
      status: "success",
      values: { title: "", body: "" },
      message: "Пост отправлен. JSONPlaceholder подтвердил запрос, но не сохраняет новые записи.",
      post,
      submissionId,
    };
  } catch (error) {
    console.error("Failed to create a JSONPlaceholder post:", error);

    return {
      status: "error",
      values,
      message: "Не удалось отправить пост. Попробуйте ещё раз — введённый текст сохранён.",
      submissionId,
    };
  }
}
