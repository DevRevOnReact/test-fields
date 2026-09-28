import type { Post } from "@/lib/post";
import type { PostInput } from "@/lib/post-schema";

export type PostFieldErrors = Partial<Record<keyof PostInput, string[]>>;

type FormValues = { values: PostInput };

export type PostFormState = FormValues &
  (
    | { status: "idle" }
    | { status: "error"; submissionId: string; message: string; fieldErrors?: PostFieldErrors }
    | { status: "success"; submissionId: string; message: string; post: Post }
  );

export const initialPostFormState: PostFormState = {
  status: "idle",
  values: { title: "", body: "" },
};
