import { useState } from 'preact/hooks';
import {Calendar, LocationSelect} from '@components/common';
import IconInfo from '@plott-life/ui/icons/info.svg';

interface SearchWrapperProps {
  locations: string[];
  defaultLocation?: string;
}

export default function SearchWrapper(props: SearchWrapperProps) {
  const {
    locations,
    defaultLocation = '서울',
  } = props;

  const [isOpenLocation, setIsOpenLocation] = useState(true);
  const [isOpenCalendar, setIsOpenCalendar] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  return (
    <>
      {/* 헤더, 푸터, 간격 */}
      <div className='flex flex-col h-[calc(100vh-64px-74px)]'>
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
              <LocationSelect locations={locations}/>
              <div className='w-full h-px bg-gray-300 my-6 mb-4'></div>
              <div className='flex items-center mb-2'>
                <p className='mx-1.5 body5 text-gray-500'>원하는 지역이 없나요?</p>
                <a alt='문의하기' className='body5 text-gray-900 underline'>
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
              <p className='body2 text-gray-900'>서울</p>
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
                <Calendar/>
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
              <p className='body2 text-gray-900'>선택</p>
            </div>
          )}
        </div>
      </div>
      <nav
        slot='footer'
        className='sticky bottom-0 bg-white border-t border-gray-300 py-3 px-6 flex justify-between items-center'
      >
        <div>
          <span className='body5 text-gray-600 underline'>
            전체 삭제
          </span>
        </div>
        <button
          id='btn-search'
          className='w-[120px] rounded-lg btn btn-lg btn-primary body2'
        >
          검색
        </button>
      </nav>
    </>
  );
}
