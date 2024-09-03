'use client'

import Image from 'next/image';
import { FC, useState } from 'react';
import { useCart } from '../Context/CartContext';
import { useRouter } from 'next/navigation';
import StarRating from '@/components/StarRating/StarRating';

export interface Review {
  username: string;
  comment: string;
  rating: number;
}

export interface SellerInfo {
  name: string;
  contact: string;
}

export interface ProductProps {
  name: string;
  description: string;
  images: string[];
  videos?: string[];
  sellerInfo?: SellerInfo;
  details?: string[];
  reviews?: Review[];
  price: number;
  stock: number;
}

const Product: FC<ProductProps> = ({
  name,
  description,
  images = [],
  videos = [],
  sellerInfo = { name: 'Desconocido', contact: 'No disponible' },
  details = [],
  reviews = [],
  price,
  stock
}) => {
  const { addToCart } = useCart();
  const router = useRouter(); 

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [currentReviews, setCurrentReviews] = useState<Review[]>(reviews);

  const handleAddToCart = () => {
    const productToAdd = {
      name,
      price,
      image: images[0], 
      description,
      stock,
      categoryId: 0, 
      id: Date.now(),
      quantity: 1 
    };

    addToCart(productToAdd);
    router.push('/cart');
  };

  const handleAddComment = () => {
    if (selectedRating && comment) {
      const newReview: Review = {
        username: 'Anónimo',
        comment: comment,
        rating: selectedRating
      };
      setCurrentReviews([...currentReviews, newReview]);
      setComment('');
      setSelectedRating(0);
    }
  };

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-black text-white">
      <div className="absolute inset-0">
        <Image
          src="/0.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="z-0"
        />
      </div>
      <div className="relative z-10 p-6 lg:p-8 bg-black bg-opacity-80 rounded-lg shadow-lg max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <div className="lg:w-3/5">
            <h1 className="text-3xl lg:text-4xl font-bold mb-6 lg:mb-8 text-pink-500">{name}</h1>
            <p className="mb-6 lg:mb-8 text-base lg:text-lg leading-relaxed">{description}</p>
            <div className="mb-6 lg:mb-8">
              <div className="relative w-full h-auto min-h-[400px] sm:min-h-[600px] lg:min-h-[600px]">
                {videos.length > 0 && (
                  <video controls className="absolute inset-0 w-full h-1/2 object-cover rounded-lg">
                    <source src={videos[0]} type="video/mp4" />
                  </video>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2 p-2">
                  {images.length > 0 && images.map((img, idx) => (
                    <div key={idx} className="relative w-full h-full mt-2 hover:scale-105 transition duration-300">
                      <Image
                        src={img}
                        alt={`Product Image ${idx + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg cursor-pointer"
                        onClick={() => openModal(img)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-2/5">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-4 lg:mb-6 text-pink-400">Vendedor:</h2>
            <p className="mb-4 text-base lg:text-lg"><strong>Nombre:</strong> {sellerInfo.name}</p>
            <p className="mb-6 text-base lg:text-lg"><strong>Contacto:</strong> {sellerInfo.contact}</p>
            {details?.length > 0 && (
              <div className="mb-6 lg:mb-8">
                <h2 className="text-2xl lg:text-3xl font-semibold mb-4 lg:mb-6 text-pink-400">Detalles:</h2>
                <ul className="list-disc list-inside pl-4 lg:pl-6 text-base lg:text-lg space-y-2">
                  {details.map((option, idx) => (
                    <li key={idx}>{option}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mb-6 lg:mb-8">
              <h2 className="text-2xl lg:text-3xl font-semibold mb-4 lg:mb-6 text-pink-400">Reseñas:</h2>
              <div className="flex flex-col">
                <div className="flex-grow">
                  <ul className="space-y-4 lg:space-y-6">
                    {currentReviews.map((review, idx) => (
                      <li key={idx} className="bg-opacity-80 bg-gradient-to-r from-[#cc1184] to-[#a80054] p-4 lg:p-6 rounded-lg hover:scale-105 transition duration-300">
                        <p className="text-base lg:text-lg"><strong>{review.username}:</strong> {review.comment}</p>
                        <StarRating rating={review.rating} onChange={() => {}} /> {/* Provide a dummy onChange handler */}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-center lg:flex-row lg:items-center gap-4 mt-6 lg:mt-8">
                  <p className="text-white text-base lg:text-lg py-2 px-4 font-bold">
                    Stock: {stock} u.
                  </p>
                  <p className="text-white text-base lg:text-lg py-2 px-4 font-bold">
                    Precio: ${price}
                  </p>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full sm:w-2/3 lg:w-1/2 p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-[#cc1184] to-[#a80054] shadow-md hover:shadow-lg transition-shadow text-sm md:text-base"
                  >
                    <span className="inline-block transition duration-300 hover:scale-110">
                      Agregar al carrito
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <div className="flex flex-col sm:flex-row items-start max-sm:items-center justify-between mb-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-pink-500 text-center sm:text-left">Déjanos tu opinión:</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 max-sm:items-center">
              <StarRating rating={selectedRating} onChange={setSelectedRating} />
            </div>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 mb-4 rounded-lg bg-black text-white border border-pink-600 bg-opacity-80"
            rows={4}
            placeholder="Escribe tu comentario aquí..."
          />
          <button
            type="button"
            onClick={handleAddComment}
            className="p-2 bg-gradient-to-r from-[#cc1184] to-[#a80054] text-white rounded-lg hover:bg-gradient-to-l transition duration-300"
          >
            Enviar comentario
          </button>
        </div>
      </div>

      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <Image
            src={selectedImage}
            alt="Selected Image"
            layout="intrinsic"
            width={800}
            height={600}
            className="rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default Product;
