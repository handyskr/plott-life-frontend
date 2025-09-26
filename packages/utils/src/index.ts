import dayjs from "dayjs";

type RoomFeatures = {
  bedrooms?: number;
  bathrooms?: number;
  livingrooms?: number;
  kitchens?: number;
  [key: string]: number | undefined;
};

type BedOption = {
  code: string;
  name: string;
  description?: string | null;
  count: number;
}

export function formatFeatures(features: RoomFeatures): string {
  const labels: Record<string, string> = {
    bedrooms: "침실",
    bathrooms: "욕실",
    livingrooms: "거실",
    kitchens: "주방",
  };

  return Object.entries(features)
    .filter(([key, value]) => value && value > 0)
    .map(([key, value]) => `${labels[key] ?? key} ${value}개`)
    .join(", ");
}

export function formatBedOptions(bedOptions: BedOption[]): string {
  if (!bedOptions || bedOptions.length === 0) return "";

  return bedOptions
    .map((bed) => `${bed.name} ${bed.count}개`)
    .join(", ");
}

export function getWeeksBetween(startAt?: string | null, endAt?: string | null): number {
  const startDate = dayjs(startAt);
  const endDate = dayjs(endAt);

  if (!startDate.isValid() || !endDate.isValid()) {
    return 0;
  }

  const diffDays = endDate.diff(startDate, "day") + 1;

  return Math.ceil(diffDays / 7);
}

type PriceDataParams = {
  weeks?: number;
  deposit?: number;
  rentFeePerWeek?: number;
  cleaningFee?: number;
  managementFeePerWeek?: number;
}

export function getPriceData({
  weeks = 1,
  deposit = 0,
  rentFeePerWeek = 0,
  cleaningFee = 0,
  managementFeePerWeek = 0,
}: PriceDataParams) {
  const totalRentFee = rentFeePerWeek * weeks;
  const totalManagementFee = managementFeePerWeek * weeks;
  const commissionFee = Math.ceil((totalRentFee + totalManagementFee + cleaningFee) * 0.099);
  const totalPrice = totalRentFee + totalManagementFee + cleaningFee + commissionFee + deposit
  const usagePrice = totalPrice - deposit;

  return {
    totalRentFee,
    totalManagementFee,
    commissionFee,
    totalPrice,
    usagePrice,
  };
}
