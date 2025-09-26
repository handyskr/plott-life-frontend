import { useEffect, useRef } from 'preact/hooks';
import { Plus } from '@plott-life/ui/components/icons';

export default function FloatingButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (buttonRef.current) {
            if (currentScrollY > lastScrollY.current) {
              buttonRef.current.style.transform = 'translateY(300%)';
            } else {
              buttonRef.current.style.transform = 'translateY(0)';
            }
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      data-chat-open
      data-chat-type={'host'}
      className='fixed bottom-20 right-[calc(max((100vw-var(--max-width))/2+24px,24px))]  bg-gray-900 pl-4 pr-[22px] rounded-full body5 text-white btn border-none shadow-[0_8px_15px_0_rgba(0,0,0,0.2)] pb-(--bait) transition-transform duration-500 ease-in-out'
    >
      <Plus />방 등록하기
    </button>
  );
}
