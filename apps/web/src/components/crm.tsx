import { Logo, X } from "@plott-life/ui/components/icons";
import sample_background from "/images/sample_background.jpg?url";
import { Fieldset } from "@plott-life/ui/components/Fieldset.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailInput } from "../actions/schema.ts";
import type { ActionSubmitHandler } from "../actions/types.ts";
import { actions } from "astro:actions";
import { useState } from "preact/hooks";

const Modal = ({ onClose }: any) => {
  const [isSent, setIsSent] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailInput),
  });

  const onSubmit: ActionSubmitHandler<typeof actions.test> = async (data) => {
    try {
      const { error } = await actions.test(data);
      if (error) {
        throw error;
      }
      setIsSent(true);
      window.toast.show({
        message: "신청이 완료되었습니다.",
        duration: 3000,
      });
      setTimeout(() => {
        onClose(true);
      }, 3000);
    } catch (error: any) {
      window.toast.show({
        message: "오류가 발생했습니다. 다시 시도해 주세요.",
        type: "error",
      });
    }
  };

  return (
    <div className={"fixed inset-0 bg-black/45 flex z-[4000]"}>
      <div class="flex flex-col w-full max-w-(--max-width) mx-auto">
        <div class="relative h-64">
          <img
            src={sample_background}
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div class="absolute w-full h-full bg-black opacity-45" />
          <div class="relative w-full h-full flex flex-col gap-5 justify-center items-center">
            <Logo class="w-24 h-auto text-white" />
            <h1 class="text-base text-center text-white">
              <p class="font-bold">10월, 단기임대의 새로운 기준</p>
              <p>plott LIFE가 찾아옵니다.</p>
            </h1>
          </div>
        </div>
        <div class="relative bg-white flex-1 rounded-t-2xl py-10 px-6">
          <div class="flex flex-col items-center gap-8">
            <p class="text-gray-800 text-base text-center">
              plott LIFE가 궁금하다면?
              <br />
              이메일을 남기고 서비스 소개서를 받아보세요.
            </p>
            <form
              className="flex flex-col w-full gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Fieldset
                error={errors.email && "올바른 이메일을 입력해 주세요."}
              >
                <input
                  {...register("email")}
                  disabled={isSent}
                  type="email"
                  className={"w-full input input-lg input-neutral validator"}
                  placeholder="이메일 주소 입력"
                />
              </Fieldset>
              <button type="submit" className="block btn btn-lg btn-primary" disabled={isSent}>
                소개서 받기
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="absolute inset-x-0 top-(--sait)">
        <div class="max-w-(--max-width) w-full mx-auto flex flex-row justify-end">
          <button class="p-5" onClick={onClose}>
            <X class="size-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface Props {
  isOpen: boolean;
}

export const CRMTest = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);
  const onClose = () => {
    setIsOpen(false);
  }

  if (!isOpen) return null;
  return <Modal onClose={onClose} />
}
