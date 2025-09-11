import { useState } from 'preact/hooks';
import {
  SortModal,
  FilterModal,
} from "@components/search";

// import IconArrowDown from '@plott-life/ui/icons/arrow-down.svg';
// import IconSort from '@plott-life/ui/icons/sort.svg';

interface FiltersProps {
}

export default function Filters(props: FiltersProps) {

  const [isSortOpen, setIsSortOpen] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <button className="btn btn-sm bg-white border-gray-300 text-gray-900">
        {/*<IconSort/>*/}
        기본순
      </button>
      <button className="btn btn-sm bg-white border-gray-300 text-gray-900">
        필터
        {/*<IconArrowDown/>*/}
      </button>
      <SortModal
        isOpen={isSortOpen}
        onRequestClose={() => setIsSortOpen(false)}
      />
    </>
  );
}
