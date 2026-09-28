import { describe, expect, it } from "vitest";
import { postInputSchema } from "../src/lib/post-schema";

const validInput = {
  title: "Тестовый пост",
  body: "Содержательный текст тестового поста.",
};

describe("postInputSchema", () => {
  it("trims both fields before returning validated input", () => {
    expect(
      postInputSchema.parse({
        title: "  Тестовый пост  ",
        body: "\nСодержательный текст тестового поста.\n",
      }),
    ).toEqual(validInput);
  });

  it("accepts the exact minimum and maximum lengths", () => {
    expect(postInputSchema.safeParse({ title: "a".repeat(3), body: "b".repeat(10) }).success).toBe(
      true,
    );
    expect(
      postInputSchema.safeParse({ title: "a".repeat(120), body: "b".repeat(3000) }).success,
    ).toBe(true);
  });

  it.each([
    ["title", ""],
    ["title", "   "],
    ["title", "  ab  "],
    ["title", "a".repeat(121)],
    ["body", ""],
    ["body", "\n  \t"],
    ["body", "  123456789  "],
    ["body", "b".repeat(3001)],
  ])("rejects an invalid %s field", (field, value) => {
    const result = postInputSchema.safeParse({ ...validInput, [field]: value });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === field)).toBe(true);
    }
  });

  it("checks limits after trimming, without truncating the input", () => {
    expect(
      postInputSchema.parse({
        title: `  ${"a".repeat(120)}  `,
        body: `\n${"b".repeat(3000)}\n`,
      }),
    ).toEqual({ title: "a".repeat(120), body: "b".repeat(3000) });
  });

  it.each([null, undefined, 123, new File(["text"], "post.txt")])(
    "rejects non-string fields",
    (value) => {
      expect(postInputSchema.safeParse({ ...validInput, title: value }).success).toBe(false);
      expect(postInputSchema.safeParse({ ...validInput, body: value }).success).toBe(false);
    },
  );
});
