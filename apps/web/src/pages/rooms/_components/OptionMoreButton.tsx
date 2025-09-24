import { useState } from 'preact/hooks';
import IconModal from './IconModal.tsx';

type Option = {
  code: string;
  name: string;
  description: string | null;
  count: number | 0;
}

interface OptionMoreButtonProps {
  defaultOptions: Option[];
}

export default function OptionMoreButton(props: OptionMoreButtonProps) {
  const {
    defaultOptions,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className='w-full btn bg-gray-100 rounded-lg body2 text-gray-900'
        onClick={() => setIsOpen(true)}
      >
        기본 옵션 {defaultOptions.length}가지 모두 보기
      </button>
      <IconModal
        isOpen={isOpen}
        defaultOptions={defaultOptions}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
