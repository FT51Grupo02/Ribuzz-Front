import React from 'react';

interface StarRatingProps {
  rating: number;
  onChange: (value: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onChange }) => {
  const handleClick = (value: number) => {
    onChange(value);
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
          style={{ fontSize: '1.5rem' }}
          onClick={() => handleClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
