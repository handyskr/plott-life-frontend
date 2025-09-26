import { actions } from 'astro:actions';
import { useState } from 'preact/hooks';

import ConfirmModal from '@components/template/ConfirmModal.tsx';
import { navigateWithQuery } from '../../../navigator';
import { toast } from '@libs/toast.ts';
import { useThrottle } from '@hooks/useThrottle.ts';

interface CancelButtonProps {
  id: number;
  startAt: string;
  endAt: string;
  buildingUnit: {
    id: number,
  },
  expectedPenalty: null | number;
}

export default function CancelButton(props: CancelButtonProps) {
  const {
    id,
    buildingUnit,
    startAt,
    endAt,
    expectedPenalty,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const { onClick: handleCancelContract, loading } = useThrottle(async () => {
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
      console.log(error);

      switch (error?.code) {
        case 'BAD_REQUEST':
          toast.show({
            message: '취소 정보가 일치하지 않습니다.',
            type: 'default',
          });
          break;
        default:
          toast.show({
            message: '알 수 없는 에러가 발생했습니다.',
            type: 'default',
          });
          break;
      }
    }
  });

  return (
    <>
      <div class='p-6 pb-10'>
        <button
          class='btn bg-white w-full text-gray-900 body2'
          onClick={async () => {
            if (expectedPenalty !== null) {
              await navigateWithQuery(`/contract/${id}/cancel`, {});
              return;
            }

            setIsOpen(true);
          }}
        >
          {!loading ? '계약 취소하기' : <span class='loading loading-dots loading-md'></span>}
        </button>
      </div>
      <ConfirmModal
        isOpen={isOpen}
        title='계약을 취소하시겠습니까?'
        description='현재 시점에서는 수수료 없이 취소가 가능합니다.'
        actionButtonText='취소 진행'
        onAction={handleCancelContract}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
