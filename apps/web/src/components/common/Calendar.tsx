import { useState } from 'preact/hooks';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

interface CalendarProps {
  startAt?: string;
  endAt?: string;
  onDatesChange?: (start: Dayjs, end: Dayjs) => void;
}

export default function Calendar(props: CalendarProps) {
  const { startAt: startAtParam, endAt: endAtParam, onDatesChange } = props;

  const today = dayjs();

  const [startAt, setStartAt] = useState<Dayjs | null>(
    startAtParam ? dayjs(startAtParam) : null
  );
  const [endAt, setEndAt] = useState<Dayjs | null>(
    endAtParam ? dayjs(endAtParam) : null
  );
  const [activeWeekday, setActiveWeekday] = useState<number | null>(
    startAtParam ? dayjs(startAtParam).day() : null
  );

  const months = Array.from({ length: 6 }, (_, i) => today.add(i, 'month'));

  const handleDateClick = (day: Dayjs) => {
    if (day.isBefore(today, 'day')) {
      return;
    }
    // 선택된 경우 초기화 후 다시 선택
    if (startAt && endAt) {
      setStartAt(day);
      setEndAt(null);
      setActiveWeekday(day.day());
      return;
    }
    // 처음 선택
    if (!startAt) {
      setStartAt(day);
      setActiveWeekday(day.day());
      return;
    }
    // 두 번째 선택 (주 단위)
    if (day.day() !== activeWeekday) {
      return;
    }
    // 두 번째 선택일이 존재하지 않으면 범위 설정
    if (!endAt) {
      const [start, end] = day.isBefore(startAt, 'day') ? [day, startAt] : [startAt, day];

      setStartAt(start);
      setEndAt(end);

      if (onDatesChange) {
        onDatesChange(start, end);
      }
    }
  };

  const isCellDisabled = (day: Dayjs) => {
    if (day.isBefore(today, 'day')) {
      return true;
    }

    if (startAt && !endAt && activeWeekday !== null) {
      return day.day() !== activeWeekday;
    }

    return false;
  };

  const isSelected = (day: Dayjs) => {
    return (startAt && day.isSame(startAt, 'day')) || (endAt && day.isSame(endAt, 'day'));
  };

  const isWithinRangeInclusive = (day: Dayjs) => {
    if (!startAt || !endAt) {
      return false;
    }

    return (
      day.isSame(startAt, 'day') ||
      day.isSame(endAt, 'day') ||
      (day.isAfter(startAt, 'day') && day.isBefore(endAt, 'day'))
    );
  };

  const isCellStrike = (day: Dayjs) => {
    // 첫째 날짜가 없을 때
    if (!startAt || endAt) {
      return false;
    }
    // 이전 날짜일 때
    if (!day.isAfter(today, 'day')) {
      return false;
    }
    // 활성 요일과 같은 요일일 때
    if (activeWeekday !== null && day.day() === activeWeekday) {
      return false;
    }
    // 선택 날짜일 때
    if (isSelected(day)) {
      return false;
    }

    return true;
  };

  return (
    <div className='mx-auto px-4 py-6 space-y-8'>
      {months.map((month) => {
        const start = month.startOf('month');
        const end = month.endOf('month');
        const daysInMonth = Array.from(
          { length: end.date() },
          (_, i) => start.add(i, 'day')
        );
        // 해당 월 빈값 채우기
        const blanks = Array.from({ length: start.day() }, () => null);

        return (
          <section key={month.format('YYYY-MM')}>
            <div className='body1 text-center mb-4'>
              {month.format('YYYY년 M월')}
            </div>
            <div className='grid grid-cols-7 gap-y-2'>
              {blanks.map((_, i) => (
                <div key={`blank-${i}`}/>
              ))}
              {daysInMonth.map(day => {
                const disabled = isCellDisabled(day);
                const selected = isSelected(day);
                const inRange = isWithinRangeInclusive(day);
                const isStrike = isCellStrike(day);
                // 시작일일 경우 오른쪽부터, 말일일 경우 왼쪽까지만 채우기
                const baseRangeClass =
                  day.isSame(startAt, 'day')
                  ? 'left-1/2 right-0 bg-gray-200'
                  : day.isSame(endAt, 'day')
                    ? 'left-0 right-1/2 bg-gray-200'
                    : 'left-0 right-0 bg-gray-200';
                // 월이 중간에 바뀌는 경우, 셀 앞뒤로 그라데이션 처리
                const gradientClass =
                  day.date() === day.daysInMonth()
                    ? 'after:content-[""] after:absolute after:top-0 after:right-[-50%] after:w-1/2 after:h-full after:bg-gradient-to-r after:from-gray-200 after:to-transparent'
                    : day.date() === 1
                      ? 'before:content-[""] before:absolute before:top-0 before:left-[-50%] before:w-1/2 before:h-full before:bg-gradient-to-l before:from-gray-200 before:to-transparent'
                      : '';

                const backgroundClass = `absolute top-1/2 -translate-y-1/2 h-10 ${baseRangeClass} ${gradientClass}`;

                return (
                  <div
                    key={day.format('YYYY-MM-DD')}
                    className='relative h-12 flex items-center justify-center'
                  >
                    <div className={inRange ? backgroundClass : ''} />
                    <button
                      disabled={disabled}
                      className={`
                        relative z-1 w-10 h-10 flex items-center justify-center rounded-full
                        ${selected ? ' bg-gray-900 text-white' : ''}
                        ${disabled ? ' text-gray-300 cursor-not-allowed' : ' cursor-pointer hover:bg-gray-900 hover:text-white hover:opacity-80'}
                      `}
                      onClick={() => handleDateClick(day)}
                    >
                      <span className={`${isStrike ? 'line-through text-gray-400' : ''}`}>
                        {day.date()}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
