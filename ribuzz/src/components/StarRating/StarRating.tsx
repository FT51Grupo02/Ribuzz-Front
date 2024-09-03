import React, { FC } from 'react';

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
}

const StarRating: FC<StarRatingProps> = ({ rating, onChange }) => {
  const handleClick = (value: number) => {
    onChange(value);
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-3xl ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
          onClick={() => handleClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
