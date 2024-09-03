'use client';

import React, { FC, useState } from 'react';
import Image from 'next/image';
import { useCart } from '../Context/CartContext';
import { useRouter } from 'next/navigation';
import StarRating from '@/components/StarRating/StarRating';
import { Review, ProviderInfo, Event } from '@/components/Cards/types';

const EventComponent: FC<Event> = ({
    name,
    description,
    images = [],
    videos = [],
    providerInfo = { name: 'Desconocido', contact: 'No disponible' },
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

    const handleAddToCart = () => {
        const eventToAdd = {
            name,
            price: price * quantity,
            image: images[0],
            description,
            categoryId: 0, // Establece un valor predeterminado o ajusta según corresponda
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
                                className="p-2 bg-gradient-to-r from-cyan-700 to-cyan-500 text-white shadow-md w-full duration-800 ease-in-out transform rounded-lg"
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
                        <p className="mb-4 text-base sm:text-lg text-center lg:text-left"><strong>Nombre:</strong> {providerInfo.name}</p>
                        <p className="mb-6 text-base sm:text-lg text-center lg:text-left"><strong>Contacto:</strong> {providerInfo.contact}</p>

                        <div className="mb-6 sm:mb-8">
                            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-cyan-400 text-center lg:text-left mt-10">Reseñas:</h2>
                            <div className="flex flex-col">
                                <div className="flex-grow">
                                    <ul className="space-y-4 sm:space-y-6">
                                        {userReviews.map((review, idx) => (
                                            <li key={idx} className="bg-opacity-50 bg-gradient-to-r from-cyan-700 to-cyan-500 p-4 rounded-lg text-white">
                                                <div className="flex items-center mb-2">
                                                    <StarRating rating={review.rating} onChange={() => {}} />
                                                    <span className="ml-2 font-semibold">{review.username}</span>
                                                </div>
                                                <p>{review.comment}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-lg font-semibold">Precio: ${price}</p>
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="mt-4 p-2 bg-gradient-to-r from-cyan-700 to-cyan-500 text-white shadow-md w-full duration-800 ease-in-out transform rounded-lg"
                            >
                                Añadir al carrito
                            </button>
                        </div>
                    </div>
                </div>

                {selectedImage && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
                        onClick={closeModal}
                    >
                        <div className="relative max-w-4xl max-h-full">
                            <Image
                                src={selectedImage}
                                alt="Selected"
                                layout="fill"
                                objectFit="contain"
                                className="rounded-lg"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventComponent;
