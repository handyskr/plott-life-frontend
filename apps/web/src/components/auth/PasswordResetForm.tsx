import { actions, isInputError } from "astro:actions";
import type { ActionSubmitHandler } from "../../actions/types.ts";
import { Fieldset } from "@plott-life/ui/components/Fieldset.tsx";
import { navigate } from "../../navigator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setPasswordInput } from "../../actions/schema.ts";
import { handleSetActionInputError } from "../../actions/utils.ts";

interface Props {
  email: string;
  token: string;
  successURL: string;
}

export const PasswordResetForm = (props: Props) => {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(setPasswordInput),
    defaultValues: {
      email: props.email as string,
      token: props.token as string,
    },
  });
  const setActionError = handleSetActionInputError(setError);

  const onSubmit: ActionSubmitHandler<typeof actions.setPassword> = async (
    data,
  ) => {
    try {
      const { error } = await actions.setPassword(data);
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

  return (
    <form
      className="flex flex-col w-full gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
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
      <Fieldset
        label={"비밀번호 확인"}
        error={errors.passwordConfirm && "비밀번호가 일치하지 않습니다."}
      >
        <input
          {...register("passwordConfirm")}
          type="password"
          className={"w-full input input-lg input-neutral validator"}
          placeholder="영문, 숫자, 특수문자 조합 8-20자"
        />
      </Fieldset>
      <button type="submit" className="block btn btn-lg btn-neutral body3">
        확인
      </button>
    </form>
  );
};
