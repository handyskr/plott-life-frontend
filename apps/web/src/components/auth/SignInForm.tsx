import { actions, isInputError } from "astro:actions";
import { useState } from "preact/hooks";
import type { InferFieldErrors } from "../../actions/types.ts";
import { Fieldset } from "@plott-life/ui/components/Fieldset.tsx";
import { navigate } from "../../navigator";

interface Props {
  username?: string | null;
  successURL: string;
}

export const SignInForm = (props: Props) => {
  // NOTE: 이메일전달 확인목적으로 이메일도 포함
  const [fieldErrors, setFieldErrors] = useState<
    InferFieldErrors<typeof actions.login>
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

      await navigate(props.successURL);
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
        hidden={!!props.username}
        label={"이메일"}
        error={fieldErrors.username && "올바른 이메일을 입력해 주세요."}
      >
        <input
          className={"w-full input input-lg input-neutral validator"}
          name="username"
          placeholder="이메일 주소 입력"
          type="email"
          required
          defaultValue={props.username as string}
          onInvalid={() => setFieldErrors((it) => ({ ...it, username: [""] }))}
        />
      </Fieldset>
      <Fieldset
        label={"비밀번호"}
        error={fieldErrors.password && "비밀번호가 일치하지 않습니다."}
      >
        <input
          className={"w-full input input-lg input-neutral validator"}
          name="password"
          placeholder="영문, 숫자, 특수문자 조합 8-20자"
          type="password"
          required
          min={8}
          max={20}
          onInvalid={() => setFieldErrors((it) => ({ ...it, password: [""] }))}
        />
      </Fieldset>
      <button type="submit" className="block btn btn-lg btn-neutral">
        다음
      </button>
    </form>
  );
};
