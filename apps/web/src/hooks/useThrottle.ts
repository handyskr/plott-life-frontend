import { useState, useMemo } from 'preact/hooks';
import _ from 'lodash';

type ActionFn = () => void | Promise<void>;

export function useThrottle(action: ActionFn, wait = 3000) {
  const [loading, setLoading] = useState(false);

  const throttled = useMemo(() =>
    _.throttle(async () => {
      if (loading) return;

      try {
        setLoading(true);
        await Promise.resolve(action());
      } finally {
        setLoading(false);
      }
    }, wait, { trailing: false })
    , [action, wait, loading]);

  return { onClick: throttled, loading };
}
