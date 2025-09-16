import { PropsWithChildren } from "preact/compat";

interface Props extends PropsWithChildren {
  name?: string;
  required?: boolean;
}

export const Checkbox = (props: Props) => {
  return (
    <label className="label gap-4">
      <input
        className="checkbox checkbox-neutral w-6 h-6"
        type="checkbox"
        name={props.name}
        required={props.required}
      />
      {props.children}
    </label>
  );
};
