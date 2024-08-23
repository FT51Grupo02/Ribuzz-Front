import React from 'react';

interface CardProps {
  name: string;
  price: string;
  image: string;
  rating: number;
  description: string;
}

const Card: React.FC<CardProps> = ({ name, price, image, rating, description }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-xl w-64 h-96 flex flex-col">
      <div className="w-full h-48 flex-shrink-0">
        <img className="w-full h-full object-cover" src={image} alt={name} />
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-black">{name}</h2>
          <p className="text-gray-600 font-semibold mb-2">${price}</p>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.4l2.7 5.4 5.9.9-4.3 4.2 1 5.9-5.4-2.9-5.4 2.9 1-5.9-4.3-4.2 5.9-.9L12 2.4z" />
              </svg>
            ))}
          </div>
        </div>
        <p className="text-black text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Card;
