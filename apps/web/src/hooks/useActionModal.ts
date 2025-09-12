import { useState, useRef, useEffect, useCallback, } from 'preact/hooks';

interface BottomSheetMetrics {
  touchStart: {
    sheetY: number;
    touchY: number;
  };
  touchMove: {
    prevTouchY?: number;
    movingDirection: 'none' | 'down' | 'up';
  };
  isContentAreaTouched: boolean;
}

const SCROLL_BUFFER = 30;
const HANDEL_HEIGHT = 48;
const MIN_Y = 60;

export function useActionModal() {
  const [isClose, setIsClose] = useState<boolean>(false);
  const [sheet, setSheet] = useState<any>(null);
  const [content, setContent] = useState<any>(null);

  console.log(sheet?.current?.getBoundingClientRect());

  const metrics = useRef<BottomSheetMetrics>({
    touchStart: {
      sheetY: 0,
      touchY: 0,
    },
    touchMove: {
      prevTouchY: 0,
      movingDirection: 'none',
    },
    isContentAreaTouched: false,
  });

  const onRefChange = useCallback((node: HTMLDivElement) => {
    if (node) {
      setSheet({ current: node });
    }
  }, []);

  const onContentRefChange = useCallback((node: HTMLDivElement) => {
    if (node) {
      setContent({ current: node });
    }
  }, []);


  const getSheetData = () => {
    return {
      minY: MIN_Y,
      maxY: typeof window !== 'undefined' ? (window.innerHeight * 0.8) + HANDEL_HEIGHT : 0, // 80vh + 손잡이 높이
      sheetHeight: typeof window !== 'undefined' ? window.innerHeight - MIN_Y : 0,
      height: sheet?.current?.getBoundingClientRect().height || 0,
    }
  };

  const reset = () => {
    setIsClose(false);
  };

  const setSheetPosition = (isOpen: boolean) => {
    const {
      minY,
    } = getSheetData();

    if (sheet !== null) {
      const {
        height,
      } = sheet.current.getBoundingClientRect();

      if (isOpen) {
        sheet.current.style.setProperty('transform', `translateY(${minY - height}px)`);
      } else {
        sheet.current.style.setProperty('transform', `translateY(${minY}px)`);
      }
    }
  }

  useEffect(() => {
    const canUserMoveBottomSheet = () => {
      const { touchMove, isContentAreaTouched } = metrics.current;

      if (!isContentAreaTouched) {
        return true;
      }

      if (touchMove.movingDirection === 'down') {
        return content.current.scrollTop <= 0;
      }

      return false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      const { touchStart, touchMove } = metrics.current;

      touchStart.sheetY = sheet.current.getBoundingClientRect().y;
      touchStart.touchY = e.touches[0].clientY;
      touchMove.prevTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const { minY, maxY, height } = getSheetData();
      const { touchStart, touchMove } = metrics.current;
      const currentTouch = e.touches[0];

      if (touchMove.prevTouchY === undefined) {
        touchMove.prevTouchY = touchStart.touchY;
      }

      if (touchMove.prevTouchY < currentTouch.clientY) {
        touchMove.movingDirection = 'down';

        // 30px 기준으로 원복시킬 경우, 안닫는 걸로 판단
        if (Math.abs(currentTouch.clientY - touchMove.prevTouchY) < SCROLL_BUFFER) {
          touchMove.movingDirection = 'up';
        }
      }

      if (touchMove.prevTouchY > currentTouch.clientY) {
        touchMove.movingDirection = 'up';
      }

      if (metrics.current.isContentAreaTouched) {
        return;
      }

      if (canUserMoveBottomSheet()) {
        e.preventDefault();
        const touchOffset = currentTouch.clientY - touchStart.touchY;
        let nextSheetY = touchStart.sheetY + touchOffset;

        const maxDragUpY = minY - height;
        nextSheetY = Math.max(maxDragUpY, nextSheetY - maxY);

        sheet.current.style.transform = `translateY(${nextSheetY}px)`;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      document.body.style.overflowY = 'auto';
      const { touchMove } = metrics.current;

      const { y, height } = sheet.current.getBoundingClientRect();
      const { minY } = getSheetData();

      const windowHeight = window.innerHeight;

      if (touchMove.movingDirection === 'down' && y >= windowHeight - height + SCROLL_BUFFER) {
        setIsClose(true);
        sheet.current.style.setProperty('transform', `translateY(${minY}px)`);
      } else {
        setIsClose(false);
        sheet.current.style.setProperty('transform', `translateY(${minY - height}px)`);
      }

      metrics.current = {
        touchStart: {
          sheetY: 0,
          touchY: 0,
        },
        touchMove: {
          prevTouchY: 0,
          movingDirection: 'none',
        },
        isContentAreaTouched: false,
      };
    };

    const handleContentScroll = () => {
      metrics.current.isContentAreaTouched = true;
    }

    if (sheet !== null) {
      sheet.current.addEventListener('touchstart', handleTouchStart);
      sheet.current.addEventListener('touchmove', handleTouchMove);
      sheet.current.addEventListener('touchend', handleTouchEnd);
      content.current.addEventListener('touchstart', handleContentScroll);

      return () => {
        sheet.current.removeEventListener('touchstart', handleTouchStart);
        sheet.current.removeEventListener('touchmove', handleTouchMove);
        sheet.current.removeEventListener('touchend', handleTouchEnd);
        content.current.removeEventListener('touchstart', handleContentScroll);
      }
    }
  }, [sheet]);

  return {
    isClose,
    sheet,
    getSheetData,
    reset,
    setSheetPosition,
    onRefChange,
    onContentRefChange,
  };
}
