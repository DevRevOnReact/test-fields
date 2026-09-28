import "server-only";

import { getPosts, getUsers } from "@/lib/posts";
import { paginate } from "@/lib/pagination";
import type { PostWithAuthor, User } from "@/lib/post";

async function getAuthors(): Promise<User[]> {
  try {
    return await getUsers();
  } catch (error) {
    console.error("Could not load post authors:", error);
    return [];
  }
}

export async function getPostFeed(requestedPage: number) {
  try {
    const [posts, users] = await Promise.all([getPosts(), getAuthors()]);
    const result = paginate(posts, requestedPage);
    const authors = new Map(users.map((user) => [user.id, user.name]));
    const items: PostWithAuthor[] = result.items.map((post) => ({
      ...post,
      authorName: authors.get(post.userId) ?? `Автор №${post.userId}`,
    }));

    return { status: "success" as const, ...result, items };
  } catch (error) {
    console.error("Could not load posts:", error);
    return { status: "error" as const };
  }
}
