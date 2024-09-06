import React from 'react';
import { usePathname } from 'next/navigation';
import StarRating from '@/components/StarRating/StarRating';

interface CardProps {
  name: string;
  price: string;
  image: string;
  rating?: number; 
  description: string;
  onClick: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  name,
  price,
  image,
  rating,
  description,
  onClick,
  className
}) => {
  const pathname = usePathname(); 

  const nameColor = pathname === '/products' 
    ? 'text-pink-400' 
    : pathname === '/services' 
    ? 'text-cyan-400' 
    : 'text-white';

  return (
    <div
      className={`cursor-pointer ${className} flex flex-col bg-black bg-opacity-90 text-white rounded-lg shadow-xl overflow-hidden font-poppins`}
      style={{ width: '300px', height: '450px', minHeight: '450px' }}
      onClick={onClick}
    >
      <img
        src={image}
        alt={name}
        className="w-full object-cover rounded-t-lg"
        style={{ height: '200px', minHeight: '200px', objectFit: 'cover' }}
      />
      <div className="flex flex-col p-4 flex-grow">
        <h2
          className={`text-lg font-semibold mb-2 ${nameColor}`}
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%'
          }}
        >
          {name}
        </h2>
        <p
          className="text-gray-100 flex-grow overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxHeight: '7.5em'
          }}
          title={description}
        >
          {description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4">
          <span
            className="text-xl font-bold text-white"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%'
            }}
          >
            ${price}
          </span>
          <StarRating rating={rating || 0} onChange={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default Card;
