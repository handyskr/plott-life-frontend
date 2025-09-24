import { actions, isInputError } from 'astro:actions';
import { useState } from 'preact/hooks';
import clsx from 'clsx';

import ConfirmModal from '@components/template/ConfirmModal.tsx';
import {ContractStatus, type ContractStatusType} from '@libs/values.ts';

interface MoveOutButtonProps {
  id: number;
  contractStatus: ContractStatusType;
}

export default function MoveOutButton(props: MoveOutButtonProps) {
  const {
    id,
    contractStatus,
  } = props;

  const isUsing = contractStatus === ContractStatus.USING;

  const [isOpen, setIsOpen] = useState(false);

  const onContractClick = async () => {
    try {
      const { error } = await actions.moveOutContract({
        id: Number(id),
      });

      if (error) {
        throw error;
      }

      window.location.href = `/contract/move-out`;
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
        className='p-6 pb-10'
      >
        <button
          className={clsx('btn w-full body2 text-white', isUsing ? 'bg-neutral' : 'bg-gray-400')}
          disabled={!isUsing}
          onClick={() => setIsOpen(true)}
        >
          퇴실 및 보증금 반환 신청&nbsp;{contractStatus === ContractStatus.MOVED_OUT && '완료'}
        </button>
      </div>
      <ConfirmModal
        isOpen={isOpen}
        title='퇴실을 진행하시겠습니까?'
        description='퇴실과 동시에 보증금 반환 신청이 진행됩니다.'
        actionButtonText='퇴실 진행'
        onAction={onContractClick}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
