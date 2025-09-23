import { useState, useEffect } from 'preact/hooks';
import dayjs from 'dayjs';
import {ContractStatus, EXPOSE_DATE_FORMAT} from '@libs/values';
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import type { ContractStatusType } from '@libs/values.ts';
import usePayment from "@hooks/usePayment.ts";
import {actions, isInputError} from "astro:actions";
import {toast} from "@libs/toast.ts";

interface Props {
  id: number;
  accessToken: string;
  totalPrice: number;
  guest: {
    name: string;
    phone: string;
    email: string;
  }
}

export default function ContractInfo(props: Props) {
  const {
    id,
    accessToken,
    totalPrice,
    guest: {
      name,
      phone,
      email,
    }
  } = props;

  const { requestPayment } = usePayment({
    accessToken,
    price: totalPrice,
  });

  const onPaymentClick = async () => {
    try {
      const { data, error } = await actions.createPayment({ id: Number(id) });

      if (error) {
        throw error;
      }

      if (!data) {
        toast.show({ message: "결제 생성에 실패했습니다.", type: "default" });
        return;
      }

      const {
        paymentNo,
        title,
        totalPrice,
        confirmUrl,
        noticeUrl,
      } = data;

      console.log({
        orderId: paymentNo,
        orderName: title,
        customerName: name,
        customerEmail: email || '',
        customerMobilePhone: phone.length > 0 ? (phone).replaceAll('-', '') : '',
      });

      await requestPayment({
        orderId: paymentNo,
        orderName: title,
        customerName: name,
        customerEmail: email || '',
        customerMobilePhone: phone.length > 0 ? (phone).replaceAll('-', '') : '',
      });
    } catch (error: any) {
      if (isInputError(error)) {
        console.log(error);
        return;
      }

      switch (error?.code) {
        case 'BAD_REQUEST':
          toast.show({
            message: '잘못된 요청입니다. 새로고침 후 다시 시도해주세요.',
            type: 'default',
            duration: 3000,
          });
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
      <section className={`pt-6`}>
        <div
          className='flex justify-between cursor-pointer'
        >
          <h3 className='body1 text-gray-900 px-6'>결제 방법</h3>
        </div>
        <div id="tosspayments-payment-methods" className="p-0 m-0" />
        <div id="tosspayments-agreement" className="p-0 m-0" />
      </section>
      <div
        slot='footer'
        className='fixed bottom-0 bg-white border-t border-gray-300 py-5 px-6 pb-[calc(var(--bait)+20px)] flex justify-between items-center w-[100%] max-w-(--max-width)'
      >
        <button
          className='w-full rounded-lg btn btn-primary body2 text-white'
          onClick={async () => {
            await onPaymentClick();
          }}
        >
          결제하기
        </button>
      </div>
    </>
  );
}
