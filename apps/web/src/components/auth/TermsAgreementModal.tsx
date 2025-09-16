import { Modal, ModalContent, ModalFooter, ModalHeader } from '@components/common';
import { SORT_OPTIONS } from '@libs/values.ts';
import {Checkbox} from "@plott-life/ui/components/Checkbox.tsx";
import IconArrowRightCode from '@plott-life/ui/icons/arrow-right.svg?raw';

interface TermsAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitClick?: () => Promise<void>;
}

const IconArrowRight = ({ href }: { href: string }) => {
  return (
    <a className='py-2 inline-flex flex-1 justify-end' href={href} target='_blank'>
      <i
        className={'text-gray-400 w-4 h-4'}
        dangerouslySetInnerHTML={{ __html: IconArrowRightCode }}
      />
    </a>
  );
};

export default function TermsAgreementModal(props: TermsAgreementModalProps) {
  const {
    isOpen,
    onClose,
    onSubmitClick,
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalHeader className='relative flex items-center w-full border-b border-gray-100'>
        <div className={'px-2 pt-4'}>
          <Checkbox required>
            <p
              className={'inline-flex flex-1 justify-between items-center text-black'}
            >
              [필수] 서비스 이용약관 동의
            </p>
          </Checkbox>
        </div>
      </ModalHeader>
      <ModalContent>
        <div className='flex flex-col gap-5 p-6'>
          <Checkbox required>
            <p
              className={
                'inline-flex flex-1 justify-between items-center text-black'
              }
            >
              [필수] 서비스 이용약관 동의
              <IconArrowRight href={'/content/policy'}/>
            </p>
          </Checkbox>
          <Checkbox required>
            <p
              className={
                'inline-flex flex-1 justify-between items-center text-black'
              }
            >
              [필수] 개인정보 처리 방침 동의
              <IconArrowRight href={'/content/privacy'}/>
            </p>
          </Checkbox>
          <Checkbox required>
            <p
              className={
                'inline-flex flex-1 justify-between items-center text-black'
              }
            >
              [필수] 만 19세 이상 확인
              <IconArrowRight href={'/content/adult'}/>
            </p>
          </Checkbox>
          <Checkbox required>
            <p
              className={
                'inline-flex flex-1 justify-between items-center text-black'
              }
            >
              [선택] 개인정보 마케팅 활용 동의
              <IconArrowRight href={'/content/marketing'}/>
            </p>
          </Checkbox>
        </div>
      </ModalContent>
      <ModalFooter className={'p-6'}>
        <button
          type='button'
          className='w-full btn btn-lg btn-neutral body2'
          onClick={() => {
            onSubmitClick && onSubmitClick();
          }}
        >
          다음
        </button>
      </ModalFooter>
    </Modal>
  );
}
