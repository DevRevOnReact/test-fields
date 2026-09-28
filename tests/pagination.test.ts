import { describe, expect, it } from "vitest";
import { paginate, parsePage } from "@/lib/pagination";

describe("parsePage", () => {
  it.each([
    undefined,
    [],
    ["2", "3"],
    "",
    "-1",
    "0",
    "1.5",
    "1e2",
    "0x10",
    "Infinity",
    "NaN",
    " 2 ",
    "9007199254740992",
  ])("defaults to the first page for invalid input %j", (value) =>
    expect(parsePage(value)).toBe(1),
  );

  it("accepts positive safe integers", () => {
    expect(parsePage("2")).toBe(2);
    expect(parsePage("17")).toBe(17);
  });
});

describe("paginate", () => {
  const posts = Array.from({ length: 14 }, (_, index) => index + 1);

  it("returns the requested page and its visible range", () => {
    expect(paginate(posts, 2)).toEqual({
      items: [7, 8, 9, 10, 11, 12],
      page: 2,
      pageCount: 3,
      total: 14,
      from: 7,
      to: 12,
    });
    expect(posts).toHaveLength(14);
  });

  it("clamps an out-of-range page to the last page", () => {
    expect(paginate(posts, 999)).toMatchObject({ items: [13, 14], page: 3, from: 13, to: 14 });
  });

  it("returns a valid empty page", () => {
    expect(paginate([], 5)).toEqual({ items: [], page: 1, pageCount: 1, total: 0, from: 0, to: 0 });
  });

  it.each([0, -1, 1.5, NaN, Infinity])("normalizes invalid page number %s", (page) => {
    expect(paginate(posts, page).page).toBe(1);
  });
});
