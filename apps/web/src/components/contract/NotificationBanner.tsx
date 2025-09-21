import { useRef, useEffect } from 'preact/hooks';
import type { ContractStatusType } from '@libs/values.ts';
import { Notification } from '@components/common';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'; // ⬅️ 추가
import 'dayjs/locale/ko';

dayjs.locale('ko');
dayjs.extend(duration); // ⬅️ duration 활성화

interface NotificationBannerProps {
  expiresAt?: string;
  approvalExpiresAt?: string;
  contractStatus?: ContractStatusType;
}

function CountdownText({ expiresAt }: { expiresAt: string }) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function update() {
      const now = dayjs();
      const end = dayjs(expiresAt);
      const diff = end.diff(now);

      if (diff <= 0) {
        if (spanRef.current) spanRef.current.textContent = '만료됨';
        return;
      }

      const d = dayjs.duration(diff); // 이제 정상 동작
      const h = String(d.hours()).padStart(2, '0');
      const m = String(d.minutes()).padStart(2, '0');
      const s = String(d.seconds()).padStart(2, '0');

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

  const contractStatusTypeMap: Partial<Record<ContractStatusType, 'info' | 'error' | 'success'>> = {
    REQUESTED: 'info',
    APPROVED: 'error',
    COMPLETED: 'success',
    USING: 'success',
  };

  const contractStatusMessageMap: Partial<Record<ContractStatusType, preact.VNode>> = {
    REQUESTED: (
      <>
        <b>{dayjs(approvalExpiresAt).format('A h시 m분')}까지</b>&nbsp;승인 여부가 확정됩니다.
      </>
    ),
    APPROVED: (
      <>
        🕒 결제 마감까지&nbsp;<CountdownText expiresAt={expiresAt!} />
      </>
    ),
    COMPLETED: <>✅ 계약이 확정되었습니다.</>,
    USING: <>현재 입주중입니다.</>,
    EXPIRED: <>결제 시간 만료로 계약이 취소되었습니다.</>,
    REJECTED: <>호스트의 요청으로 계약이 취소되었습니다.</>,
    CANCELED: <>고객님의 요청으로 계약이 취소되었습니다.</>,
    CANCELED_NOPAY: <>고객님의 요청으로 계약이 취소되었습니다.</>,
  };

  const resolvedType = contractStatusTypeMap[contractStatus ?? ''] ?? 'default';
  const message = contractStatusMessageMap[contractStatus ?? ''] ?? null;

  if (!message) return null;

  return (
    <Notification type={resolvedType}>
      {message}
    </Notification>
  );
}
