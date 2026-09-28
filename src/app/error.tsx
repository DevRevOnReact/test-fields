"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <p className="text-xs tracking-widest text-accent uppercase">Поля / Ошибка</p>
      <h1 className="mt-5 font-editorial text-4xl">Что-то пошло не так</h1>
      <p className="mt-4 text-sm leading-6 text-muted">
        Не удалось отобразить страницу. Попробуйте ещё раз.
      </p>
      <button onClick={reset} className="mt-8 bg-accent px-5 py-3 text-sm text-white hover:bg-ink">
        Попробовать снова
      </button>
    </main>
  );
}
