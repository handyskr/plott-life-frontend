import { useState, useEffect } from 'preact/hooks';
import { Calendar, LocationSelect } from '@components/common';

interface BottomNavProps {
}

export default function BottomNav(props: BottomNavProps) {
  const {
  } = props;

  return (
    <>
      <nav
        slot='footer'
        className='sticky bottom-0 bg-white border-t border-gray-300 py-5 px-6 flex justify-between items-center'
      >
        <button
          className='w-full rounded-lg btn btn-primary body2 text-white'
          onClick={() => {

          }}
        >
          계약 요청하기
        </button>
      </nav>
    </>
  );
}
