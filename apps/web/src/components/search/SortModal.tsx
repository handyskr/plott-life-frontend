import { Modal, ModalContent, ModalFooter, ModalHeader } from '@components/common';
import { SORT_OPTIONS } from '@libs/values';
import { RadioButtonActive, RadioButtonInactive } from '@plott-life/ui/components/icons';

interface SortModalProps {
  isOpen: boolean;
  sortValue: null | string;
  handleSortChange: (value: string) => void;
  onClose: () => void;
}

export default function SortModal(props: SortModalProps) {
  const {
    isOpen,
    handleSortChange,
    onClose,
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalHeader className='relative flex items-center w-full border-b border-gray-100'>
        <>
          <span className='absolute left-1/2 -translate-x-1/2 body1 text-gray-900'>정렬</span>
          <button
            className='ml-auto flex items-center cursor-pointer'
            onClick={onClose}
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

            const isSelected = props.sortValue === value;

            return (
              <div
                key={label}
                className='flex items-center justify-between cursor-pointer'
                onClick={() => handleSortChange(value)}
              >
                <span className='body3 text-gray-900'>{label}</span>
                {isSelected ? (
                  <RadioButtonActive
                    className={'size-6 text-gray-900'}
                  />
                ) : (
                  <RadioButtonInactive
                    className={'size-6 text-gray-400'}
                  />
                )}
              </div>
            );
          })}
        </div>
      </ModalContent>
      <ModalFooter />
    </Modal>
  );
}
