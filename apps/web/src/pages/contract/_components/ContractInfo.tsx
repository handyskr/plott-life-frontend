import { useState } from 'preact/hooks';
import dayjs from 'dayjs';
import { ContractStatus, EXPOSE_DATE_FORMAT } from '@libs/values.ts';
import type { ContractStatusType } from '@libs/values.ts';
import {
  ArrowDown,
  ArrowRight,
} from '@plott-life/ui/components/icons';

interface Props {
  weeks: number;
  startAt: string;
  endAt: string;
  host: {
    name: string;
    phone: string;
  };
  guest: {
    name: string;
    phone: string;
  };
  contractStatus?: ContractStatusType;
  buildingUnit: {
    id: number;
    name: string;
    address: string;
  },
}

export default function ContractInfo(props: Props) {
  const {
    weeks,
    startAt,
    endAt,
    host,
    guest,
    contractStatus,
    buildingUnit,
  } = props;

  const [open, setOpen] = useState(!!contractStatus && contractStatus === ContractStatus.REQUESTED);

  const isActive = contractStatus === ContractStatus.REQUESTED || contractStatus === ContractStatus.APPROVED;

  const handleTabClick = () => {
    if (isActive) {
      setOpen(!open);
    }
  };

  return (
    <section className={`contract-info p-6 ${open ? 'open' : ''}`}>
      <div
        className='header flex justify-between cursor-pointer'
        onClick={handleTabClick}
      >
        <h3 className='body1 text-gray-900'>계약 정보</h3>
        {isActive && (
          <ArrowDown
            viewBox={'0 0 24 24'}
            className={`size-4 transition-transform duration-300 ${
              open ? 'rotate-180' : 'rotate-0'
            }`}
          />
        )}
      </div>

      <div
        className={`content overflow-hidden transition-all duration-300 ease-in-out space-y-4 ${
          (open || !isActive) ? 'max-h-[1000px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
        }`}
      >
        <div className='flex items-center gap-4 pt-6'>
          <a
            href={`/rooms/${buildingUnit.id}`}
            className='flex-1 cursor-pointer'
          >
            <div className={'flex flex-row items-center gap-1'}>
              <p className='body4 text-gray-900 mb-1.5'>{buildingUnit.name}</p>
              <ArrowRight viewBox={'0 0 24 24'} className={'size-3'} />
            </div>
            <p className='body5 text-gray-500'>{buildingUnit.address}</p>
          </a>
        </div>

        <div className='w-full h-px bg-gray-300'></div>
        <div className='w-full flex flex-col justify-center'>
          <p className='body4 text-gray-900'>호스트</p>
          <p className='body5 text-gray-700 mt-1.5 mb-3'>
            {host.name} / {host.phone}
          </p>
          <div className='w-full px-4 py-2 rounded-md bg-gray-50 body6 text-gray-700'>
            계약이 확정된 후 연락처가 공개됩니다
          </div>
        </div>

        <div className='w-full h-px bg-gray-300'></div>
        <div className='w-full flex flex-col justify-center'>
          <p className='body4 text-gray-900'>게스트</p>
          <p className='body5 text-gray-700 mt-1.5'>
            {guest.name} / {guest.phone}
          </p>
        </div>

        <div className='w-full h-px bg-gray-300'></div>
        <div className='w-full flex flex-col justify-center'>
          <p className='body4 text-gray-900'>임대기간</p>
          <p className='body5 text-gray-700 mt-1.5'>
            {weeks}주 · {dayjs(startAt).format(EXPOSE_DATE_FORMAT)} ~{' '}
            {dayjs(endAt).format(EXPOSE_DATE_FORMAT)}
          </p>
        </div>
      </div>
    </section>
  );
}
