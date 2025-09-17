import { actions, isInputError } from "astro:actions";
import { Fieldset } from "@plott-life/ui/components/Fieldset.tsx";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { password } from "../../actions/schema.ts";
import { handleSetActionInputError } from "../../actions/utils.ts";
import { useState } from "preact/hooks";
import { z } from "zod";

const schema = z
  .object({
    password: password,
    newPassword: password.optional(),
    passwordConfirm: password.optional(),
  })
  .refine((data) => data.newPassword === data.passwordConfirm, {
    path: ["passwordConfirm"],
  });

type DataType = z.infer<typeof schema>;

// TODO: PasswordConfirmForm 과 병합?
export const PasswordForm = () => {
  const [bit, setBit] = useState(1);
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  console.log(errors);
  // 1: 현재 비밀번호, 2: 새 비밀번호, 3: 현재+새 비밀번호

  const setActionError = handleSetActionInputError(setError);

  const onSubmit: SubmitHandler<DataType> = async (data) => {
    const { password } = data as any;

    if (bit & 1 && !(bit & 2) && password) {
      setBit(2);
      return;
    }

    try {
      const { error } = await actions.updateUser(data as any);
      if (error) {
        throw error;
      }

      history.back();
    } catch (error: any) {
      if (isInputError(error)) {
        setActionError(error);
        return;
      }

      switch (error?.code) {
        case "BAD_REQUEST":
          setBit(3);
          setError("password", { type: "custom" }, { shouldFocus: true });
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
        label={"현재 비밀번호"}
        hidden={!(bit & 1)}
        error={errors.password && "비밀번호가 올바르지 않습니다."}
      >
        <input
          {...register("password")}
          type="password"
          className={"w-full input input-lg input-neutral validator"}
          placeholder="영문, 숫자, 특수문자 조합 8-20자"
        />
      </Fieldset>
      {bit & 2 ? (
        <>
          <Fieldset
            label={"새로운 비밀번호"}
            error={errors.newPassword && "비밀번호가 올바르지 않습니다."}
          >
            <input
              {...register("newPassword")}
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
        </>
      ) : null}
      <button type="submit" className="block btn btn-lg btn-neutral body3">
        확인
      </button>
    </form>
  );
};
