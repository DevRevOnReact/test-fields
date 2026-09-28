import { POST_LIMITS } from "@/lib/post-limits";

type PostFieldProps = {
  name: keyof typeof POST_LIMITS;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
};

const fieldClass =
  "w-full rounded-none border border-rule bg-paper px-3.5 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:outline-2 focus:outline-offset-2 focus:outline-accent aria-invalid:border-danger disabled:opacity-70";

export function PostField({ name, label, placeholder, value, error }: PostFieldProps) {
  const limits = POST_LIMITS[name];
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;
  const inputProps = {
    id: name,
    name,
    placeholder,
    defaultValue: value,
    required: true,
    minLength: limits.min,
    maxLength: limits.max,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${hintId} ${errorId}` : hintId,
  };

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={name} className="text-xs font-semibold">
          {label}
        </label>
        <span id={hintId} className="text-[11px] text-muted">
          {limits.min}–{limits.max.toLocaleString("ru-RU")} символов
        </span>
      </div>
      {name === "body" ? (
        <textarea {...inputProps} rows={6} className={`${fieldClass} min-h-40 leading-6`} />
      ) : (
        <input {...inputProps} type="text" className={fieldClass} />
      )}
      {error && (
        <p id={errorId} className="mt-2 text-xs leading-5 text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
