import { PropsWithChildren } from "preact/compat";

interface Props extends PropsWithChildren {
  name?: string;
  required?: boolean;
}

export const Checkbox = (props: Props) => {
  return (
    <label className="label">
      <input
        className="checkbox checkbox-neutral"
        type="checkbox"
        name={props.name}
        required={props.required}
      />
      {props.children}
    </label>
  );
};
