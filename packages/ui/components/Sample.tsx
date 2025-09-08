import { increment } from "@plott-life/utils";
import { useState } from "preact/hooks";

export const Sample = () => {
  const [value, setValue] = useState(0);

  const onClick = () => {
    setValue(increment(value));
  }

  return <button class={'btn btn-primary'} onClick={onClick}>Increment value: {value}</button>;
};
