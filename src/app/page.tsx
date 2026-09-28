import { PostForm } from "@/components/post-form";
import { PostList } from "@/components/post-list";
import { SiteHeader } from "@/components/site-header";
import { parsePage } from "@/lib/pagination";

type PageProps = { searchParams: Promise<{ page?: string | string[] }> };

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const requestedPage = parsePage(params.page);

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-14">
      <SiteHeader />
      <main id="main-content">
        <section className="pt-11 pb-10 sm:pt-16 sm:pb-14" aria-labelledby="page-heading">
          <p className="mb-5 text-[10px] font-semibold tracking-[0.18em] text-accent uppercase">
            Открытая лента · Личные наблюдения
          </p>
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end lg:gap-10">
            <h1
              id="page-heading"
              className="font-editorial text-[43px] leading-[1.08] tracking-[-1.8px] text-balance sm:text-[64px] sm:tracking-[-2.5px] lg:text-[72px]"
            >
              Место для мыслей<span className="text-accent">.</span>
            </h1>
            <p className="max-w-60 pb-1 text-sm leading-6 text-muted">
              Читайте записи.
              <br className="hidden lg:block" /> Делитесь тем, что важно.
            </p>
          </div>
        </section>

        <div className="grid items-start gap-12 border-t border-ink pt-7 pb-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
          <section id="posts" aria-labelledby="posts-heading" className="min-w-0 scroll-mt-6">
            <div className="mb-7 flex items-baseline gap-3">
              <span aria-hidden="true" className="font-mono text-[10px] text-muted">
                01 /
              </span>
              <h2 id="posts-heading" className="text-sm font-semibold">
                Публикации
              </h2>
            </div>
            <PostList requestedPage={requestedPage} />
          </section>

          <aside
            id="new-post"
            aria-labelledby="form-heading"
            className="min-w-0 scroll-mt-6 lg:sticky lg:top-7"
          >
            <PostForm />
            <div className="mt-6 flex gap-3 px-1 text-xs leading-5 text-muted">
              <span aria-hidden="true" className="font-editorial text-2xl text-accent">
                ¶
              </span>
              <p>
                Хорошая запись начинается
                <br />с одной простой мысли.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <footer className="border-t border-rule py-6 text-[11px] text-muted">
        <span className="font-semibold tracking-wide text-ink">
          поля.{" "}
          <span className="ml-2 font-normal tracking-normal text-muted">
            Небольшой журнал записей
          </span>
        </span>
      </footer>
    </div>
  );
}
