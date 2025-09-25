import { useState, useEffect } from 'preact/hooks';

import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@components/common';
import Calendar from '@components/common/Calendar';

interface DateModalProps {
  isOpen: boolean;
  startAt?: string;
  endAt?: string;
  onClose: () => void;
  onAction: (startAt: string, endAt: string) => void;
}

export default function DateModal(props: DateModalProps) {
  const {
    isOpen,
    startAt,
    endAt,
    onClose,
    onAction,
  } = props;

  const [localStartAt, setLocalStartAt] = useState<string | null>(null);
  const [localEndAt, setLocalEndAt] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLocalStartAt(startAt ?? null);
      setLocalEndAt(endAt ?? null);
    }
  }, [isOpen, startAt, endAt]);

  const handleApplyClick = () => {
    if (localStartAt && localEndAt) {
      onAction(localStartAt, localEndAt);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalHeader className='relative flex items-center w-full border-b border-gray-100'>
        <>
          <span className='absolute left-1/2 -translate-x-1/2 body1 text-gray-900'>
            날짜 선택
          </span>
          <button
            className='ml-auto flex items-center cursor-pointer'
            onClick={onClose}
          >
            ✕
          </button>
        </>
      </ModalHeader>
      <ModalContent className={'max-h-[70vh]'}>
        <div className={'sticky top-0 bg-white z-10'}>
          <div
            className='grid grid-cols-7 items-center w-full h-10 px-4 border-b-1 border-gray-100  bg-white text-center'>
            {['일', '월', '화', '수', '목', '금', '토'].map(d => (
              <p className='body6 text-gray-600'>{d}</p>
            ))}
          </div>
        </div>
        <div className='pt-2 pb-8 bg-white'>
          <Calendar
            startAt={localStartAt}
            endAt={localEndAt}
            onDatesChange={(start, end) => {
              setLocalStartAt(start ? start.format('YYYY-MM-DD') : null);
              setLocalEndAt(end ? end.format('YYYY-MM-DD') : null);
            }}
          />
        </div>
      </ModalContent>
      <ModalFooter className={'z-100'}>
        <div className='bg-white border-t w-full border-gray-300 py-3 px-6 flex justify-between items-center'>
          <button
            className='w-full rounded-lg btn btn-lg bg-gray-900 body2 text-white'
            onClick={handleApplyClick}
          >
            적용
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
