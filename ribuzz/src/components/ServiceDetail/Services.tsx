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

export interface ProviderInfo {
    name: string;
    contact: string;
}

export interface ServiceProps {
    name: string;
    description: string;
    images: string[];
    videos?: string[];
    providerInfo?: ProviderInfo;
    details?: string[];
    reviews?: Review[];
    price: number;
    stock: number;  // Propiedad agregada
}

const Service: FC<ServiceProps> = ({
    name,
    description,
    images = [],
    videos = [],
    providerInfo = { name: '', contact: '' },
    details = [],
    reviews = [],
    price,
    stock,  // Propiedad agregada
}) => {
    const { addToCart } = useCart();
    const router = useRouter();
    
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

    const handleAddToCart = () => {
        const serviceToAdd = {
            name,
            price,
            image: images[0], 
            description,
            categoryId: 0,  // Placeholder, cambiar si es necesario
            id: Date.now(),  // Placeholder, cambiar si es necesario
            stock,  // Propiedad agregada
            quantity: 1  // Añadida con valor predeterminado
        };

        addToCart(serviceToAdd);
        router.push('/cart');
    };

    const openModal = (image: string) => {
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedImage(null);
        setIsModalOpen(false);
    };

    const handleAddComment = () => {
        if (selectedRating && comment) {
            const newReview: Review = {
                username: 'Anónimo',
                comment: comment,
                rating: selectedRating
            };
            reviews.push(newReview);
            setComment('');
            setSelectedRating(0);
        }
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
            <div className="relative z-10 p-8 bg-black bg-opacity-80 rounded-lg shadow-lg max-w-5xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="lg:w-3/5">
                        <h1 className="text-4xl font-bold mb-8 text-cyan-400">{name}</h1>
                        <p className="mb-8 text-lg leading-relaxed">{description}</p>
                        <div className="mb-8">
                            <div className="relative w-full h-auto min-h-[400px] sm:min-h-[600px] lg:min-h-[600px]">
                                {videos.length > 0 && (
                                    <video controls className="absolute inset-0 w-full h-1/2 object-cover rounded-lg">
                                        <source src={videos[0]} type="video/mp4" />
                                    </video>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 h-1/2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:grid-cols-4 gap-4 p-2">
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
                        <h2 className="text-3xl font-semibold mb-4 text-cyan-400">Proveedor:</h2>
                        <p className="mb-4 text-lg"><strong>Nombre:</strong> {providerInfo.name || 'No disponible'}</p>
                        <p className="mb-8 text-lg"><strong>Contacto:</strong> {providerInfo.contact || 'No disponible'}</p>
                        {details?.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-3xl font-semibold mb-4 text-cyan-400">Detalles:</h2>
                                <ul className="list-disc list-inside pl-6 text-lg space-y-2">
                                    {details.map((option, idx) => (
                                        <li key={idx}>{option}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="mb-8">
                            <h2 className="text-3xl font-semibold text-cyan-400 mb-4">Reseñas:</h2>
                            <div className="flex flex-col">
                                <div className="flex-grow">
                                    <ul className="space-y-6">
                                        {reviews.map((review, idx) => (
                                            <li key={idx} className="bg-opacity-80 bg-gradient-to-r from-cyan-700 to-cyan-500 p-6 rounded-lg hover:scale-105 transition duration-300">
                                                <p className="text-lg"><strong>{review.username}:</strong></p>
                                                <p className="text-lg mb-2">{review.comment}</p>
                                                <StarRating rating={review.rating} onChange={() => {}} /> {/* Placeholder para onChange */}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex items-center gap-6 mt-8 md:justify-center">
                                    <p className="text-white text-lg py-2 px-4 font-bold">
                                        Precio: ${price}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleAddToCart} 
                                        className="w-full sm:w-2/3 lg:w-1/2 p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-700 shadow-md hover:shadow-lg transition-shadow text-sm md:text-base"
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

                <div className="">
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

            {isModalOpen && selectedImage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="relative w-full max-w-3xl">
                        <Image
                            src={selectedImage}
                            alt="Selected Image"
                            layout="responsive"
                            width={1200}
                            height={800}
                            className="rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={closeModal}
                            className="absolute top-2 right-2 bg-black text-white p-2 rounded-full shadow-lg"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Service;
