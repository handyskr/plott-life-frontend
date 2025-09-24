import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@components/common';
import IconByCode from './IconByCode';

type Option = {
  code: string;
  name: string;
}

interface IconModalProps {
  isOpen: boolean;
  defaultOptions: Option[];
  onClose: () => void;
}

export default function IconModal(props: IconModalProps) {
  const {
    isOpen,
    defaultOptions,
    onClose,
  } = props;

  console.log(defaultOptions);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalHeader className='relative flex items-center w-full border-b border-gray-100'>
        <>
          <span className='absolute left-1/2 -translate-x-1/2 body1 text-gray-900'>
            기본 옵션
          </span>
          <button
            className='ml-auto flex items-center cursor-pointer'
            onClick={onClose}
          >
            ✕
          </button>
        </>
      </ModalHeader>
      <ModalContent>
        <div class='grid grid-cols-2 gap-4 p-6 pb-8 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4'>
          {defaultOptions.map((option) => {
            return (
              <div class='flex items-center gap-x-3 gap-y-2 h-12'>
                <IconByCode
                  code={option.code}
                  className={'w-6 h-6 text-gray-900'}
                />
                <span class='body3 text-gray-900'>{option.name}</span>
              </div>
            );
          })}
        </div>
      </ModalContent>
      <ModalFooter />
    </Modal>
  );
}
