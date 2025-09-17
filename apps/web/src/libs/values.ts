export const SORT_OPTIONS = [
  { label: '최신순', value: 'CREATED_AT_DESC' },
  { label: '낮은 가격순', value: 'PRICE_DESC' },
  { label: '높은 가격순', value: 'PRICE_ASC' },
];

export enum ContractStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  CANCELED_NOPAY = 'CANCELED_NOPAY',
  USING = 'USING',
  MOVED_OUT = 'MOVED_OUT',
};

export type ContractStatusType = keyof typeof ContractStatus;

export const ContractStatusLabel: Record<ContractStatus, string> = {
  [ContractStatus.REQUESTED]: "승인대기",
  [ContractStatus.APPROVED]: "결제대기",
  [ContractStatus.REJECTED]: "계약거절",
  [ContractStatus.EXPIRED]: "결제만료",
  [ContractStatus.COMPLETED]: "계약완료",
  [ContractStatus.CANCELED]: "계약취소",
  [ContractStatus.CANCELED_NOPAY]: "계약취소",
  [ContractStatus.USING]: "이용중",
  [ContractStatus.MOVED_OUT]: "퇴실완료",
};

export const EXPOSE_DATE_FORMAT = 'YYYY년 M월 D일';
