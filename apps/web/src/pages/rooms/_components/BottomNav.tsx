import { useState } from 'preact/hooks';
import dayjs from 'dayjs';
import DateModal from './DateModal.tsx';

import {
  getWeeksBetween,
  getPriceData,
} from '@plott-life/utils';
import { EXPOSE_DATE_FORMAT } from '@libs/values.ts';

import { navigateWithQuery } from '../../../navigator';

interface BottomNavProps {
  id: number | string;
  isLoggedIn: boolean;
  deposit: number;
  rentFeePerWeek: number;
  managementFeePerWeek: number;
  cleaningFee: number;
}

export default function BottomNav(props: BottomNavProps) {
  const {
    id,
    isLoggedIn,
    deposit,
    rentFeePerWeek,
    managementFeePerWeek,
    cleaningFee,
  } = props;

  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);

  const today = dayjs();
  const startAt = searchParams.get('startAt') ?? today.format('YYYY-MM-DD');
  const endAt = searchParams.get('endAt') ?? today.add(6, 'day').format('YYYY-MM-DD');
  const weeks = getWeeksBetween(startAt, endAt);

  const {
    totalPrice,
  } = getPriceData({
    weeks,
    deposit,
    rentFeePerWeek,
    cleaningFee,
    managementFeePerWeek,
  });

  const onContractButtonClick = async () => {
    if (!isLoggedIn) {
      const redirectURL = `${window.location.pathname}${window.location.search}`;

      await navigateWithQuery(`/auth/login`, {
        redirectURL,
      });
      return;
    }

    await navigateWithQuery(`/contract/new`, {
      id,
      startAt,
      endAt,
    });
  };

  const handleDateApply = (newStartAt: string, newEndAt: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('startAt', newStartAt);
    params.set('endAt', newEndAt);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.location.href = newUrl;
  };

  return (
    <>
      <nav
        slot='footer'
        className='sticky bottom-0 bg-white border-t border-gray-300 py-5 px-6 flex justify-between items-center'
      >
        <div
          class='flex flex-col cursor-pointer'
          onClick={() => setIsDateModalOpen(true)}
        >
        <span class='body1 mb-1.5'>
          ₩{(totalPrice).toLocaleString()}
        </span>
          <span class='caption1 text-gray-700 underline'>
          {weeks}주 · {dayjs(startAt).format(EXPOSE_DATE_FORMAT)} ~ {dayjs(endAt).format(EXPOSE_DATE_FORMAT)}
        </span>
        </div>
        <button
          class='w-[120px] rounded-lg btn btn-primary body2'
          onClick={onContractButtonClick}
        >
          계약하기
        </button>
      </nav>
      <DateModal
        isOpen={isDateModalOpen}
        startAt={startAt}
        endAt={endAt}
        onAction={handleDateApply}
        onClose={() => setIsDateModalOpen(false)}
      />
    </>
  );
}
