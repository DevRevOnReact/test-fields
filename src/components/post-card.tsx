import type { PostWithAuthor } from "@/lib/post";

export function PostCard({ post }: { post: PostWithAuthor }) {
  return (
    <article
      aria-labelledby={`post-${post.id}`}
      className="grid grid-cols-[26px_minmax(0,1fr)] gap-3 sm:grid-cols-[36px_minmax(0,1fr)] sm:gap-4"
    >
      <span aria-hidden="true" className="pt-1 font-mono text-[11px] text-muted">
        {String(post.id).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <p className="mb-3 text-[11px] font-medium tracking-[0.06em] text-accent">
          {post.authorName}
        </p>
        <h3
          id={`post-${post.id}`}
          className="font-editorial text-[25px] leading-[1.25] text-balance wrap-anywhere first-letter:uppercase sm:text-[28px]"
        >
          {post.title}
        </h3>
        <p className="mt-3 max-w-prose text-[14px] leading-[1.8] whitespace-pre-line text-muted wrap-anywhere">
          {post.body}
        </p>
      </div>
    </article>
  );
}
