import type { ActionError, ActionInputError } from "astro:actions";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";

export type InferFieldErrors<T> = T extends (
  input: any,
) => Promise<{ data: any; error: infer E }>
  ? E extends ActionError<infer FE>
    ? ActionInputError<FE>["fields"]
    : never
  : never;

export type SchemaSubmitHandler<T> = T extends z.ZodTypeAny
  ? SubmitHandler<z.infer<T>>
  : never;
export type ActionSubmitHandler<T> = T extends (
  input: infer DATA,
) => Promise<any>
  ? SubmitHandler<DATA>
  : never;
