import { useState, useMemo } from 'preact/hooks';
import { SortModal, FilterModal } from './';
import { SORT_OPTIONS } from '@libs/values.ts';

import { ArrowDown, Sort } from '@plott-life/ui/components/icons';

interface FiltersProps {
}

export default function Filters(props: FiltersProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const sortValue = params.get('sort');
  const hasBedroom = params.has('bedrooms');
  const hasBathroom = params.has('bathrooms');
  const hasMin = params.has('minRentFeePerWeek');
  const hasMax = params.has('maxRentFeePerWeek');

  const hasSort = !!sortValue;
  const hasFilter = hasBedroom || hasBathroom || hasMin || hasMax;

  const sortLabel = useMemo(() => {
    if (!sortValue) {
      return '기본순';
    }
    const found = SORT_OPTIONS.find(option => option.value === sortValue);
    return found ? found.label : '기본순';
  }, [sortValue]);

  const handleSortChange = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort', value);
    window.location.href = url.toString();
  };

  return (
    <>
      <button
        className={`btn btn-sm border-gray-300 text-gray-900 border-1 px-2.5 gap-0.5
          ${hasSort ? 'border-gray-900 bg-gray-50 body4' : 'border-gray-200 bg-white body6'}
        `}
        onClick={() => setIsSortOpen(true)}
      >
        <Sort
          viewBox='0 0 24 24'
          className={'size-6'}
        />
        {sortLabel}
      </button>
      <button
        className={`btn btn-sm border-gray-300 text-gray-900 border-1
          ${hasFilter ? 'border-gray-900 bg-gray-50 body4' : 'border-gray-200 bg-white body6'}
        `}
        onClick={() => setIsFilterOpen(true)}
      >
        필터
        <ArrowDown
          viewBox='0 0 24 24'
          className={'size-3'}
        />
      </button>
      <SortModal
        isOpen={isSortOpen}
        sortValue={sortValue}
        handleSortChange={handleSortChange}
        onClose={() => setIsSortOpen(false)}
      />
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </>
  );
}
