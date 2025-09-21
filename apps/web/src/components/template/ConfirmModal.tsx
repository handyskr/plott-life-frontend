import { Modal, ModalContent, ModalFooter, ModalHeader } from '@components/common';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  actionButtonText?: string;
  onAction?: () => void;
  onClose: () => void;
}

export default function ConfirmModal(props: ConfirmModalProps) {
  const {
    isOpen,
    title,
    description,
    actionButtonText,
    onAction,
    onClose,
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalHeader className='relative flex items-center w-full'></ModalHeader>
      <ModalContent className={'flex flex-col items-center w-full pt-8 pb-4'}>
        <img
          alt='contract success image'
          src='/images/warning-yellow.png'
          width={40}
          height={40}
        />
        {!!title && (
          <p className="title2 text-gray-900 mt-10 mb-2">{title}</p>
        )}
        {!!description && (
          <p className="body6 text-gray-600 mb-14">{description}</p>
        )}
        <div className={'w-full px-6 flex gap-2'}>
          <button
            className={'btn bg-gray-100 body2 text-gray-900 flex-1'}
            onClick={onClose}
          >
            닫기
          </button>
          <button
            className={'btn btn-neutral body2 text-white flex-1'}
            onClick={() => {
              if (onAction) {
                onAction();
              }
            }}
          >
            {actionButtonText}
          </button>
        </div>
      </ModalContent>
      <ModalFooter />
    </Modal>
  );
}
