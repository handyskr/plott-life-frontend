import { PropsWithChildren } from "preact/compat";

export interface FieldsetProps extends PropsWithChildren {
  label?: string;
  description?: string;
  error?: string;
}

export const Fieldset = (props: FieldsetProps) => {
  return (
    <fieldset className="fieldset">
      {props.label && <legend className="fieldset-legend">{props.label}</legend>}
      {props.children}
      {props.description && <p className="fieldset-description">{props.description}</p>}
      {props.error && <p className="fieldset-error">{props.error}</p>}
    </fieldset>
  );
}
