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
  CANCELED_NOPAY = 'CANCELED_NOPAY',
  CANCELED = 'CANCELED',
}
// 타입 뽑기
export type ContractStatusType = keyof typeof ContractStatus;
// enum → 한글 매핑


export const EXPOSE_DATE_FORMAT = 'YYYY년 M월 D일';
