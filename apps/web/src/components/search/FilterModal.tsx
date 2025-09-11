import { useState } from 'preact/hooks';
import {Modal, ModalContent, ModalFooter, ModalHeader} from "@components/common";

interface FilterModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export default function FilterModal(props: FilterModalProps) {
  const {
    isOpen,
    onRequestClose,
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalHeader className="relative flex items-center w-full border-b border-gray-100">
        <>
          <span className="absolute left-1/2 -translate-x-1/2 body1 text-gray-900">정렬</span>
          <div className="ml-auto flex items-center">
            icon
          </div>
        </>
      </ModalHeader>

      <ModalContent >
        <div className={'bg-white px-6 py-8'}>
          Modal Content
        </div>
      </ModalContent>
      <ModalFooter>
        <button
          className="px-4 py-2 btn btn-primary text-white rounded"
          // onClick={() => onRequestClose}
        >
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
}
