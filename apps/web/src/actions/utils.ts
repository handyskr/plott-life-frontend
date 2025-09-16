import type { ActionInputError } from "astro:actions";
import type { FieldValues, UseFormSetError } from "react-hook-form";

export const handleSetActionInputError = <T extends FieldValues>(setError: UseFormSetError<T>) => (error: ActionInputError<T>) => {
  (Object.keys(error.fields))
    .forEach((field) => setError(field as any, { type: "custom" }));
}
