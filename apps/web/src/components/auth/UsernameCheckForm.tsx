import { actions, isInputError } from "astro:actions";
import { useState } from "preact/hooks";
import type { InferFieldErrors } from "../../actions/types.ts";
import { Fieldset } from "@plott-life/ui/components/Fieldset.tsx";
import { navigate } from "../../navigator";

export const UsernameCheckForm = () => {
  const [fieldErrors, setFieldErrors] = useState<
    InferFieldErrors<typeof actions.check>
  >({});

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    setFieldErrors({});

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const { error } = await actions.check(formData);
      if (error) {
        throw error;
      }

      await navigate("/login/password");
    } catch (error: any) {
      if (isInputError(error)) {
        setFieldErrors(error.fields);
        return;
      }

      switch (error?.code) {
        case "NOT_FOUND":
          alert("가입되지 않은 이메일입니다.");
          break;
        default:
          alert("알 수 없는 에러가 발생했습니다.");
          console.error(error);
          break;
      }
    }
  };

  return (
    <form
      className="flex flex-col w-full gap-6"
      method="POST"
      onSubmit={onSubmit}
    >
      <Fieldset
        label={"이메일"}
        error={fieldErrors.username && "올바른 이메일을 입력해 주세요."}
      >
        <input
          className={"w-full input input-natual validator"}
          name="username"
          placeholder="이메일 주소 입력"
          type="email"
          required
          onInvalid={() => setFieldErrors((it) => ({ ...it, username: [""] }))}
        />
      </Fieldset>
      <button type="submit" className="block btn btn-primary">
        이메일로 계속하기
      </button>
    </form>
  );
};
