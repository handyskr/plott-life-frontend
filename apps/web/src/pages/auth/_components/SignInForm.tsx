import { actions, isInputError } from "astro:actions";
import type { ActionSubmitHandler } from "../../../actions/types.ts";
import { Fieldset } from "@plott-life/ui/components/Fieldset.tsx";
import { navigate } from "../../../navigator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInInput } from "../../../actions/schema.ts";
import { handleSetActionInputError } from "../../../actions/utils.ts";

interface Props {
  email?: string | null;
  successURL: string;
  setPasswordURL: string;
  sentPasswordURL: string;
}

export const SignInForm = (props: Props) => {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInInput),
    defaultValues: {
      email: props.email as string,
    }
  });
  const setActionError = handleSetActionInputError(setError);

  const onSubmit: ActionSubmitHandler<typeof actions.signIn> = async (data) => {
    try {
      const { error } = await actions.signIn(data);
      if (error) {
        throw error;
      }

      await navigate(props.successURL);
    } catch (error: any) {
      if (isInputError(error)) {
        setActionError(error);
        return;
      }

      switch (error?.code) {
        case "BAD_REQUEST":
          alert("입력한 정보를 다시 확인해 주세요.");
          break;
        case "NOT_FOUND":
          setError("password", { type: "custom" });
          break;
        default:
          alert("알 수 없는 에러가 발생했습니다.");
          console.error(error);
          break;
      }
    }
  };

  const onRequestRestPassword = async () => {
    const { email } = getValues();
    if (!email) {
      alert("이메일을 입력해 주세요.");
      return;
    }

    try {
      const { error: emailCheckError } = await actions.check({ email });
      if (emailCheckError) {
        throw emailCheckError;
      }
      const { error: resetPasswordError } = await actions.resetPassword({
        email, redirectUri: new URL(props.setPasswordURL, location.href).href
      });
      if (resetPasswordError) {
        throw resetPasswordError;
      }

      await navigate(props.sentPasswordURL);
    } catch (error: any) {
      if (isInputError(error)) {
        setActionError(error);
        return;
      }

      switch (error?.code) {
        case "BAD_REQUEST":
          alert("입력한 정보를 다시 확인해 주세요.");
          break;
        case "NOT_FOUND":
          alert("등록되지 않은 이메일입니다.");
          break;
        default:
          alert("알 수 없는 에러가 발생했습니다.");
          console.error(error);
          break;
      }
    }
  }

  return (
    <form
      className="flex flex-col w-full gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Fieldset
        hidden={!!props.email}
        label={"이메일"}
        error={errors.email && "올바른 이메일을 입력해 주세요."}
      >
        <input
          {...register("email")}
          type="email"
          className={"w-full input input-lg input-neutral validator"}
          placeholder="이메일 주소 입력"
        />
      </Fieldset>
      <Fieldset
        label={"비밀번호"}
        error={errors.password && "비밀번호가 올바르지 않습니다."}
      >
        <input
          {...register("password")}
          type="password"
          className={"w-full input input-lg input-neutral validator"}
          placeholder="영문, 숫자, 특수문자 조합 8-20자"
        />
      </Fieldset>
      <button type="submit" className="block btn btn-lg btn-neutral">
        다음
      </button>
      <button
        type={"button"}
        onClick={onRequestRestPassword}
        class='body6 text-gray-700 underline mt-6'
      >
        비밀번호 재설정
      </button>
    </form>
  );
};
