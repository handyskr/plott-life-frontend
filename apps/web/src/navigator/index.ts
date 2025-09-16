import { navigate } from 'astro:transitions/client';
import { withQuery } from 'ufo';
/**
 * 특수한 경우가 아닐 경우 navigate() 대신 <a> 태그를 사용하세요.
 */
const navigateWithQuery = async (url: string, params: any) => {
  return navigate(withQuery(url, params));
};

export {
  navigate,
  navigateWithQuery,
}
