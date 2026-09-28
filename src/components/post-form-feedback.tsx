import type { Ref } from "react";
import type { PostFormState } from "@/lib/form-state";

type PostFormFeedbackProps = {
  state: Exclude<PostFormState, { status: "idle" }>;
  ref: Ref<HTMLDivElement>;
};

export function PostFormFeedback({ state, ref }: PostFormFeedbackProps) {
  const isError = state.status === "error";

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role={isError ? "alert" : "status"}
      className={`mt-5 border-l-2 pl-3 text-sm leading-6 ${isError ? "border-danger text-danger" : "border-accent text-accent"}`}
    >
      <p className="font-semibold">{isError ? "Не удалось отправить" : "Запись отправлена"}</p>
      <p className="mt-1">{state.message}</p>
      {state.status === "error" && state.fieldErrors && (
        <div className="mt-2 flex flex-wrap gap-x-4">
          {state.fieldErrors.title && (
            <a href="#title" className="underline underline-offset-4">
              К заголовку
            </a>
          )}
          {state.fieldErrors.body && (
            <a href="#body" className="underline underline-offset-4">
              К тексту
            </a>
          )}
        </div>
      )}
      {state.status === "success" && (
        <article
          className="mt-4 border-t border-accent/20 pt-3 text-ink"
          aria-label="Результат отправки"
        >
          <p className="text-[10px] tracking-wider text-muted uppercase">
            Отправленная запись · №{state.post.id}
          </p>
          <h3 className="mt-2 font-editorial text-xl leading-snug wrap-anywhere">
            {state.post.title}
          </h3>
          <p className="mt-2 text-sm leading-6 whitespace-pre-wrap wrap-anywhere">
            {state.post.body}
          </p>
        </article>
      )}
    </div>
  );
}
