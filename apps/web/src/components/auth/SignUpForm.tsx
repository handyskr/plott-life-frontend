import { actions, isInputError } from "astro:actions";
import { useState } from "preact/hooks";
import type { ActionSubmitHandler, SchemaSubmitHandler } from "../../actions/types.ts";
import { Fieldset } from "@plott-life/ui/components/Fieldset.tsx";
import { TermsAgreementModal } from "@components/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpInput, termAgreementInput } from "../../actions/schema.ts";
import { handleSetActionInputError } from "../../actions/utils.ts";
import { navigate } from "../../navigator";

interface Props {
  email?: string | null;
  successURL: string;
}

export const SignUpForm = (props: Props) => {
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpInput),
  });

  const setActionError = handleSetActionInputError(setError);

  console.error(errors);

  const [isOpenTermsModal, setIsOpenTermsModal] = useState(false);

  const onSubmit: ActionSubmitHandler<typeof actions.signUp> = async (data) => {
    setIsOpenTermsModal(true);
  };

  const onSubmitWithTermAgreed: SchemaSubmitHandler<typeof termAgreementInput> = async (termsAgreements) => {
    try {
      const data = getValues();
      data.agreedPolicyCodes = (Object.entries(termsAgreements) as [keyof typeof termsAgreements, boolean][])
        .filter(([_, v]) => v)
        .map(([k, _]) => k);

      const { error } = await actions.signUp(data);
      if (error) {
        throw error;
      }

      await navigate(props.successURL);
    } catch (error: any) {
      console.log(error);
      setIsOpenTermsModal(false);

      if (isInputError(error)) {
        setActionError(error);
        return;
      }

      switch (error?.code) {
        default:
          alert("알 수 없는 에러가 발생했습니다.");
          console.error(error);
          break;
      }
    }
  };

  return (
    <>
      <form
        className="flex flex-col w-full gap-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Fieldset
          label={"이메일"}
          error={errors.email && "이메일을 입력해주세요."}
        >
          <input
            {...register("email")}
            className="w-full input input-lg input-neutral validator"
            type="email"
            placeholder="이메일 주소"
            disabled={!!props.email}
          />
        </Fieldset>
        <Fieldset
          label={"여권상 이름"}
          error={
            (errors.lastName || errors.firstName) && "이름을 입력해주세요."
          }
        >
          <div className={"flex flex-col gap-3"}>
            <input
              {...register("lastName")}
              className={"w-full input input-lg input-neutral validator"}
              placeholder="이름 입력 (예: 길동)"
            />
            <input
              {...register("firstName")}
              className={"w-full input input-lg input-neutral validator"}
              placeholder="성 입력 (예: 홍)"
            />
          </div>
        </Fieldset>
        <Fieldset
          label={"연락처"}
          error={errors.phoneNumber && "전화번호를 입력해주세요."}
        >
          <div className={"flex flex-col gap-3"}>
            <select
              {...register("phoneCode")}
              className={"w-full input input-lg input-neutral validator"}
            >
              <option value={82}>+82 (South Korea)</option>
            </select>
            <input
              {...register("phoneNumber")}
              className={"w-full input input-lg input-neutral validator"}
              name="phoneNumber"
              placeholder="전화번호"
            />
          </div>
        </Fieldset>
        <Fieldset
          label={"비밀번호"}
          error={errors.password && "비밀번호가 일치하지 않습니다."}
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
        <button type="submit" className="block btn btn-lg btn-neutral mt-8">
          다음
        </button>
      </form>
      <TermsAgreementModal
        isOpen={isOpenTermsModal}
        onClose={() => setIsOpenTermsModal(false)}
        onSubmit={onSubmitWithTermAgreed}
      />
    </>
  );
};
