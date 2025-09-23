import dayjs from 'dayjs';
import {
  Bed,
  Bathtub,
  Ruler,
  Building,
  // 나중에 필요한 다른 아이콘도 추가
} from '@plott-life/ui/components/icons';

export function getSearchParams<T extends Record<string, string | null>>(
  searchParams: URLSearchParams,
  defaults: T
): {
  [K in keyof T]: T[K] extends string ? string : string | null
} {
  const result: any = {};

  (Object.keys(defaults) as (keyof T)[]).forEach((key) => {
    const value = searchParams.get(key as string);

    if (value !== null) {
      result[key] = value;
    } else {
      result[key] = defaults[key];
    }
  });

  return result;
}

