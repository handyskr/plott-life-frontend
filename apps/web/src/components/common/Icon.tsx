// import IconTv from '@plott-life/ui/icons/tv.svg';
// import IconWifi from '@plott-life/ui/icons/wifi.svg';
// import IconAircon from '@plott-life/ui/icons/aircon.svg';
// import IconWasher from '@plott-life/ui/icons/washer.svg';
//
// export type IconProps = {
//   code: 'tv' | 'wifi' | 'aircon' | 'washer';
//   size?: number;
//   className?: string;
// };
//
// const icons = {
//   tv: IconTv,
//   wifi: IconWifi,
//   aircon: IconAircon,
//   washer: IconWasher,
// };
//
// export default function Icon({ code, size = 24, className = '' }: IconProps) {
//   const SvgIcon = icons[code];
//
//   if (!SvgIcon) {
//     return null;
//   }
//
//   return (
//     <span
//       className={`inline-flex items-center justify-center`}
//       style={{ width: size, height: size }}
//     >
//       <SvgIcon width={size} height={size} className={className} />
//     </span>
//   );
// }
