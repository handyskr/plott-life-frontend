import { Modal, ModalContent } from "@components/common";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { termAgreementInput, USER_POLICY_CODES } from "../../actions/schema.ts";
import type { SchemaSubmitHandler } from "../../actions/types.ts";
import { ArrowRight } from "@plott-life/ui/components/icons";

interface TermsAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: SchemaSubmitHandler<typeof termAgreementInput>;
}

export default function TermsAgreementModal(props: TermsAgreementModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(termAgreementInput),
  });
  const { isOpen, onClose, onSubmit } = props;

  const onInvalid = (data: any) => {
    alert("필수 약관에 모두 동의해 주세요.");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form
          className="flex flex-col gap-5 p-6"
          onSubmit={handleSubmit(onSubmit, onInvalid)}
        >
          <div className="relative flex items-center w-full py-4 border-b border-gray-100">
            <label className="label gap-4">
              <input
                onClick={() => {
                  USER_POLICY_CODES.forEach((it) => setValue(it, true));
                }}
                className="checkbox checkbox-neutral w-6 h-6"
                type="checkbox"
              />
              <p
                className={
                  "inline-flex flex-1 justify-between items-center text-black"
                }
              >
                약관 전체 동의
              </p>
            </label>
          </div>
          <label className="label gap-4">
            <input
              {...register("TERMS_OF_SERVICE")}
              className="checkbox checkbox-neutral w-6 h-6"
              type="checkbox"
            />
            <p
              className={
                "inline-flex flex-1 justify-between items-center text-black"
              }
            >
              [필수] 서비스 이용약관 동의
              <a
                className="py-2 inline-flex flex-1 justify-end"
                href={"/info/terms-of-service"}
                target="_blank"
              >
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </a>
            </p>
          </label>
          <label className="label gap-4">
            <input
              {...register("PRIVACY_POLICY")}
              className="checkbox checkbox-neutral w-6 h-6"
              type="checkbox"
            />
            <p
              className={
                "inline-flex flex-1 justify-between items-center text-black"
              }
            >
              [필수] 개인정보 처리 방침 동의
              <a
                className="py-2 inline-flex flex-1 justify-end"
                href={"/info/privacy-policy"}
                target="_blank"
              >
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </a>
            </p>
          </label>
          <label className="label gap-4">
            <input
              {...register("IS_ADULT")}
              className="checkbox checkbox-neutral w-6 h-6"
              type="checkbox"
            />
            <p
              className={
                "inline-flex flex-1 justify-between items-center text-black"
              }
            >
              [필수] 만 19세 이상 확인
              <a
                className="py-2 inline-flex flex-1 justify-end"
                href={"/info/term-of-service"}
                target="_blank"
              >
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </a>
            </p>
          </label>
          <label className="label gap-4">
            <input
              {...register("MARKETING_CONSENT")}
              className="checkbox checkbox-neutral w-6 h-6"
              type="checkbox"
            />
            <p
              className={
                "inline-flex flex-1 justify-between items-center text-black"
              }
            >
              [선택] 개인정보 마케팅 활용 동의
              <a
                className="py-2 inline-flex flex-1 justify-end"
                href={"/info/term-of-service"}
                target="_blank"
              >
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </a>
            </p>
          </label>
          <button type="submit" className="w-full btn btn-lg btn-neutral body2">
            다음
          </button>
        </form>
      </ModalContent>
    </Modal>
  );
}
