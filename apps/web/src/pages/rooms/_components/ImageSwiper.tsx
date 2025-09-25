import { useEffect, useRef, useState } from 'preact/hooks';
import Swiper from 'swiper';
import { Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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
  const modalSwiperEl = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainSwiperRef = useRef<Swiper | null>(null);
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

    mainSwiperRef.current = swiper;
    return () => {
      swiper.destroy();
      if (mainSwiperRef.current === swiper) mainSwiperRef.current = null;
    };
  }, [images, hasMoreIcon, onClickIcon]);

  // Modal swiper init when gallery opens
  useEffect(() => {
    if (!isGalleryOpen) return;
    if (!modalSwiperEl.current) return;

    const nextEl = modalContainerRef.current?.querySelector('.modal-next') as HTMLElement | null;
    const prevEl = modalContainerRef.current?.querySelector('.modal-prev') as HTMLElement | null;
    const pagEl = modalContainerRef.current?.querySelector('.modal-pagination') as HTMLElement | null;

    const modalSwiper = new Swiper(modalSwiperEl.current, {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      initialSlide: selectedIndex,
      navigation: nextEl && prevEl ? { nextEl, prevEl } : undefined,
      pagination: pagEl
        ? {
            el: pagEl,
            type: 'fraction',
          }
        : undefined,
    });

    return () => modalSwiper.destroy();
  }, [isGalleryOpen, selectedIndex]);

  // Desktop grid layout (Airbnb style): one large + four small
  const gridImages = images.slice(0, 5);

  return (
    <div class={`relative bg-white w-full aspect-[3/2] lg:aspect-[2/1]`}>
      {/* Overlay: "사진 모두 보기" */}
      <button
        type="button"
        class="hidden lg:inline-flex! absolute right-4 bottom-4 z-10 rounded-md bg-white/90 hover:bg-white shadow px-3 py-1.5 text-sm font-medium"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedIndex(0);
          setGalleryOpen(true);
          onOpenGallery?.();
        }}
      >
        사진 모두 보기
      </button>
      {/* Mobile: Swiper */}
      <div class="lg:hidden">
        <div ref={swiperEl} class='swiper w-full aspect-[4/3]'>
          <div class='swiper-wrapper'>
            {images.map((image, index) => (
              <div key={index} class='swiper-slide'>
                <img
                  src={`${IMAGE_URL}/${image}.webp?w=800`}
                  class='w-full h-full object-cover cursor-pointer'
                  loading="lazy"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(mainSwiperRef.current?.activeIndex ?? index);
                    setGalleryOpen(true);
                    onOpenGallery?.();
                  }}
                />
              </div>
            ))}
          </div>
          <div class='swiper-pagination flex justify-end bottom-0!'></div>
        </div>
      </div>

      {/* Desktop: Grid */}
      <div class="hidden lg:grid! grid-cols-4 grid-rows-2 gap-2 overflow-hidden aspect-[2/1] max-h-[720px]">
        {/* Large image (spans 2x2) */}
        {gridImages[0] && (
          <div class="relative col-span-2 row-span-2">
            <img
              src={`${IMAGE_URL}/${gridImages[0]}.webp?w=1024`}
              class="w-full h-full object-cover cursor-pointer"
              loading="lazy"
              alt="room image"
              onClick={() => {
                setSelectedIndex(0);
                setGalleryOpen(true);
                onOpenGallery?.();
              }}
            />
          </div>
        )}

        {/* Four small images */}
        {gridImages.slice(1, 5).map((img, i) => (
          <div key={i} class="relative">
            <img
              src={`${IMAGE_URL}/${img}.webp?w=800`}
              class="w-full h-full object-cover cursor-pointer"
              loading="lazy"
              alt={`room image ${i + 2}`}
              onClick={() => {
                setSelectedIndex(i + 1);
                setGalleryOpen(true);
                onOpenGallery?.();
              }}
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Gallery Modal */}
      <div
        ref={modalContainerRef}
        class={`fixed inset-0 z-[2000] ${isGalleryOpen ? '' : 'hidden'} bg-black/80 flex items-center justify-center p-4`}
        onClick={() => setGalleryOpen(false)}
      >
        <div
          class="relative w-full max-w-[1200px] max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div class="h-full flex items-center justify-center">
            <div ref={modalSwiperEl} class="swiper w-full max-h-full">
              <div class="swiper-wrapper">
                {images.map((image, idx) => (
                  <div key={idx} class="swiper-slide flex items-center justify-center">
                    <img
                      src={`${IMAGE_URL}/${image}.webp?w=1024`}
                      class="max-h-[80vh] w-auto object-contain rounded-lg"
                      loading="lazy"
                      alt={`room image ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
              <div class="modal-pagination absolute bottom-4 right-6 text-white"></div>
              <button class="modal-prev absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">‹</button>
              <button class="modal-next absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
