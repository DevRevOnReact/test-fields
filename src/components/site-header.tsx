import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="flex h-23 items-center justify-between border-b border-rule">
      <Link
        href="/"
        aria-label="Поля — главная"
        className="flex items-center gap-3 text-[29px] font-semibold tracking-[-1.5px]"
      >
        <span
          aria-hidden="true"
          className="flex h-8 w-7 items-center justify-center gap-[3px] bg-accent"
        >
          <span className="h-4 w-px bg-paper" />
          <span className="h-4 w-px bg-paper" />
          <span className="h-4 w-px bg-paper" />
        </span>
        поля<span className="-ml-2 text-accent">.</span>
      </Link>
      <nav aria-label="Основная навигация" className="flex items-center gap-6 text-sm sm:gap-10">
        <Link
          href="/"
          aria-current="page"
          className="hidden border-b border-accent py-1 text-accent sm:block"
        >
          Публикации
        </Link>
        <a href="#new-post" className="flex items-center gap-2 py-3 font-medium hover:text-accent">
          <span aria-hidden="true" className="text-xl font-normal">
            +
          </span>{" "}
          Написать
        </a>
      </nav>
    </header>
  );
}
