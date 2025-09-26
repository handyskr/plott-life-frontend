import { type ActionError, actions, isInputError } from "astro:actions";
import { Fieldset } from "@plott-life/ui/components/Fieldset.tsx";
import { navigateWithQuery } from "../../../navigator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailInput } from "../../../actions/schema.ts";
import type { ActionSubmitHandler } from "../../../actions/types.ts";
import { handleSetActionInputError } from "../../../actions/utils.ts";

interface Props {
  successURL: string;
  failureURL: string;
}

export const LoginForm = (props: Props) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailInput),
  });
  const setActionError = handleSetActionInputError(setError);

  const onSubmit: ActionSubmitHandler<typeof actions.check> = async (data) => {
    const { email } = data;

    try {
      const { error } = await actions.check(data);
      if (error) {
        throw error;
      }

      await navigateWithQuery(props.successURL, {
        email,
      });
    } catch (error: any) {
      if (isInputError(error)) {
        setActionError(error);
        return;
      }
      switch ((error as ActionError)?.code) {
        case "NOT_FOUND":
          await navigateWithQuery(props.failureURL, {
            email,
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
      onSubmit={handleSubmit(onSubmit)}
    >
      <Fieldset
        label={"이메일"}
        error={errors.email && "올바른 이메일을 입력해 주세요."}
      >
        <input
          {...register("email")}
          className={"w-full input input-lg input-neutral"}
          placeholder="이메일 주소 입력"
        />
      </Fieldset>
      <button type="submit" className="btn btn-lg btn-block btn-primary body2">
        이메일로 계속하기
      </button>
    </form>
  );
};
