import dayjs from 'dayjs';
import {
  Bed,
  Bathtub,
  Ruler,
  Building,
  // 나중에 필요한 다른 아이콘도 추가
} from '@plott-life/ui/components/icons';

type SearchParamDefaults<T extends Record<string, string>> = {
  [K in keyof T]: string | undefined;
};

export function getSearchParams<T extends Record<string, string>>(
  searchParams: URLSearchParams,
  defaults: T
): SearchParamDefaults<T> {
  const result = {} as SearchParamDefaults<T>;
  for (const key in defaults) {
    const value = searchParams.get(key);
    result[key] = value ?? defaults[key];
  }
  return result;
}
