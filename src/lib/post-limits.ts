// Shared by browser hints and server validation without bundling Zod in the form.
export const POST_LIMITS = {
  title: { min: 3, max: 120 },
  body: { min: 10, max: 3000 },
} as const;
