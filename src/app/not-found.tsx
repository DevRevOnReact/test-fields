import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <p className="text-xs tracking-widest text-accent uppercase">Поля / 404</p>
      <h1 className="mt-5 font-editorial text-4xl">Этой страницы нет</h1>
      <p className="mt-4 text-sm leading-6 text-muted">
        Вернитесь в ленту, чтобы прочитать другие записи.
      </p>
      <Link href="/" className="mt-8 inline-block border-b border-accent pb-1 text-sm text-accent">
        К публикациям →
      </Link>
    </main>
  );
}
