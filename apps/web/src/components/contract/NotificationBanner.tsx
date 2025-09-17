import type { ContractStatusType } from '@libs/values.ts';
import { Notification } from '@components/common';

interface NotificationBannerProps {
  expiresAt?: string;
  approvalExpiresAt?: string;
  contractStatus?: ContractStatusType;
}

export default function NotificationBanner(props: NotificationBannerProps) {
  const {
    contractStatus,
  } = props;

  const contractStatusTypeMap: Partial<Record<ContractStatusType, 'info' | 'error' | 'success'>> = {
    REQUESTED: 'info',
    APPROVED: 'error',
    COMPLETED: 'success',
    USING: 'success',
  };

  // contractStatus → 메시지 매핑
  const contractStatusMessageMap: Partial<Record<ContractStatusType, preact.VNode>> = {
    REQUESTED: (
      <>
        {/*expiresAt*/}
        <b>오후 4시 30분까지</b>&nbsp;승인 여부가 확정됩니다.
      </>
    ),
    APPROVED: (
      <>
        {/*approvalExpiresAt*/}
        icon 결제 마감까지&nbsp;<b>02시 20분 19초</b>
      </>
    ),
    COMPLETED: (
      <>
        icon 계약이 확정되었습니다.
      </>
    ),
    USING: (
      <>
        현재 입주중입니다.
      </>
    ),
    EXPIRED: (
      <>
        결제 시간 만료로 계약이 취소되었습니다.
      </>
    ),
    REJECTED: (
      <>
        호스트의 요청으로 계약이 취소되었습니다.
      </>
    ),
    CANCELED: (
      <>
        고객님의 요청으로 계약이 취소되었습니다.
      </>
    ),
    CANCELED_NOPAY: (
      <>
        고객님의 요청으로 계약이 취소되었습니다.
      </>
    ),
  };

  const resolvedType = contractStatusTypeMap[contractStatus ?? ''] ?? 'default';

  const message = contractStatusMessageMap[contractStatus ?? ''] ?? null;

  if (!message) return null; // 보여줄 메시지가 없으면 렌더링 X

  return (
    <Notification type={resolvedType}>
      {message}
    </Notification>
  );
}
