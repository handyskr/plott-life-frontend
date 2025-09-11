import { navigate as _navigate } from "astro:transitions/client";

// TODO: url object 지원
/**
 * 특수한 경우가 아닐 경우 navigate() 대신 <a> 태그를 사용하세요.
 */
export const navigate = async (url: string) => {
  await _navigate(url)
}
