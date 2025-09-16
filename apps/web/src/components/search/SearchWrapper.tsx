import { useState, useEffect } from 'preact/hooks';
import { Calendar, LocationSelect } from '@components/common';

interface SearchWrapperProps {
  locations: string[];
  defaultLocation?: string;
}

export default function SearchWrapper(props: SearchWrapperProps) {
  const {
    locations,
  } = props;

  const [isOpenLocation, setIsOpenLocation] = useState(true);
  const [isOpenCalendar, setIsOpenCalendar] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [startAt, setStartAt] = useState<string | null>(null);
  const [endAt, setEndAt] = useState<string | null>(null);

  const handleResetClick = () => {
    setSelectedLocation(null);
    setStartAt(null);
    setEndAt(null);
  };

  const handleSearchClick = () => {
    const params = new URLSearchParams({
      stateOrCity: selectedLocation ?? "",
      startAt: startAt ?? "",
      endAt: endAt ?? "",
      durationType: "RENT",
    });

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ''
    }`;

    window.history.replaceState({}, '', newUrl);
    window.location.href = `/search/result?${params.toString()}`;
  };

  useEffect(() => {
    const applyQueryParams = () => {
      const searchParams = new URLSearchParams(window.location.search);

      const stateOrCity = searchParams.get('stateOrCity');
      const queryStartAt = searchParams.get('startAt');
      const queryEndAt = searchParams.get('endAt');

      if (stateOrCity) {
        setSelectedLocation(stateOrCity);
      }
      if (queryStartAt) {
        setStartAt(queryStartAt);
      }
      if (queryEndAt) {
        setEndAt(queryEndAt);
      }
    }

    applyQueryParams();

    window.addEventListener('popstate', applyQueryParams);

    return () => {
      window.removeEventListener('popstate', applyQueryParams);
    };
  }, []);

  return (
    <>
      {/* 헤더, 푸터, 간격 */}
      <div className='flex flex-col h-[calc(100dvh-64px-74px-var(--sait))]'>
        {/* 위치 */}
        <div
          className={`
            mx-4 bg-white rounded-2xl px-6 py-4 mb-4 border border-gray-300
            ${isOpenLocation ? 'shadow-[0_12px_30px_0_rgba(0,0,0,0.16)]' : 'shadow-[0_2px_6px_0_rgba(0,0,0,0.08)]'}
          `}
        >
          {isOpenLocation ? (
            <div>
              <div className='mt-2 mb-4'>
                <p className='title3'>위치</p>
              </div>
              <LocationSelect
                locations={locations}
                selectedLocation={selectedLocation}
                onLocationChange={(location: string) => {
                  setSelectedLocation(location);
                  setIsOpenLocation(false);
                  setIsOpenCalendar(true);
                }}
              />
              <div className='w-full h-px bg-gray-300 my-6 mb-4'></div>
              <div className='flex items-center mb-2'>
                <p className='mx-1.5 body5 text-gray-500'>원하는 지역이 없나요?</p>
                {/* TODO: 문의하기 링크 붙여야함 */}
                <a className='body5 text-gray-900 underline'>
                  문의하기
                </a>
              </div>
            </div>
          ) : (
            <div
              className='flex justify-between cursor-pointer'
              onClick={() => {
                setIsOpenCalendar(false);
                setIsOpenLocation(true);
              }}
            >
              <p className='body2 text-gray-400'>위치</p>
              <p className='body2 text-gray-900'>{selectedLocation ? selectedLocation : '선택'}</p>
            </div>
          )}
        </div>
        {/* 이용 기간 */}
        <div
          className={`
            flex flex-col mx-4 bg-white rounded-2xl border right border-gray-300 overflow-auto mb-5
            ${isOpenCalendar ? 'shadow-[0_12px_30px_0_rgba(0,0,0,0.16)]' : 'shadow-[0_2px_6px_0_rgba(0,0,0,0.08)]'}
          `}
        >
          {isOpenCalendar ? (
            <>
              <div className={'sticky top-0 bg-white z-10'}>
                <div className='top-0 mt-6 mb-2 px-6'>
                  <p className='title3'>이용 기간</p>
                </div>
                <div
                  className='grid grid-cols-7 items-center w-full h-10 px-4 border-b-1 border-gray-200  bg-white text-center'>
                  {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                    <p className='body6 text-gray-600'>{d}</p>
                  ))}
                </div>
              </div>
              <div className={'mb-6'}>
                <Calendar
                  startAt={startAt}
                  endAt={endAt}
                  onDatesChange={(startAt, endAt) => {
                    setStartAt((startAt).format('YYYY-MM-DD'));
                    setEndAt((endAt).format('YYYY-MM-DD'));
                  }}
                />
              </div>
            </>
          ) : (
            <div
              className='flex justify-between px-6 py-4 cursor-pointer'
              onClick={() => {
                setIsOpenLocation(false);
                setIsOpenCalendar(true);
              }}
            >
              <p className='body2 text-gray-400'>이용 기간</p>
              <p className='body2 text-gray-900'>{(startAt !== null && endAt !== null) ? `${startAt} ~ ${endAt}` : '선택'}</p>
            </div>
          )}
        </div>
      </div>
      <nav
        slot='footer'
        className='sticky bottom-0 bg-white border-t border-gray-300 py-3 px-6 flex justify-between items-center'
      >
        <span
          className='body5 text-gray-600 underline cursor-pointer'
          onClick={() => {
            handleResetClick();
            setIsOpenCalendar(false);
            setIsOpenLocation(true);
          }}
        >
          전체 삭제
        </span>
        <button
         // UFO query parameter 수정
          className='w-[120px] rounded-lg btn btn-primary body2'
          onClick={handleSearchClick}
        >
          검색
        </button>
      </nav>
    </>
  );
}
