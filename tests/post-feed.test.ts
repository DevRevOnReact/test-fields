import { assert, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/posts", () => ({ getPosts: vi.fn(), getUsers: vi.fn() }));

import { getPostFeed } from "@/lib/post-feed";
import { getPosts, getUsers } from "@/lib/posts";

const posts = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  userId: 1,
  title: `Post ${index + 1}`,
  body: "Post body.",
}));

beforeEach(() => {
  vi.mocked(getPosts).mockReset().mockResolvedValue(posts);
  vi.mocked(getUsers)
    .mockReset()
    .mockResolvedValue([{ id: 1, name: "Leanne Graham" }]);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("getPostFeed", () => {
  it("joins authors only to the requested page", async () => {
    const feed = await getPostFeed(2);
    assert(feed.status === "success");

    expect(feed.items.map((post) => post.id)).toEqual([7, 8]);
    expect(feed.items.every((post) => post.authorName === "Leanne Graham")).toBe(true);
    expect(feed).toMatchObject({ page: 2, pageCount: 2, total: 8, from: 7, to: 8 });
  });

  it("keeps the feed readable when the authors API fails", async () => {
    vi.mocked(getUsers).mockRejectedValue(new Error("Authors unavailable"));
    const feed = await getPostFeed(1);
    assert(feed.status === "success");

    expect(feed.items).toHaveLength(6);
    expect(feed.items[0]?.authorName).toBe("Автор №1");
  });

  it("falls back to author ID if a post references a missing author", async () => {
    vi.mocked(getUsers).mockResolvedValue([]);
    const feed = await getPostFeed(1);
    assert(feed.status === "success");
    expect(feed.items[0]?.authorName).toBe("Автор №1");
  });

  it("returns an empty feed when there are no posts", async () => {
    vi.mocked(getPosts).mockResolvedValue([]);
    expect(await getPostFeed(10)).toEqual({
      status: "success",
      items: [],
      page: 1,
      pageCount: 1,
      total: 0,
      from: 0,
      to: 0,
    });
  });

  it("returns a safe failure result when posts cannot be loaded", async () => {
    vi.mocked(getPosts).mockRejectedValue(new Error("Internal API details"));
    expect(await getPostFeed(1)).toEqual({ status: "error" });
  });
});
