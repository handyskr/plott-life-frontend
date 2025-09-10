import { useState } from "preact/hooks";
import IconInfo from '@plott-life/ui/icons/info.svg?component';

interface LocationSelectProps {
  locations: string[];
  defaultLocation?: string;
}

export default function LocationSelect(props: LocationSelectProps) {
  const {
    locations,
    defaultLocation = "서울",
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultLocation);

  return (
    <div className='grid grid-cols-2 gap-4'>
      {locations.map((location) => (
        <button
          className='w-full h-12 border-1 border-gray-300 rounded-[10px] text-black text-sm'>{location}</button>
      ))}
    </div>
  );
}
