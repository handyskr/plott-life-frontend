import { actions, isInputError } from "astro:actions";
import { useState } from "preact/hooks";
import type { InferFieldErrors } from "../../actions/types.ts";
import { Fieldset } from "@plott-life/ui/components/Fieldset.tsx";
import { navigate } from "../../navigator";

interface Props {
  username?: string | null;
  successURL: string;
}

export const SignUpForm = (props: Props) => {
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
      className="flex flex-col w-full gap-8"
      method="POST"
      onSubmit={onSubmit}
    >
      <Fieldset label={"이메일"}>
        <input
          className={"w-full input input-lg input-natual validator"}
          name="username"
          value={props.username as string}
          disabled
        />
      </Fieldset>
      <Fieldset label={"이메일"}>
        <div className={"flex flex-col gap-3"}>
          <input
            className={"w-full input input-lg input-natual validator"}
            name="lastName"
            placeholder="이름 입력 (예: 길동)"
          />
          <input
            className={"w-full input input-lg input-natual validator"}
            name="firstName"
            placeholder="성 입력 (예: 홍)"
          />
        </div>
      </Fieldset>
      <Fieldset label={"연락처"}>
        <div className={"flex flex-col gap-3"}>
          <select
            className={"w-full input input-lg input-natual validator"}
            name="phoneCode">
            <option>+82 (South Korea)</option>
          </select>
          <input
            className={"w-full input input-lg input-natual validator"}
            name="phoneNumber"
            placeholder="전화번호"
          />
        </div>
      </Fieldset>
      <Fieldset
        label={"비밀번호"}
        error={fieldErrors.password && "비밀번호가 일치하지 않습니다."}
      >
        <input
          className={"w-full input input-lg input-natual validator"}
          name="password"
          placeholder="영문, 숫자, 특수문자 조합 8-20자"
          type="password"
          required
          min={8}
          max={20}
          onInvalid={() => setFieldErrors((it) => ({ ...it, password: [""] }))}
        />
      </Fieldset>
      <Fieldset
        label={"비밀번호 확인"}
        error={fieldErrors.password && "비밀번호가 일치하지 않습니다."}
      >
        <input
          className={"w-full input input-lg input-natual validator"}
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
