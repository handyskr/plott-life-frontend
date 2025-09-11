import type { ActionError, ActionInputError } from "astro:actions";

export type InferFieldErrors<T> = T extends (
  input: any,
) => Promise<{ data: any; error: infer E }>
  ? E extends ActionError<infer FE>
    ? ActionInputError<FE>["fields"]
    : never
  : never;
