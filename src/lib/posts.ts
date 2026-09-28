import "server-only";

import { z } from "zod";
import { postSchema, userSchema, type Post, type User } from "@/lib/post";
import type { PostInput } from "@/lib/post-schema";

const API_URL = "https://jsonplaceholder.typicode.com";
const REQUEST_TIMEOUT_MS = 10_000;

async function requestJson(path: string, options?: RequestInit): Promise<unknown> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`JSONPlaceholder returned HTTP ${response.status}.`);
  }

  return response.json();
}

export async function getPosts(): Promise<Post[]> {
  return z.array(postSchema).parse(await requestJson("/posts"));
}

export async function getUsers(): Promise<User[]> {
  return z.array(userSchema).parse(await requestJson("/users"));
}

export async function createPost(input: PostInput & { userId: number }): Promise<Post> {
  const response = await requestJson("/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(input),
  });

  return postSchema.parse(response);
}
