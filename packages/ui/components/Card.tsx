interface CardProps {
  id: number;
  image: string;
  name: string;
  address: string;
  areaExclusive: number;
  bedrooms: number;
  bathrooms: number;
  rentFeePerWeek: number;
  onClick?: () => void;
}

const IMAGE_URL = import.meta.env.PUBLIC_IMAGE_URL;

export function Card(props: CardProps) {
  const {
    id,
    image,
    name,
    address,
    areaExclusive,
    bedrooms,
    bathrooms,
    rentFeePerWeek,
    onClick,
  } = props;

  // image 추가해줘야함

  return (
    <div role='button' tabIndex={0} className='bg-white rounded-xl cursor-pointer outline-none mb-2' onClick={onClick}>
      <img
        src={`${IMAGE_URL}/sample_${id}.webp?w=300`}
        alt={name}
        className='w-full aspect-square object-cover rounded-xl'
      />
      <div className=''>
        <h3 className='body4 text-gray-900 pt-3 pb-1'>{name}</h3>
        <p className='body6 text-gray-600'>{address}</p>
        <p className='body6 text-gray-600 pt-1 pb-2'>
          침실 {bedrooms} · 욕실 {bathrooms} · {areaExclusive}㎡
        </p>
        <div className='flex'>
          <p className='body4 text-gray-900 mr-1'>₩{(rentFeePerWeek || 0).toLocaleString()}</p>
          <p className='body6 text-gray-900'>/{'주'}</p>
        </div>
      </div>
    </div>
  );
}
