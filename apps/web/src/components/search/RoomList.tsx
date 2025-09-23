/** @jsxImportSource preact */
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { Card } from '@plott-life/ui';
import { navigateWithQuery } from '../../navigator';
import { DEFAULT_PAGE_SIZE } from '@libs/values.ts';

interface Room {
  id: number;
  name: string;
  address: string;
  areaExclusive: number;
  bedrooms: number;
  bathrooms: number;
  rentFeePerWeek: number;
  mainImage: string | null;
}

interface ApiResponse {
  items: Room[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  offset: number;
}

const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;

function getQueryParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const obj: Record<string, string> = {};
  params.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

async function fetchRooms(
  page: number,
  size: number,
  query: Record<string, string>
): Promise<ApiResponse> {
  const searchParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...query,
  });

  const res = await fetch(`${PUBLIC_API_URL}/v1/building-unit?${searchParams.toString()}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}

export default function RoomList({ initialRooms = [] }: { initialRooms: Room[] }) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [page, setPage] = useState(initialRooms.length > 0 ? 1 : 0);
  const [hasMore, setHasMore] = useState(initialRooms.length === DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [queryParams, setQueryParams] = useState<Record<string, string>>(getQueryParams());
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const didInit = useRef(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const currentPage = page;

    try {
      const data = await fetchRooms(currentPage, DEFAULT_PAGE_SIZE, queryParams);

      setRooms((prev) => {
        const ids = new Set(prev.map((r) => r.id));
        const newItems = data.items.filter((r) => !ids.has(r.id));
        return [...prev, ...newItems];
      });

      setPage((prev) => prev + 1);

      if (data.items.length < DEFAULT_PAGE_SIZE || data.page + 1 >= data.totalPages) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, queryParams]);

  useEffect(() => {
    const onPopState = () => {
      setQueryParams(getQueryParams());
      setPage(0);
      setRooms([]);
      setHasMore(true);
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  useEffect(() => {
    if (initialRooms.length > 0 && !didInit.current) {
      didInit.current = true;
      return;
    }

    setRooms([]);
    setPage(0);
    setHasMore(true);

    (async () => {
      await loadMore();
    })();
  }, [queryParams]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          loadMore();
        }
      },
      { root: null, rootMargin: '200px 0px', threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className='max-w-(--max-width) mx-auto'>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {rooms.length === 0 && !hasMore ? (
          <div className='col-span-full flex flex-col items-center justify-center h-[calc(100vh-400px)]'>
            <span className='body2 text-gray-900 mb-2'>일치하는 검색 결과가 없습니다.</span>
            <span className='body6 text-gray-600'>검색 조건을 다시 설정해주세요.</span>
          </div>
        ) : (
          rooms.map((room) => (
            <Card
              key={room.id}
              id={room.id}
              name={room.name}
              image={room.mainImage}
              address={room.address}
              areaExclusive={room.areaExclusive}
              bedrooms={room.bedrooms}
              bathrooms={room.bathrooms}
              rentFeePerWeek={room.rentFeePerWeek}
              onClick={async () => {
                const { startAt, endAt } = getQueryParams();

                await navigateWithQuery(`/rooms/${room.id}`, {
                  startAt,
                  endAt,
                });
              }}
            />
          ))
        )}
      </div>
      {hasMore && (
        <div ref={loaderRef} className='h-12 flex justify-center items-center text-gray-300'>
          {loading ? 'Loading…' : ''}
        </div>
      )}
    </div>
  );
}
