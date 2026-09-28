import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createPost, getPosts, getUsers } from "../src/lib/posts";

const post = { id: 1, userId: 1, title: "A post", body: "The post body." };
const user = { id: 1, name: "Leanne Graham" };
const input = { title: "New post", body: "New post body.", userId: 1 };
const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("JSONPlaceholder client", () => {
  it("fetches and validates posts with fresh data and a bounded request", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify([post])));
    const timeoutSpy = vi.spyOn(AbortSignal, "timeout");

    await expect(getPosts()).resolves.toEqual([post]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/posts",
      expect.objectContaining({
        cache: "no-store",
        signal: expect.any(AbortSignal),
      }),
    );
    expect(timeoutSpy).toHaveBeenCalledWith(10_000);
  });

  it("reads the users needed for author names", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify([{ ...user, email: "unused@example.com" }])),
    );

    await expect(getUsers()).resolves.toEqual([user]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users",
      expect.objectContaining({ cache: "no-store" }),
    );
  });

  it("sends a JSON POST and returns the API response", async () => {
    const createdPost = { ...input, id: 101 };
    fetchMock.mockResolvedValue(new Response(JSON.stringify(createdPost), { status: 201 }));

    await expect(createPost(input)).resolves.toEqual(createdPost);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/posts",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(input),
        signal: expect.any(AbortSignal),
      }),
    );
  });

  describe.each([
    { name: "getPosts", call: () => getPosts() },
    { name: "getUsers", call: () => getUsers() },
    { name: "createPost", call: () => createPost(input) },
  ])("$name failures", ({ call }) => {
    it("rejects HTTP errors instead of treating them as success", async () => {
      fetchMock.mockResolvedValue(new Response("Service unavailable", { status: 503 }));

      await expect(call()).rejects.toThrow("HTTP 503");
    });

    it("rejects malformed JSON", async () => {
      fetchMock.mockResolvedValue(new Response("{broken json"));

      await expect(call()).rejects.toBeInstanceOf(SyntaxError);
    });

    it("propagates network failures", async () => {
      fetchMock.mockRejectedValue(new TypeError("fetch failed"));

      await expect(call()).rejects.toThrow("fetch failed");
    });

    it("propagates a request timeout", async () => {
      fetchMock.mockRejectedValue(new DOMException("Request timed out", "TimeoutError"));

      await expect(call()).rejects.toMatchObject({ name: "TimeoutError" });
    });
  });

  it.each([
    { call: () => getPosts(), payload: [{ ...post, id: "1" }] },
    { call: () => getPosts(), payload: { posts: [post] } },
    { call: () => getUsers(), payload: [{ id: 1 }] },
    { call: () => createPost(input), payload: { title: input.title } },
  ])("rejects unexpected external response shapes", async ({ call, payload }) => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify(payload)));

    await expect(call()).rejects.toMatchObject({ name: "ZodError" });
  });
});
