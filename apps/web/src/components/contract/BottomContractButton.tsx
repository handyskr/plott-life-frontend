import { actions } from 'astro:actions';
import { useState } from 'preact/hooks';
import ContractSuccessModal from '@components/contract/ContractSuccessModal.tsx';
import { toast } from '@libs/toast.ts';

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
      switch (error?.code) {
        case 'BAD_REQUEST':
          toast.show({
            message: error?.message ?? '해당 기간에 이미 다른 사람의 계약이 존재합니다.',
            type: 'default',
          });
          break;
        default:
          toast.show({
            message: '알 수 없는 에러가 발생했습니다.',
            type: 'default',
          });
          console.error(error);
          break;
      }
    }
  };

  return (
    <>
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
      <ContractSuccessModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
