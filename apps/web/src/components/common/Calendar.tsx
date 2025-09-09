import { useState } from 'preact/hooks';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

export default function Calendar() {
  const today = dayjs();
  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);
  const [activeWeekday, setActiveWeekday] = useState<number | null>(null);

  // 오늘부터 6개월치 달력 데이터 생성
  const months = Array.from({ length: 7 }, (_, i) => today.add(i, 'month'));

  const handleDateClick = (day: Dayjs) => {
    if (day.isBefore(today, 'day')) return; // 오늘 이전은 선택 불가

    if (activeWeekday === null) {
      setSelectedDates([day]);
      setActiveWeekday(day.day());
    } else {
      if (day.day() !== activeWeekday) return; // 다른 요일 무시

      if (selectedDates.length === 1) {
        const newDates = [selectedDates[0], day].sort((a, b) =>
          a.isBefore(b) ? -1 : 1
        );
        setSelectedDates(newDates);
      } else {
        // 이미 두 개 선택된 경우 → 초기화 후 다시 선택
        setSelectedDates([day]);
        setActiveWeekday(day.day());
      }
    }
  };

  const isDisabled = (day: Dayjs) => {
    if (day.isBefore(today, 'day')) {
      return true;
    }

    if (activeWeekday !== null && day.day() !== activeWeekday) {
      return true;
    }

    return false;
  };

  const isSelected = (day: Dayjs) =>
    selectedDates.some(d => d.isSame(day, 'day'));

  const isInRange = (day: Dayjs) => {
    if (selectedDates.length === 2) {
      return (
        day.isAfter(selectedDates[0], 'day') &&
        day.isBefore(selectedDates[1], 'day')
      );
    }
    return false;
  };

  return (
    <>
      <div className="sticky top-0 w-full h-10 border-b-1  bg-white grid grid-cols-7 text-center font-semibold text-gray-500 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map(d => (
          <div>{d}</div>
        ))}
      </div>
      <div className="mx-auto space-y-8">
        {months.map(month => {
          const start = month.startOf('month');
          const end = month.endOf('month');
          const daysInMonth = Array.from(
            {length: end.date()},
            (_, i) => start.add(i, 'day')
          );

          // 첫 주 시작 전 공백 채우기
          const blanks = Array.from({length: start.day()}, () => null);

          return (
            <div>
              <div className="text-center font-bold text-lg mb-2">
                {month.format('YYYY년 M월')}
              </div>


              <div className="grid grid-cols-7 gap-1">
                {blanks.map(() => (
                  <div></div>
                ))}

                {daysInMonth.map(day => {
                  const disabled = isDisabled(day);
                  const selected = isSelected(day);
                  const inRange = isInRange(day);

                  return (
                    <button
                      onClick={() => handleDateClick(day)}
                      disabled={disabled}
                      className={`
                      w-10 h-10 flex items-center justify-center rounded-full
                      ${disabled ? 'text-gray-300 cursor-not-allowed' : ''}
                      ${selected ? 'bg-blue-500 text-white font-bold' : ''}
                      ${inRange ? 'bg-gray-200' : ''}
                      ${!disabled && !selected && !inRange ? 'hover:bg-gray-100' : ''}
                    `}
                    >
                      {day.date()}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
