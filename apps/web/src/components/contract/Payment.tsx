import { useState } from 'preact/hooks';
import dayjs from 'dayjs';
import {ContractStatus, EXPOSE_DATE_FORMAT} from '@libs/values';
import type { ContractStatusType } from '@libs/values.ts';

interface Props {
  contractStatus?: ContractStatusType;
}

export default function ContractInfo(props: Props) {
  const {
    contractStatus,
  } = props;

  return (
    <section className={`p-6`}>
      <div
        className='flex justify-between cursor-pointer'
      >
        <h3 className='body1 text-gray-900'>결제 방법</h3>
      </div>
      <div id={'tosspayments-payment-methods'}/>
      <div id={'tosspayments-agreement'}/>
    </section>
  );
}
