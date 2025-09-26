/**
 * @deprecated use ufo
 */
export function getSearchParams<T extends Record<string, string | null>>(
  searchParams: URLSearchParams,
  defaults: T
): {
  [K in keyof T]: T[K] extends string ? string : string | null
} {
  const result: any = {};

  (Object.keys(defaults) as (keyof T)[]).forEach((key) => {
    const value = searchParams.get(key as string);

    if (value !== null && value !== "") {
      result[key] = value;
    } else {
      result[key] = defaults[key];
    }
  });

  return result;
}

export function formatPhoneNumber(phone: string | null, code: string | number | null = null) {
  if (!phone) {
    return null
  }
  if (!code || code === "82" || code === 82) {
    if (phone.startsWith("0")) {
      return phone
    } else {
      return "0" + phone
    }
  }
  return `+${code} ${phone}`;
}
