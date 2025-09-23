import { useEffect, useRef } from 'preact/hooks';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

interface ImageSwiperProps {
  images: string[];
  className?: string;
  hasMoreIcon?: boolean;
  onOpenGallery?: () => void;
  onClickIcon?: () => void;
}

const IMAGE_URL = import.meta.env.PUBLIC_IMAGE_URL;

export default function ImageSwiper({
  images: itemImages,
  className,
  hasMoreIcon = false,
  onOpenGallery,
  onClickIcon,
}: ImageSwiperProps) {
  const swiperEl = useRef<HTMLDivElement>(null);
  const images = itemImages.length > 0 ? itemImages : [
    'null',
    'null',
    'null',
    'null',
    'null',
  ];

  useEffect(() => {
    if (!swiperEl.current) {
      return;
    }

    const swiper = new Swiper(swiperEl.current, {
      modules: [Pagination],
      slidesPerView: 1,
      centeredSlides: true,
      pagination:
        images.length > 1 ? {
          el: '.swiper-pagination',
          type: 'fraction',
          renderFraction: (currentClass, totalClass) => {
            return `
              <div class="inline items-end rounded-sm bg-[rgba(0,0,0,0.5)] px-2 py-1 mb-4 mr-4 caption1 text-white">
                <span class="${currentClass}"></span>
                <span class="swiper-pagination-line">/</span>
                <span class="${totalClass}"></span>
              </div>
            `;
          },
        } : undefined,
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
      class={`relative bg-white cursor-pointer w-full ${className}`}
      onClick={() => onOpenGallery?.()}
    >
      <div ref={swiperEl} class='swiper w-full h-full'>
        <div class='swiper-wrapper'>
          {images.map((image, index) => (
            <div key={index} class='swiper-slide'>
              <img src={`${IMAGE_URL}/${image}.webp?w=800`} class='w-full h-full object-cover' />
            </div>
          ))}
        </div>
        <div class='swiper-pagination flex justify-end bottom-0!'></div>
      </div>
    </div>
  );
}
