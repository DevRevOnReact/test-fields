import { afterEach, assert, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("../src/lib/posts", () => ({ createPost: vi.fn() }));

import { submitPost } from "../src/app/actions";
import { initialPostFormState } from "../src/lib/form-state";
import { createPost } from "../src/lib/posts";

const createPostMock = vi.mocked(createPost);

function makeFormData(title = "Новый пост", body = "Содержательный текст нового поста.") {
  const formData = new FormData();
  formData.set("title", title);
  formData.set("body", body);
  return formData;
}

beforeEach(() => {
  createPostMock.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("submitPost", () => {
  it("does not send invalid data to the API and preserves the original strings", async () => {
    const result = await submitPost(initialPostFormState, makeFormData("  ab  ", "  short  "));
    assert(result.status === "error");

    expect(createPostMock).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      status: "error",
      values: { title: "  ab  ", body: "  short  " },
      fieldErrors: {
        title: [expect.any(String)],
        body: [expect.any(String)],
      },
    });
    expect(result.submissionId).toEqual(expect.any(String));
  });

  it("rejects missing fields without making a request", async () => {
    const result = await submitPost(initialPostFormState, new FormData());
    assert(result.status === "error");

    expect(result.status).toBe("error");
    expect(result.values).toEqual({ title: "", body: "" });
    expect(result.fieldErrors?.title).toHaveLength(1);
    expect(result.fieldErrors?.body).toHaveLength(1);
    expect(createPostMock).not.toHaveBeenCalled();
  });

  it("rejects File values instead of converting them to strings", async () => {
    const formData = makeFormData();
    formData.set("title", new File(["A file is not a title"], "title.txt"));

    const result = await submitPost(initialPostFormState, formData);
    assert(result.status === "error");

    expect(result.status).toBe("error");
    expect(result.values.title).toBe("");
    expect(result.values.body).toBe("Содержательный текст нового поста.");
    expect(result.fieldErrors?.title).toHaveLength(1);
    expect(createPostMock).not.toHaveBeenCalled();
  });

  it("does not truncate overlong input before validating it", async () => {
    const body = "b".repeat(3001);
    const result = await submitPost(initialPostFormState, makeFormData("Заголовок", body));
    assert(result.status === "error");

    expect(result.status).toBe("error");
    expect(result.values.body).toBe(body);
    expect(result.fieldErrors?.body).toHaveLength(1);
    expect(createPostMock).not.toHaveBeenCalled();
  });

  it("uses validated strings and the fixed demo author, then resets the form", async () => {
    const formData = makeFormData("  Новый пост  ", "  Содержательный текст нового поста.  ");
    formData.set("userId", "99");
    const post = {
      id: 101,
      userId: 1,
      title: "Новый пост",
      body: "Содержательный текст нового поста.",
    };
    createPostMock.mockResolvedValue(post);

    const result = await submitPost(initialPostFormState, formData);
    assert(result.status === "success");

    expect(createPostMock).toHaveBeenCalledExactlyOnceWith({
      title: post.title,
      body: post.body,
      userId: 1,
    });
    expect(result).toMatchObject({
      status: "success",
      values: { title: "", body: "" },
      post,
    });
    expect(result).not.toHaveProperty("fieldErrors");
    expect(result.message).toContain("не сохраняет");
    expect(result.submissionId).toEqual(expect.any(String));
  });

  it.each([
    new Error("HTTP 503"),
    new SyntaxError("Invalid API JSON"),
    new TypeError("fetch failed"),
    new DOMException("Request timed out", "TimeoutError"),
  ])("returns a retryable error and keeps input when the API fails", async (error) => {
    createPostMock.mockRejectedValue(error);

    const result = await submitPost(
      initialPostFormState,
      makeFormData("  Новый пост  ", "  Содержательный текст нового поста.  "),
    );

    expect(result).toMatchObject({
      status: "error",
      values: {
        title: "  Новый пост  ",
        body: "  Содержательный текст нового поста.  ",
      },
      message: expect.stringContaining("Попробуйте ещё раз"),
    });
    assert(result.status === "error");
    expect(result).not.toHaveProperty("post");
    expect(result.fieldErrors).toBeUndefined();
    expect(result.message).not.toContain(error.message);
  });

  it("gives each result a new submission ID for form restoration", async () => {
    const first = await submitPost(initialPostFormState, new FormData());
    const second = await submitPost(first, new FormData());
    assert(first.status === "error" && second.status === "error");

    expect(first.submissionId).toMatch(/^[0-9a-f-]{36}$/);
    expect(second.submissionId).not.toBe(first.submissionId);
  });
});
