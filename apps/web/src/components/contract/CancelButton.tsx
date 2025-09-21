import { actions, isInputError } from 'astro:actions';
import { useState } from 'preact/hooks';
import ConfirmModal from '@components/template/ConfirmModal';
import type {ContractStatusType} from '@libs/values.ts';

interface CancelButtonProps {
  id: number;
  startAt: string;
  endAt: string;
  buildingUnit: {
    id: number,
  },
  contractStatus: ContractStatusType;
}

export default function CancelButton(props: CancelButtonProps) {
  const {
    id,
    buildingUnit,
    startAt,
    endAt,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const onContractClick = async () => {
    try {
      const { error } = await actions.cancelContract({
        id: Number(id),
        buildingUnitId: Number(buildingUnit.id),
        start: startAt,
        end: endAt,
      });

      if (error) {
        throw error;
      }

      window.location.reload();
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
      <div
        class='p-6 pb-10'
      >
        <button
          class='btn bg-white w-full text-gray-900 body2'
          onClick={() => setIsOpen(true)}
        >
          계약 취소하기
        </button>
      </div>
      <ConfirmModal
        isOpen={isOpen}
        title='계약을 취소하시겠습니까?'
        description='현재 시점에서는 수수료 없이 취소가 가능합니다.'
        actionButtonText='취소 진행'
        onAction={onContractClick}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
