import { useState, useEffect } from 'preact/hooks';
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  RangeSlider,
} from '@components/common';

interface FilterModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

interface Option {
  label: string;
  value: number;
}

const MIN_PRICE = 300000;
const MAX_PRICE = 2000000;
const bedroomOptions: Option[] = [
  { label: '1개', value: 1 },
  { label: '2개', value: 2 },
  { label: '3개', value: 3 },
  { label: '4개+', value: 10 },
];
const bathroomOptions: Option[] = [
  { label: '1개', value: 1 },
  { label: '2개', value: 2 },
  { label: '3개+', value: 10 },
];

export default function FilterModal(props: FilterModalProps) {
  const { isOpen, onRequestClose } = props;

  const [bedroom, setBedroom] = useState<number[]>([]);
  const [bathroom, setBathroom] = useState<number[]>([]);
  const [price, setPrice] = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const params = new URLSearchParams(window.location.search);

    const bedrooms = params.get('bedrooms')
      ? params.get('bedrooms')!.split(',').map((v) => Number(v))
      : [];
    const bathrooms = params.get('bathrooms')
      ? params.get('bathrooms')!.split(',').map((v) => Number(v))
      : [];
    const min = Number(params.get('minRentFeePerWeek') ?? MIN_PRICE);
    const max = Number(params.get('maxRentFeePerWeek') ?? MAX_PRICE);

    setBedroom(bedrooms.filter((v) => !isNaN(v)));
    setBathroom(bathrooms.filter((v) => !isNaN(v)));
    setPrice([min, max]);
  }, [isOpen]);

  const toggleOption = (
    list: number[],
    value: number,
    setter: (val: number[]) => void
  ) => {
    if (list.includes(value)) {
      setter(list.filter((v) => v !== value));
    } else {
      setter([...list, value]);
    }
  };

  const handleResetClick = () => {
    setBedroom([]);
    setBathroom([]);
    setPrice([MIN_PRICE, MAX_PRICE]);
  };

  const handleApplyClick = () => {
    const params = new URLSearchParams(window.location.search);

    if (bedroom.length > 0) {
      params.set('bedrooms', bedroom.join(','));
    } else {
      params.delete('bedrooms');
    }

    if (bathroom.length > 0) {
      params.set('bathrooms', bathroom.join(','));
    } else {
      params.delete('bathrooms');
    }

    // 가격이 기본값이면 삭제
    if (price[0] !== MIN_PRICE || price[1] !== MAX_PRICE) {
      params.set('minRentFeePerWeek', String(price[0]));
      params.set('maxRentFeePerWeek', String(price[1]));
    } else {
      params.delete('minRentFeePerWeek');
      params.delete('maxRentFeePerWeek');
    }

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ''
    }`;

    // TODO: URL 어떻게 처리할지 결정되면 사용
    window.location.href = newUrl.toString();
    // window.history.replaceState({}, '', newUrl);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalHeader className='relative flex items-center w-full border-b border-gray-100'>
        <>
          <span className='absolute left-1/2 -translate-x-1/2 body1 text-gray-900'>
            필터
          </span>
          <button
            className='ml-auto flex items-center cursor-pointer'
            onClick={onRequestClose}
          >
            ✕
          </button>
        </>
      </ModalHeader>

      <ModalContent>
        <div className='px-6 pt-8 pb-14 bg-white'>
          {/* 침실 수 */}
          <div>
            <h3 className='title4 text-gray-900 mb-4'>침실 수</h3>
            <div className='flex flex-wrap gap-2'>
              {bedroomOptions.map((option) => (
                <button
                  key={option.value}
                  className={`h-10 px-5 rounded-full border flex items-center cursor-pointer text-gray-900
                    ${
                    bedroom.includes(option.value)
                      ? 'border-gray-900 bg-gray-50 body4'
                      : 'border-gray-200 bg-white body6'
                  }`}
                  onClick={() =>
                    toggleOption(bedroom, option.value, setBedroom)
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className='w-full h-px bg-gray-300 my-6'></div>
          {/* 욕실 수 */}
          <div>
            <h3 className='title4 text-gray-900 mb-4'>욕실 수</h3>
            <div className='flex flex-wrap gap-2'>
              {bathroomOptions.map((option) => (
                <button
                  key={option.value}
                  className={`h-10 px-5 rounded-full border flex items-center cursor-pointer text-gray-900
                    ${
                    bathroom.includes(option.value)
                      ? 'border-gray-900 bg-gray-50 body4'
                      : 'border-gray-200 bg-white body6'
                  }`}
                  onClick={() =>
                    toggleOption(bathroom, option.value, setBathroom)
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className='w-full h-px bg-gray-300 my-6'></div>
          {/* 가격 범위 */}
          <div>
            <h3 className='title4 text-gray-900 mb-4'>가격 범위</h3>
            <p className='body3 text-gray-900 mb-7'>월 임대료 기준</p>
            <div className='relative w-full'>
              <RangeSlider
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={100000}
                initialMin={price[0]}
                initialMax={price[1]}
                onChange={(val) => setPrice(val)}
              />
            </div>
          </div>
        </div>
      </ModalContent>

      <ModalFooter>
        <div className='bg-white border-t w-full border-gray-300 py-3 px-6 flex justify-between items-center'>
          <div className='flex flex-col'>
            <span
              className='body5 text-gray-600 underline cursor-pointer'
              onClick={handleResetClick}
            >
              전체 해제
            </span>
          </div>
          <button
            className='w-[120px] rounded-lg btn btn-lg bg-gray-900 body2 text-white'
            onClick={handleApplyClick}
          >
            적용
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
