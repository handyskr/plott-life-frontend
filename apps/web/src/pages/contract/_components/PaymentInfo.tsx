import { useState, useEffect } from 'preact/hooks';
import { ArrowDown } from '@plott-life/ui/components/icons';
import {ContractStatus} from "@libs/values.ts";

interface Props {
  currency: string;
  totalRentFee: number;
  totalManagementFee: number;
  cleaningFee: number;
  commissionFee: number;
  deposit: number;
  usagePrice: number;
  totalPrice: number;
  isOpen?: boolean;
  contractStatus?: string;
}

export default function PaymentInfo(props: Props) {
  const {
    currency,
    totalRentFee,
    totalManagementFee,
    cleaningFee,
    commissionFee,
    deposit,
    usagePrice,
    totalPrice,
    isOpen,
    contractStatus,
  } = props;

  const isCanceled = contractStatus === ContractStatus.CANCELED
    || contractStatus === ContractStatus.CANCELED_NOPAY
    || contractStatus === ContractStatus.REJECTED
    || contractStatus === ContractStatus.EXPIRED
    || contractStatus === ContractStatus.EXPIRED_APPROVAL;

  // MEMO: 취소 상태면 강제로 열림 유지
  const [open, setOpen] = useState(isCanceled || !!isOpen);

  useEffect(() => {
    if (isCanceled) {
      setOpen(true);
    }
  }, [isCanceled]);

  const handleToggle = () => {
    if (isCanceled) {
      return;
    }

    setOpen((prev) => !prev);
  };

  const priceClass = isCanceled ? 'line-through text-gray-900' : 'text-gray-900';

  return (
    <section className={`payment-info p-6 ${open ? 'open' : ''}`}>
      <div
        className={`header flex justify-between ${
          isCanceled ? 'cursor-default' : 'cursor-pointer'
        }`}
        onClick={handleToggle}
      >
        <h3 className='body1 text-gray-900'>
          {open ? '결제 정보' : '최종 결제 금액'}
        </h3>
        <div className='icon flex gap-3 items-center'>
          {!open && (
            <p className='body1 text-gray-900'>
              {totalPrice.toLocaleString()}원
            </p>
          )}
          {!isCanceled && (
            <ArrowDown
              viewBox={'0 0 24 24'}
              className={`size-4 text-gray-900 transition-transform duration-300 ${
                open ? 'rotate-180' : 'rotate-0'
              }`}
            />
          )}
        </div>
      </div>

      <div
        className={`content overflow-hidden transition-all duration-500 ease-in-out space-y-4 ${
          open
            ? 'max-h-[1000px] opacity-100 translate-y-0'
            : 'max-h-0 opacity-0 -translate-y-2'
        }`}
      >
        <div className='flex justify-between items-center pt-6'>
          <span className='body4 text-gray-900'>최종 결제 금액</span>
          <span className={`body1 ${priceClass}`}>
            {totalPrice.toLocaleString()}원
          </span>
        </div>
        <div className='w-full h-px bg-gray-900'></div>
        <div className='flex justify-between'>
          <span className='body6 text-gray-600'>임대료</span>
          <span className={`body4 ${priceClass}`}>
            {totalRentFee.toLocaleString()}원
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='body6 text-gray-600'>관리비</span>
          <span className={`body4 ${priceClass}`}>
            {totalManagementFee.toLocaleString()}원
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='body6 text-gray-600'>퇴실 청소비</span>
          <span className={`body4 ${priceClass}`}>
            {cleaningFee.toLocaleString()}원
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='body6 text-gray-600'>계약 수수료</span>
          <span className={`body4 ${priceClass}`}>
            {commissionFee.toLocaleString()}원
          </span>
        </div>
        <div className='w-full h-px bg-gray-300'></div>
        <div className='flex justify-between'>
          <span className='body4 text-gray-900'>실 이용 금액</span>
          <span className={`body1 ${priceClass}`}>
            {usagePrice.toLocaleString()}원
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='body6 text-gray-600'>보증금</span>
          <span className={`body4 ${priceClass}`}>
            {deposit.toLocaleString()}원
          </span>
        </div>
        <div className='w-full px-4 py-2 rounded-md bg-gray-50 body6 text-gray-700 mb-6'>
          보증금은 plott LIFE에서 보관하며, 퇴실 후 반환됩니다.
        </div>
      </div>
    </section>
  );
}
