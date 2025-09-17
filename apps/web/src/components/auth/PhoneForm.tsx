import { actions, isInputError } from "astro:actions";
import type { ActionSubmitHandler } from "../../actions/types.ts";
import { Fieldset } from "@plott-life/ui/components/Fieldset.tsx";
import { navigate } from "../../navigator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { phoneInput } from "../../actions/schema.ts";
import { handleSetActionInputError } from "../../actions/utils.ts";

export const PhoneForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(phoneInput),
  });
  const setActionError = handleSetActionInputError(setError);

  const onSubmit: ActionSubmitHandler<typeof actions.updateUser> = async (data) => {
    try {
      const { error } = await actions.updateUser(data);
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
          alert("입력한 정보를 다시 확인해 주세요.");
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
      <button type="submit" className="block btn btn-lg btn-neutral">
        변경 완료
      </button>
    </form>
  );
};
