export type CardProps = {
  image: string;
  title: string;
  address: string;
  details: string;
  price: string;
  // unit: string;
  onClick?: () => void;
};

export function Card({ image, title, address, details, price, onClick }: CardProps) {
  return (
    <div role='button' tabIndex={0} className='bg-white rounded-xl cursor-pointer outline-none mb-2' onClick={onClick}>
      <img src={image} alt={title} className='w-full aspect-square object-cover rounded-xl' />
      <div className=''>
        <h3 className='body4 text-gray-1000 pt-3 pb-1'>{title}</h3>
        <p className='body6 text-gray-700'>{address}</p>
        <p className='body6 text-gray-700 pt-1 pb-2'>{details}</p>
        <div className='flex'>
          <p className='body4 text-gray-1000 mr-1'>{price}</p>
          <p className='body6 text-gray-1000'>/{'주'}</p>
        </div>
      </div>
    </div>
  );
}
