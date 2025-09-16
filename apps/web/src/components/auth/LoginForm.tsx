import { actions, isInputError } from "astro:actions";
import { useState } from "preact/hooks";
import type { InferFieldErrors } from "../../actions/types.ts";
import { Fieldset } from "@plott-life/ui/components/Fieldset.tsx";
import { navigate, navigateWithQuery } from "../../navigator";

interface Props {
  successURL: string;
  failureURL: string;
}

export const LoginForm = (props: Props) => {
  const [fieldErrors, setFieldErrors] = useState<
    InferFieldErrors<typeof actions.check>
  >({});

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    setFieldErrors({});

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      // TODO: 삭제
      // const { error } = await actions.check(formData);
      // if (error) {
      //   throw error;
      // }

      await navigateWithQuery(props.successURL, {
        username: formData.get("username") as string,
      });
    } catch (error: any) {
      if (isInputError(error)) {
        setFieldErrors(error.fields);
        return;
      }

      switch (error?.code) {
        case "NOT_FOUND":
          alert("가입되지 않은 이메일입니다.");
          await navigateWithQuery(props.failureURL, {
            username: formData.get("username") as string,
          });
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
          type="email"
          className={"w-full input input-lg input-neutral validator"}
          name="username"
          placeholder="이메일 주소 입력"
          required
          onInvalid={() => setFieldErrors((it) => ({ ...it, username: [""] }))}
        />
      </Fieldset>
      <button type="submit" className="block btn btn-lg btn-primary">
        이메일로 계속하기
      </button>
    </form>
  );
};
