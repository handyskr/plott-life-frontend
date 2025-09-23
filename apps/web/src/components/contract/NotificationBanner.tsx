import { useRef, useEffect, useMemo } from 'preact/hooks';
import dayjs from 'dayjs';
import { Notification } from '@components/common';

import type { ContractStatusType } from '@libs/values.ts';
import { Check as CheckIcon } from '@plott-life/ui/components/icons';

import 'dayjs/locale/ko';
dayjs.locale('ko');

interface NotificationBannerProps {
  expiresAt?: string;
  approvalExpiresAt?: string;
  contractStatus?: ContractStatusType;
}

function CountdownText({ expiresAt }: { expiresAt: string }) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const end = dayjs(expiresAt);

    if (!end.isValid()) {
      if (spanRef.current) spanRef.current.textContent = '시간 정보 오류';
      return;
    }

    function update() {
      const diff = end.diff(dayjs());
      if (diff <= 0) {
        if (spanRef.current) spanRef.current.textContent = '만료됨';
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const s = String(totalSeconds % 60).padStart(2, '0');

      if (spanRef.current) {
        spanRef.current.textContent = `${h}시 ${m}분 ${s}초`;
      }
    }

    update();
    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return <span ref={spanRef} />;
}

export default function NotificationBanner(props: NotificationBannerProps) {
  const { contractStatus, expiresAt, approvalExpiresAt } = props;

  const resolvedType = useMemo(() => {
    const map: Partial<Record<ContractStatusType, 'info' | 'error' | 'success'>> = {
      REQUESTED: 'info',
      APPROVED: 'error',
      COMPLETED: 'success',
      USING: 'success',
    };
    return map[contractStatus ?? ''] ?? 'default';
  }, [contractStatus]);

  const message = useMemo(() => {
    switch (contractStatus) {
      case 'REQUESTED':
        return (
          <>
            <b>{dayjs(approvalExpiresAt).format('A h시 m분')}까지</b>&nbsp;승인 여부가 확정됩니다.
          </>
        );
      case 'APPROVED':
        return (
          <>
            🕒 결제 마감까지&nbsp;<CountdownText expiresAt={expiresAt!} />
          </>
        );
      case 'COMPLETED':
        return (
          <>
            <CheckIcon className="mr-1.5" /> 계약이 확정되었습니다.
          </>
        );
      case 'USING':
        return <>현재 입주중입니다.</>;
      case 'EXPIRED':
        return <>결제 시간 만료로 계약이 취소되었습니다.</>;
      case 'REJECTED':
        return <>호스트의 요청으로 계약이 취소되었습니다.</>;
      case 'CANCELED':
      case 'CANCELED_NOPAY':
        return <>고객님의 요청으로 계약이 취소되었습니다.</>;
      default:
        return null;
    }
  }, [contractStatus, approvalExpiresAt, expiresAt]);

  if (!message) return null;

  return <Notification type={resolvedType}>{message}</Notification>;
}
