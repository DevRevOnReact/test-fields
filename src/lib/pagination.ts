export const POSTS_PER_PAGE = 6;

export function parsePage(value: string | string[] | undefined): number {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return 1;

  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function paginate<T>(items: readonly T[], requestedPage: number) {
  const pageCount = Math.max(1, Math.ceil(items.length / POSTS_PER_PAGE));
  const validPage = Number.isSafeInteger(requestedPage) ? requestedPage : 1;
  const page = Math.min(Math.max(validPage, 1), pageCount);
  const offset = (page - 1) * POSTS_PER_PAGE;

  return {
    items: items.slice(offset, offset + POSTS_PER_PAGE),
    page,
    pageCount,
    total: items.length,
    from: items.length ? offset + 1 : 0,
    to: Math.min(offset + POSTS_PER_PAGE, items.length),
  };
}
