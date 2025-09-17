import { useState } from 'preact/hooks';
import dayjs from 'dayjs';
import { EXPOSE_DATE_FORMAT } from '@libs/values';

interface Props {
  name: string;
  address: string;
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
  isOpen?: boolean;
}

export default function ContractInfo(props: Props) {
  const {
    name,
    address,
    weeks,
    startAt,
    endAt,
    host,
    guest,
    isOpen,
  } = props;

  const [open, setOpen] = useState(isOpen);

  return (
    <section className={`contract-info p-6 ${open ? 'open' : ''}`}>
      <div
        className='header flex justify-between cursor-pointer'
        onClick={() => setOpen((prev) => !prev)}
      >
        <h3 className='body1 text-gray-900'>계약 정보</h3>
        <div className='icon transition-transform duration-300'>
          ▼
        </div>
      </div>

      <div
        className={`content overflow-hidden transition-all duration-300 ease-in-out space-y-4 ${
          open ? 'max-h-[1000px]' : 'max-h-0'
        }`}
      >
        <div className='flex items-center gap-4 pt-6'>
          <img
            src='https://placehold.co/80x80'
            alt='숙소 이미지'
            className='w-20 h-20 rounded-lg object-cover'
          />
          <div className='flex-1'>
            <p className='body4 text-gray-900 mb-1.5'>{name}</p>
            <p className='body5 text-gray-500'>{address}</p>
          </div>
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
