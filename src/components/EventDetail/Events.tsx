'use client';

import React, { FC, useState, useRef } from 'react';
import Image from 'next/image';
import { useCart } from '../Context/CartContext';
import { useRouter } from 'next/navigation';
import StarRating from '@/components/StarRating/StarRating';
import { Review, ProviderInfo as ProviderInfoType, Event } from '@/components/Cards/types';

const EventComponent: FC<Event> = ({
    name,
    description,
    images = [],
    videos = [],
    ProviderInfo,
    reviews = [],
    price,
    location,
    date,
    time = [],
    stock = 0,
}) => {
    const { addToCart } = useCart();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [comment, setComment] = useState('');
    const [userReviews, setUserReviews] = useState<Review[]>(reviews);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleAddToCart = () => {
        const eventToAdd = {
            name,
            price: price * quantity,
            image: images[0],
            description,
            categoryId: 0,
            id: Date.now(),
            quantity,
            stock,
        };

        addToCart(eventToAdd);
        router.push('/cart');
    };

    const handleAddComment = () => {
        if (comment.trim() && selectedRating > 0) {
            const newReview: Review = { username: 'Anónimo', comment: comment.trim(), rating: selectedRating };
            setUserReviews((prevReviews) => [...prevReviews, newReview]);
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
        <div className="relative w-full h-full min-h-screen bg-black text-white flex items-center justify-center">
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
          <div className="relative z-10 p-4 sm:p-8 bg-black bg-opacity-80 rounded-lg shadow-lg max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
              <div className="lg:w-3/5">
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-cyan-400 text-center lg:text-left">{name}</h1>
                <p className="mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed text-center lg:text-left">{description}</p>
    
                <div className="mb-6 sm:mb-8">
                  <div className="relative w-full h-auto min-h-[300px] sm:min-h-[400px] lg:min-h-[600px]">
                    {videos.length > 0 && (
                      <video controls className="absolute inset-0 w-full h-1/2 object-cover rounded-lg">
                        <source src={videos[0]} type="video/mp4" />
                      </video>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 grid grid-cols-4 sm:grid-cols-4 gap-2 p-2">
                      {images.length > 0 &&
                        images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative w-full h-full mt-2 hover:scale-105 transition duration-300 cursor-pointer"
                            onClick={() => openModal(img)} 
                          >
                            <Image
                              src={img}
                              alt={`Event Image ${idx + 1}`}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-lg"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
    
                <div className="mt-6 sm:mt-8">
                  <div className="flex flex-col sm:flex-row items-start max-sm:items-center justify-between mb-4">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 text-center sm:text-left">Dejanos tu opinión:</h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 max-sm:items-center">
                      <StarRating rating={selectedRating} onChange={setSelectedRating} />
                    </div>
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-4 mb-4 rounded-lg bg-black text-white border border-cyan-800 bg-opacity-80"
                    rows={4}
                    placeholder="Escribe tu comentario aquí..."
                  />
                  <button
                    type="button"
                    onClick={handleAddComment}
                    className="w-full p-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-lg hover:bg-gradient-to-l transition duration-300"
                  >
                    <span className="inline-block text-white hover:scale-110 transition duration-300">
                      Enviar mensaje
                    </span>
                  </button>
                </div>
              </div>
              
              <div className="lg:w-2/5">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-cyan-400 text-center lg:text-left">Locación:</h2>
                <p className="mb-4 text-base sm:text-lg text-center lg:text-left"><strong>Ubicación:</strong> {location}</p>
                <p className="mb-4 text-base sm:text-lg text-center lg:text-left"><strong>Fecha:</strong> {date}</p>
                <p className="mb-6 text-base sm:text-lg text-center lg:text-left"><strong>Horario:</strong> {time.join(', ')}</p>
    
                <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-cyan-400 text-center lg:text-left mt-10">Organizador:</h2>
                <p className="mb-4 text-base sm:text-lg text-center lg:text-left"><strong>Nombre:</strong> {ProviderInfo.name}</p>
                <p className="mb-6 text-base sm:text-lg text-center lg:text-left"><strong>Contacto:</strong> {ProviderInfo.contact}</p>
    
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-cyan-400 text-center lg:text-left mt-10">Reseñas:</h2>
                  <div className="flex flex-col">
                    <div className="flex-grow">
                      <ul className="space-y-4 sm:space-y-6">
                        {userReviews.map((review, idx) => (
                          <li key={idx} className="bg-opacity-50 bg-gradient-to-r from-cyan-700 to-cyan-500 p-4 rounded-lg hover:scale-105 transition duration-300">
                            <p className="text-base sm:text-lg"><strong>{review.username}:</strong> {review.comment}</p>
                            <StarRating rating={review.rating} onChange={() => {}} />
                          </li>
                        ))}
                      </ul>
                    </div>
    
                    <div className="mt-10 sm:mt-8 mb-4 p-4 rounded-lg shadow-lg border border-transparent border-cyan-800">
                      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-white text-center ">Comprar tickets:</h2>
                      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                        <p className="text-base sm:text-lg text-center">Stock: <span className="font-semibold">{stock}</span></p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                            className="px-4 py-2 bg-cyan-600 text-white rounded-md shadow-md hover:bg-cyan-400 transition duration-300"
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            min="1" 
                            max={Math.min(stock, 5)}
                            value={quantity} 
                            onChange={(e) => setQuantity(Math.min(Math.max(Number(e.target.value), 1), 5))} 
                            className="w-20 px-2 py-1 text-black text-center rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300"
                          />
                          <button
                            type="button"
                            onClick={() => setQuantity((prev) => Math.min(prev + 1, stock))}
                            className="px-4 py-2 bg-cyan-600 text-white rounded-md shadow-md hover:bg-cyan-400 transition duration-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
    
                      <div className="flex items-center gap-3 sm:gap-6 mt-8 md:justify-center max-sm:justify-center">
                        <p className="text-white text-base sm:text-lg font-bold">
                          Total: ${price * quantity}
                        </p>
                        <button
                          type="button"
                          onClick={handleAddToCart}
                          className="p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-cyan-700 to-cyan-500 shadow-md hover:shadow-lg transition-shadow text-sm sm:text-base"
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
            </div>
          </div>
          {isModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
              onClick={closeModal}
            >
              <div
                className="relative w-11/12 max-w-3xl bg-black rounded-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-white text-5xl"
                  onClick={closeModal}
                >
                  &times;
                </button>
                <Image
                  src={selectedImage!}
                  alt="Selected Event Image"
                  layout="responsive"
                  width={800}
                  height={600}
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      );
    };

export default EventComponent;
