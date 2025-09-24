import { actions } from 'astro:actions';
import { useThrottle } from '@hooks/useThrottle.ts';
import { toast } from '@libs/toast.ts';

interface Props {
  id: number;
  startAt: string;
  endAt: string;
  buildingUnit: {
    id: number,
  },
}

export default function DetailCancelButton(props: Props) {
  const {
    id,
    startAt,
    endAt,
    buildingUnit,
  } = props;

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

      window.location.href = `/contract/${id}`;
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
    <div className={'sticky w-full px-6 py-4 flex gap-2'}>
      <button
        className={'btn bg-gray-100 body2 text-gray-900 flex-1'}
        onClick={() => history.back()}
      >
        닫기
      </button>
      <button
        className={'btn btn-neutral body2 text-white flex-1'}
        onClick={async () => {
          await handleCancelContract();
        }}
      >
        {!loading ? '취소 진행' : <span class='loading loading-dots loading-md'></span>}
      </button>
    </div>
  );
}
