/** @jsxImportSource preact */
import { useState, useEffect, useRef } from "preact/hooks";
import { Card } from '@plott-life/ui';

interface Room {
  id: string;
  image: string;
  title: string;
  address: string;
  details: string;
  price: string;
}

interface Props {
  initialRooms: Room[];
  responsive?: boolean;
}

export default function RoomList({ initialRooms, responsive = false }: Props) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms || []);
  const [offset, setOffset] = useState(initialRooms?.length ?? 0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 더미 데이터 생성기
  const generateRooms = (count = 20, start = 0): Room[] =>
    Array.from({ length: count }, (_, i) => ({
      id: `${start + i + 1}`,
      image: `https://placehold.co/400x300?text=Room+${start + i + 1}`,
      title: `테스트 숙소 ${start + i + 1}`,
      address: `서울특별시 중구 테스트로 ${start + i + 1}`,
      details: `침실 1 · 욕실 1 · ${20 + i}m²`,
      price: `₩${(50000 + (start + i) * 1000).toLocaleString()}/주`,
    }));

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      if (rooms.length >= 100) {
        setHasMore(false);
        return;
      }
      const newRooms = generateRooms(20, offset);
      if (newRooms.length === 0) {
        setHasMore(false);
        return;
      }
      setRooms((prev) => [...prev, ...newRooms]);
      setOffset((prev) => prev + newRooms.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '200px 0px',
        threshold: 0,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
    // rooms, hasMore가 변할 때마다 observer 재설정
  }, [rooms, hasMore]);

  const gridCols = responsive ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2';

  return (
    <div className="max-w-[600px] mx-auto">
      <div className={`grid ${gridCols} gap-4`}>
        {rooms.map((room) => (
          <Card
            key={room.id}
            image={room.image}
            title={room.title}
            address={room.address}
            details={room.details}
            price={room.price}
          />
        ))}
      </div>
      {hasMore ? (
        <div ref={loaderRef} className="h-12 flex justify-center items-center text-gray-400">
          Loading…
        </div>
      ) : (
        <div className='h-12 flex justify-center items-center text-gray-400'>더 이상 항목이 없습니다</div>
      )}
    </div>
  );
}
