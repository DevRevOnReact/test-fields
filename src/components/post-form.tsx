"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitPost } from "@/app/actions";
import { initialPostFormState } from "@/lib/form-state";
import { Arrow } from "@/components/arrow";
import { PostField } from "@/components/post-field";
import { PostFormFeedback } from "@/components/post-form-feedback";

export function PostForm() {
  const [state, formAction, pending] = useActionState(submitPost, initialPostFormState, "/");
  const feedbackRef = useRef<HTMLDivElement>(null);
  const submissionId = state.status === "idle" ? undefined : state.submissionId;
  const errors = state.status === "error" ? state.fieldErrors : undefined;

  useEffect(() => {
    if (submissionId) feedbackRef.current?.focus();
  }, [submissionId]);

  return (
    <div className="border-t-2 border-accent bg-accent-soft px-5 py-6 sm:px-7 sm:py-7">
      <div className="mb-7 flex items-start justify-between">
        <div>
          <p className="mb-2 text-[10px] font-semibold tracking-[0.15em] text-accent uppercase">
            Есть что сказать?
          </p>
          <h2 id="form-heading" className="font-editorial text-[29px] leading-tight">
            Новая запись
          </h2>
        </div>
        <Arrow direction="up-right" className="mt-2 size-6 text-accent" />
      </div>

      {/* React resets uncontrolled fields after an action; the key restores returned values on failure. */}
      <form
        key={submissionId ?? "initial"}
        action={formAction}
        aria-labelledby="form-heading"
        aria-busy={pending}
      >
        <fieldset disabled={pending} className="space-y-5">
          <PostField
            name="title"
            label="Заголовок"
            placeholder="О чём ваша запись?"
            value={state.values.title}
            error={errors?.title?.[0]}
          />
          <PostField
            name="body"
            label="Текст"
            placeholder="Начните с главного…"
            value={state.values.body}
            error={errors?.body?.[0]}
          />
          <button
            type="submit"
            disabled={pending}
            className="flex min-h-12 w-full items-center justify-between gap-3 bg-accent px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-ink disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? "Отправляем…" : "Отправить запись"} <Arrow />
          </button>
        </fieldset>
      </form>
      <p className="sr-only" role="status">
        {pending ? "Запись отправляется. Пожалуйста, подождите." : ""}
      </p>

      {state.status !== "idle" && <PostFormFeedback ref={feedbackRef} state={state} />}

      <p className="mt-5 text-[11px] leading-[1.7] text-muted">
        Демо-режим. API принимает запись, но не сохраняет её. Результат появится здесь, а общая
        лента останется прежней.
      </p>
    </div>
  );
}
