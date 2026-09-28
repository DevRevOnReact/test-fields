import Link from "next/link";
import { Arrow } from "@/components/arrow";

export function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Страницы публикаций"
      className="mt-7 flex items-center justify-between gap-3 text-sm"
    >
      {page > 1 ? (
        <Link
          href={`/?page=${page - 1}#posts`}
          className="inline-flex min-h-11 items-center gap-2 hover:text-accent"
        >
          <Arrow direction="left" /> Назад
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex min-h-11 items-center gap-2 text-muted/55"
        >
          <Arrow direction="left" /> Назад
        </span>
      )}
      <span className="font-mono text-xs text-muted" aria-current="page">
        {page} / {pageCount}
      </span>
      {page < pageCount ? (
        <Link
          href={`/?page=${page + 1}#posts`}
          className="inline-flex min-h-11 items-center gap-2 hover:text-accent"
        >
          Дальше <Arrow />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex min-h-11 items-center gap-2 text-muted/55"
        >
          Дальше <Arrow />
        </span>
      )}
    </nav>
  );
}
