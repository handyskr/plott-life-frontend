import { actions, isInputError } from 'astro:actions';
import { useState } from 'preact/hooks';
import ContractSuccessModal from '@components/contract/ContractSuccessModal.tsx';

interface BottomContractButtonProps {
  id: number;
  startAt: string;
  endAt: string;
}

export default function BottomContractButton(props: BottomContractButtonProps) {
  const {
    id,
    startAt,
    endAt,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const onContractClick = async () => {
    try {
      const { error } = await actions.createContract({
        buildingUnitId: Number(id),
        start: startAt,
        end: endAt,
      });

      if (error) {
        throw error;
      }

      setIsOpen(true);
    } catch (error: any) {
      if (isInputError(error)) {
        console.log(error);
        return;
      }

      switch (error?.code) {
        case 'BAD_REQUEST':
          console.log(error);
          break;
        default:
          alert('알 수 없는 에러가 발생했습니다.');
          console.error(error);
          break;
      }
    }
  };

  return (
    <>
      <ContractSuccessModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div
        slot='footer'
        className='sticky bottom-0 bg-white border-t border-gray-300 py-5 px-6 flex justify-between items-center'
      >
        <button
          className='w-full rounded-lg btn btn-primary body2 text-white'
          onClick={async () => {
            await onContractClick();
          }}
        >
          계약 요청하기
        </button>
      </div>
    </>
  );
}
