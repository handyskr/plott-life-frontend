/** @jsxImportSource preact */
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { Card } from '@plott-life/ui';

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

interface Props {
  responsive?: boolean;
}

const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;

async function fetchRooms(page: number, size: number): Promise<ApiResponse> {
  const res = await fetch(`${PUBLIC_API_URL}/v1/building-unit?page=${page}&size=${size}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}

export default function RoomList({ responsive = false }: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const PAGE_SIZE = 10;

  // 데이터 로딩
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const data = await fetchRooms(page, PAGE_SIZE);

      setRooms((prev) => [...prev, ...data.items]);
      setPage((prev) => prev + 1);

      if (data.page + 1 >= data.totalPages) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    loadMore();
  }, []);

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

  const gridCols = responsive
    ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    : 'grid-cols-2';

  return (
    <div className="max-w-[600px] mx-auto">
      <div className={`grid ${gridCols} gap-4`}>
        {rooms.map((room) => (
          <Card
            key={room.id}
            id={room.id}
            name={room.name}
            image={room.mainImage ?? '/null.png'}
            address={room.address}
            areaExclusive={room.areaExclusive}
            bedrooms={room.bedrooms}
            bathrooms={room.bathrooms}
            rentFeePerWeek={room.rentFeePerWeek}
            onClick={() => {
              window.location.href = `/rooms/${room.id}`;
            }}
          />
        ))}
      </div>
      {hasMore ? (
        <div
          ref={loaderRef}
          className="h-12 flex justify-center items-center text-gray-300"
        >
          {loading ? 'Loading…' : ''}
        </div>
      ) : (
        <div className="h-12 flex justify-center items-center text-gray-300">
        </div>
      )}
    </div>
  );
}
