import dayjs from 'dayjs';
import {
  getWeeksBetween,
  getPriceData,
} from '@plott-life/utils';
import { EXPOSE_DATE_FORMAT } from '@libs/values.ts';

import { navigateWithQuery } from '../../navigator';

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

  const handleContractClick = async () => {
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

  return (
    <nav
      slot='footer'
      className='sticky bottom-0 bg-white border-t border-gray-300 py-3 px-6 flex justify-between items-center'
    >
      <div class='flex flex-col'>
      <span class='body1 mb-1.5'>
        ₩{(totalPrice).toLocaleString()}
      </span>
        <span class='caption1 text-gray-700 underline'>
        {weeks}주 · {dayjs(startAt).format(EXPOSE_DATE_FORMAT)} ~ {dayjs(endAt).format(EXPOSE_DATE_FORMAT)}
      </span>
      </div>
      <button
        class='w-[120px] rounded-lg btn btn-primary body2'
        onClick={handleContractClick}
      >
        계약하기
      </button>
    </nav>
  );
}
