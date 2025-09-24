import { Modal, ModalContent, ModalFooter, ModalHeader } from '@components/common';

interface ContractSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContractSuccessModal(props: ContractSuccessModalProps) {
  const {
    isOpen,
    onClose,
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalHeader className='relative flex items-center w-full'></ModalHeader>
      <ModalContent className={'flex flex-col items-center w-full pt-12 pb-4'}>
        <img
          alt='contract success image'
          src='/images/contract-success.png'
          width={160}
          height={160}
        />
        <p className={'title2 text-gray-900 mt-10 mb-2'}>
          계약 요청이 접수되었습니다!
        </p>
        <p className={'body6 text-gray-600 mb-20'}>
          최대 2시간 이내에 승인여부가 확정됩니다.
        </p>
        <div className={'w-full px-6'}>
          <a
            href={'/contract'}
            className={'btn btn-neutral w-full'}
          >
            확인
          </a>
        </div>
      </ModalContent>
      <ModalFooter />
    </Modal>
  );
}
