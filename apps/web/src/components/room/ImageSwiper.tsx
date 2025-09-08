import { useEffect, useRef } from 'preact/hooks';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

interface ImageSlideSectionProps {
  images: string[];
  width?: string;
  height?: string;
  style?: preact.JSX.CSSProperties;
  hasMoreIcon?: boolean;
  onOpenGallery?: () => void;
  onClickIcon?: () => void;
}

export default function ImageSlideSection({
  images = [],
  width,
  height,
  style,
  hasMoreIcon = false,
  onOpenGallery,
  onClickIcon,
}: ImageSlideSectionProps) {
  const swiperEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!swiperEl.current) {
      return;
    }

    const swiper = new Swiper(swiperEl.current, {
      modules: [Pagination],
      slidesPerView: 1,
      centeredSlides: true,
      pagination:
        images.length > 1
          ? {
              el: '.swiper-pagination',
              type: 'fraction',
              renderFraction: (currentClass, totalClass) => {
                return `
                  <span class="${currentClass}"></span>
                  <span class="swiper-pagination-line"></span>
                  <span class="${totalClass}"></span>
                  ${hasMoreIcon ? `<div class="plus-icon"></div>` : ''}
                `;
              },
            }
          : undefined,
    });

    if (onClickIcon) {
      const paginationWrapper = swiperEl.current.querySelector('.swiper-pagination');
      paginationWrapper?.addEventListener('click', onClickIcon);
      return () => paginationWrapper?.removeEventListener('click', onClickIcon);
    }

    return () => swiper.destroy();
  }, [images, hasMoreIcon, onClickIcon]);

  return (
    <div
      class='relative bg-white cursor-pointer w-full'
      style={{ width, height, ...style }}
      onClick={() => onOpenGallery?.()}
    >
      <div ref={swiperEl} class='swiper w-full h-full'>
        <div class='swiper-wrapper'>
          {images.map((image, index) => (
            <div key={index} class='swiper-slide'>
              <img src={`${image}`} class='w-full h-full object-cover' style={{ height }} />
            </div>
          ))}
        </div>
        <div class='swiper-pagination absolute right-3 bottom-3 flex items-center justify-center overflow-hidden w-auto h-5 rounded bg-[rgba(0,0,0,0.4)] text-[#ccc] text-[11px] font-medium cursor-pointer'></div>
      </div>
    </div>
  );
}
