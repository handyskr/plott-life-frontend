export const DEFAULT_PAGE_SIZE = 20;
export const EXPOSE_DATE_FORMAT = 'YYYY년 M월 D일';
export const EXPOSE_DATETIME_FORMAT = 'YYYY/MM/DD HH:mm';

export const SORT_OPTIONS = [
  { label: '최신순', value: 'CREATED_AT_DESC' },
  { label: '낮은 가격순', value: 'PRICE_ASC' },
  { label: '높은 가격순', value: 'PRICE_DESC' },
];

export enum ContractStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  EXPIRED_APPROVAL = 'EXPIRED_APPROVAL',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  CANCELED_NOPAY = 'CANCELED_NOPAY',
  USING = 'USING',
  MOVED_OUT = 'MOVED_OUT',
}

export type ContractStatusType = keyof typeof ContractStatus;

export const ContractStatusLabel: Record<ContractStatus, string> = {
  [ContractStatus.REQUESTED]: '승인대기',
  [ContractStatus.APPROVED]: '결제대기',
  [ContractStatus.REJECTED]: '계약거절',
  [ContractStatus.EXPIRED]: '결제만료',
  [ContractStatus.EXPIRED_APPROVAL]: '승인만료',
  [ContractStatus.COMPLETED]: '계약완료',
  [ContractStatus.CANCELED]: '계약취소',
  [ContractStatus.CANCELED_NOPAY]: '계약취소',
  [ContractStatus.USING]: '이용중',
  [ContractStatus.MOVED_OUT]: '퇴거완료',
};

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID', 
  PARTIAL_CANCELED = 'PARTIAL_CANCELED',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
}

export type PaymentStatusType = keyof typeof PaymentStatus;

export const PaymentStatusLabel: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: '결제 대기중',
  [PaymentStatus.PAID]: '결제 완료',
  [PaymentStatus.PARTIAL_CANCELED]: '부분취소',
  [PaymentStatus.CANCELED]: '결제 취소',
  [PaymentStatus.FAILED]: '결제 실패',
  [PaymentStatus.EXPIRED]: '결제 만료',
};

export enum BedroomOption {
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR_PLUS = 'FOUR_PLUS',
}

export enum BathroomOption {
  ONE = 'ONE',
  TWO = 'TWO',
  THREE_PLUS = 'THREE_PLUS',
}
