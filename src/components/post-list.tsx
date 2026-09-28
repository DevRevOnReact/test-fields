import { getPostFeed } from "@/lib/post-feed";
import { Arrow } from "@/components/arrow";
import { Pagination } from "@/components/pagination";
import { PostCard } from "@/components/post-card";

export async function PostList({ requestedPage }: { requestedPage: number }) {
  const feed = await getPostFeed(requestedPage);

  if (feed.status === "error") {
    return (
      <div className="border-t border-rule py-10" role="alert">
        <h3 className="font-editorial text-2xl">Лента пока недоступна</h3>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted">
          Не удалось получить публикации. Попробуйте загрузить страницу ещё раз.
        </p>
        <a
          href={`/?page=${requestedPage}`}
          className="mt-6 inline-flex items-center gap-3 border-b border-accent pb-1 text-sm font-medium text-accent"
        >
          Попробовать снова <Arrow />
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-baseline justify-between gap-4 text-xs text-muted">
        <span>{feed.total ? `${feed.from}–${feed.to} из ${feed.total} записей` : "0 записей"}</span>
        <a
          href="https://jsonplaceholder.typicode.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-accent"
        >
          JSONPlaceholder <Arrow direction="up-right" className="size-3" />
          <span className="sr-only"> (откроется в новой вкладке)</span>
        </a>
      </div>
      {feed.total === 0 ? (
        <div className="border-t border-rule py-12">
          <h3 className="font-editorial text-2xl">Здесь пока тихо</h3>
          <p className="mt-3 text-sm text-muted">Источник пока не вернул ни одной записи.</p>
        </div>
      ) : (
        <ol className="border-t border-rule">
          {feed.items.map((post) => (
            <li key={post.id} className="border-b border-rule py-7 sm:py-8">
              <PostCard post={post} />
            </li>
          ))}
        </ol>
      )}
      <Pagination page={feed.page} pageCount={feed.pageCount} />
    </>
  );
}
