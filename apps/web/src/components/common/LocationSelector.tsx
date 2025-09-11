import { useState } from "preact/hooks";

interface LocationSelectProps {
  locations: string[];
  selectedLocation?: string | null;
  onLocationChange?: (location: string) => void;
}

export default function LocationSelect(props: LocationSelectProps) {
  const {
    locations,
    selectedLocation,
    onLocationChange,
  } = props;

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {locations.map((location) => {
        const isSelected = selectedLocation === location;

        return (
          <button
            key={location}
            className={`
              w-full h-12 border-1 border-gray-300 rounded-[10px] text-black text-sm cursor-pointer
              ${isSelected ? ' bg-gray-50 border-1 border-gray-900' : ' bg-white hover:bg-gray-50'}
            `}
            onClick={() => {
              if (onLocationChange) {
                onLocationChange(location);
              }
            }}
          >
            {location}
          </button>
        )
      })}
    </div>
  );
}
