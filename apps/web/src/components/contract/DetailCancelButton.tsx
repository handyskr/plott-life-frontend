import { actions, isInputError } from 'astro:actions';
import { useState } from 'preact/hooks';
import ConfirmModal from '@components/template/ConfirmModal';
import type {ContractStatusType} from '@libs/values.ts';

interface Props {
  id: number;
  startAt: string;
  endAt: string;
  buildingUnit: {
    id: number,
  },
  contractStatus: ContractStatusType;
}

export default function DetailCancelButton(props: Props) {
  const {
    id,
    buildingUnit,
    startAt,
    endAt,
  } = props;

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
    <div className={'sticky w-full px-6 py-4 flex gap-2'}>
      <button
        className={'btn bg-gray-100 body2 text-gray-900 flex-1'}
        onClick={() => history.back()}
      >
        닫기
      </button>
      <button
        className={'btn btn-neutral body2 text-white flex-1'}
        onClick={() => {
          if (onContractClick) {
            onContractClick();
          }
        }}
      >
        취소 진행
      </button>
    </div>
  );
}
