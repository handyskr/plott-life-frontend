import { Modal, ModalContent, ModalFooter, ModalHeader } from '@components/common';
import { SORT_OPTIONS } from '@libs/values.ts';

interface SortModalProps {
  isOpen: boolean;
  handleSortChange: (value: string) => void;
  onRequestClose: () => void;
}

export default function SortModal(props: SortModalProps) {
  const {
    isOpen,
    handleSortChange,
    onRequestClose,
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalHeader className='relative flex items-center w-full border-b border-gray-100'>
        <>
          <span className='absolute left-1/2 -translate-x-1/2 body1 text-gray-900'>정렬</span>
          <button
            className='ml-auto flex items-center cursor-pointer'
            onClick={onRequestClose}
          >
            ✕
          </button>
        </>
      </ModalHeader>

      <ModalContent>
        <div className={'flex flex-col bg-white px-6 py-8 gap-6'}>
          {SORT_OPTIONS.map((option) => {
            const {
              label,
              value,
            } = option;

            return (
              <div
                key={label}
                className='flex items-center justify-between cursor-pointer'
                onClick={() => handleSortChange(value)}
              >
                <span className='body3 text-gray-900'>{label}</span>
                <div
                  className={`w-4 h-4 rounded-full border border-gray-300`}
                />
              </div>
            );
          })}
        </div>
      </ModalContent>
      <ModalFooter />
    </Modal>
  );
}
