/** @jsxImportSource preact */
import { useState, useRef, useEffect } from "preact/hooks";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  initialMin?: number;
  initialMax?: number;
  onChange?: (range: [number, number]) => void;
}

export default function RangeSlider(props: RangeSliderProps) {
  const {
    min,
    max,
    step = 100000,
    initialMin = min,
    initialMax = max,
    onChange,
  } = props;

  const [minVal, setMinVal] = useState(initialMin);
  const [maxVal, setMaxVal] = useState(initialMax);
  const rangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMinVal(initialMin);
    setMaxVal(initialMax);
  }, [initialMin, initialMax]);

  useEffect(() => {
    if (rangeRef.current) {
      const minPercent = ((minVal - min) / (max - min)) * 100;
      const maxPercent = ((maxVal - min) / (max - min)) * 100;

      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, min, max]);

  const formatValue = (val: number) => `${Math.round(val / 10000)}만`;

  return (
    <div class="relative w-full">
      {/* track */}
      <div class="relative h-[3px] bg-gray-200 rounded">
        <div
          ref={rangeRef}
          class="absolute h-[3px] bg-gray-900 rounded"
        />
      </div>

      {/* left handle */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onInput={(e) => {
          const val = Number((e.target as HTMLInputElement).value);
          if (val <= maxVal - step) {
            setMinVal(val);
            onChange?.([val, maxVal]);
          }
        }}
        class="absolute w-full top-0 h-[3px] bg-transparent appearance-none pointer-events-none"
      />

      {/* right handle */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onInput={(e) => {
          const val = Number((e.target as HTMLInputElement).value);
          if (val >= minVal + step) {
            setMaxVal(val);
            onChange?.([minVal, val]);
          }
        }}
        class="absolute w-full top-0 h-[3px] bg-transparent appearance-none pointer-events-none"
      />

      {/* handles 스타일 */}
      <style>
        {`
        input[type=range]::-webkit-slider-thumb {
          appearance: none;
          pointer-events: auto;
          height: 30px;
          width: 30px;
          border-radius: 30px;
          background: white;
          border: 1px solid #ddd; 
          box-shadow: 0 8px 10px rgba(0,0,0,0.11);
          cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          pointer-events: auto;
          height: 30px;
          width: 30px;
          border-radius: 30px;
          background: white;
          border: 1px solid #ddd;
          box-shadow: 0 8px 10px rgba(0,0,0,0.11);
          cursor: pointer;
        }
        `}
      </style>

      {/* 값 표시 */}
      <div class="flex justify-between mt-8 body6 text-gray-700">
        <span>{formatValue(minVal)}</span>
        <span>{maxVal === max ? `${formatValue(max)}+` : formatValue(maxVal)}</span>
      </div>
    </div>
  );
}
