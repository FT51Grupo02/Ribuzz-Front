'use client'

import Image from 'next/image';
import { FC, useState, useRef, useEffect } from 'react';
import { useCart } from '../Context/CartContext';
import { useRouter } from 'next/navigation';
import StarRating from '@/components/StarRating/StarRating';
import type { Service as ServiceType, Review, ProviderInfo } from '@/components/Cards/types';

const ServiceDetail: FC<ServiceType> = ({
    id,
    name,
    description,
    images = [],
    videos = [],
    providerInfo,
    details = [],
    reviews = [],
    price,
}) => {
    const { addToCart } = useCart();
    const router = useRouter();

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [currentReviews, setCurrentReviews] = useState<Review[]>(reviews || []);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleAddToCart = () => {
        const serviceToAdd = {
            id,
            name,
            price,
            images,
            description,
            providerInfo,
            details: [],
            stock: 1, // Establecido en 1 para servicios
        };

        addToCart(serviceToAdd);
        router.push('/cart');
    };

    const handleAddComment = () => {
        if (selectedRating && comment) {
            const newReview: Review = {
                username: 'Anónimo',
                comment,
                rating: selectedRating
            };
            setCurrentReviews(prevReviews => [...prevReviews, newReview]);
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

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                closeModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    return (
        <div className="relative w-full h-full min-h-screen bg-black text-white font-poppins">
            <div className="absolute inset-0">
                <Image
                    src="https://res.cloudinary.com/devnzokpy/image/upload/v1725481343/0_gytttz.png"
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
                                                alt={`Service Image ${idx + 1}`}
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
                        <h2 className="text-2xl lg:text-3xl font-semibold mb-4 lg:mb-6 text-pink-400">Proveedor:</h2>
                        {providerInfo ? (
                            <>
                                <p className="mb-4 text-base lg:text-lg"><strong>Nombre:</strong> {providerInfo.name}</p>
                                <p className="mb-6 text-base lg:text-lg"><strong>Contacto:</strong> {providerInfo.contact}</p>
                            </>
                        ) : (
                            <p className="mb-4 text-base lg:text-lg">Información del proveedor no disponible.</p>
                        )}
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
                                        {currentReviews.length > 0 ? (
                                            currentReviews.map((review, idx) => (
                                                <li key={idx} className="bg-opacity-80 bg-gradient-to-r from-[#cc1184] to-[#a80054] p-4 lg:p-6 rounded-lg hover:scale-105 transition duration-300">
                                                    <p className="text-base lg:text-lg"><strong>{review.username}:</strong> {review.comment}</p>
                                                    <StarRating rating={review.rating} onChange={() => {}} />
                                                </li>
                                            ))
                                        ) : (
                                            <p className="text-base lg:text-lg text-white">No hay reseñas disponibles.</p>
                                        )}
                                    </ul>
                                </div>
                                <div className="flex flex-col items-center lg:flex-row lg:items-center gap-4 mt-6 lg:mt-8">
                                    <p className="text-white text-base lg:text-lg py-2 px-4 font-bold">
                                        Precio: ${price}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        className="w-full sm:w-2/3 lg:w-1/2 p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-[#cc1184] to-[#a80054] shadow-md hover:shadow-lg transition-shadow text-sm md:text-base"
                                    >
                                        <span className="inline-block transition duration-300 hover:scale-110">
                                            Solicitar Servicio
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isModalOpen && selectedImage && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
                        <div ref={modalRef} className="relative bg-white p-4 rounded-lg max-w-lg mx-4">
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 bg-gray-700 text-white p-2 rounded-full"
                            >
                                X
                            </button>
                            <Image
                                src={selectedImage}
                                alt="Enlarged view"
                                layout="responsive"
                                width={1000}
                                height={1000}
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

export default ServiceDetail;
