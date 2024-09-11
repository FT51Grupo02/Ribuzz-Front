'use client';

import Image from 'next/image';
import { FC, useState, useRef, useEffect } from 'react';
import { useCart } from '../Context/CartContext';
import { useRouter } from 'next/navigation';
import StarRating from '@/components/StarRating/StarRating';
import type { Product as ProductType, Review } from '@/components/Cards/types';
import { ICartProduct } from '@/interfaces/Cart';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ProductDetail: FC<ProductType> = ({
  id,
  name,
  description,
  images = [],
  videos = [],
  sellerInfo,
  details = [],
  reviews = [],
  price,
  stock
}) => {
  const { addToCart } = useCart();
  const router = useRouter();
  const { user, token } = useAuth();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [currentReviews, setCurrentReviews] = useState<Review[]>(reviews || []);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        const productData = response.data;

        setCurrentReviews(productData.reviews);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    const productToAdd: ICartProduct = {
      id,
      name,
      price,
      images: images.slice(0, 1),
      description: description || "", 
      stock: stock || 0,
      categoryId: "", 
      quantity: 1, 
      duration: "", 
      publicationDate: new Date().toISOString(), 
      sellerInfo: sellerInfo || { name: "", contact: "" }, 
      type: "product", 
      categories: []
    };

    addToCart(productToAdd);
    router.push('/cart');
  };

  const handleAddComment = async () => {
    if (!user || !token) {
      Swal.fire({
        title: '¡Inicia sesión para comentar!',
        text: 'Debes estar autenticado para poder dejar un comentario.',
        icon: 'warning',
        confirmButtonText: 'Iniciar sesión',
        confirmButtonColor: '#cc1184',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#a80054',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
      return;
    }
  
    if (selectedRating && comment) {
      const newReview = {
        userId: user.id, 
        productsId: id,
        username: user.name,
        comment: comment,
        rating: selectedRating,
      };
  
      try {
        console.log('Enviando comentario:', newReview);
        const response = await axios.post(`${API_URL}/reviews/products`, newReview, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Respuesta de la API:', response.data);
        setCurrentReviews(prevReviews => [...prevReviews, response.data]);
        setComment('');
        setSelectedRating(0);
      } catch (error) {
        console.error('Error adding comment:', error);
      }
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
          src="https://res.cloudinary.com/devnzokpy/image/upload/v1725918379/0_vh4jdp.webp"
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
            {sellerInfo ? (
              <>
                <p className="mb-4 text-base lg:text-lg"><strong>Nombre:</strong> {sellerInfo.name}</p>
                <p className="mb-6 text-base lg:text-lg"><strong>Contacto:</strong> {sellerInfo.contact}</p>
              </>
            ) : (
              <p className="mb-4 text-base lg:text-lg">Información del vendedor no disponible.</p>
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

        {/* Sección de comentarios */}
        <div className="max-lg:mt-5">
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
            className="w-full p-2 bg-gradient-to-r from-[#cc1184] to-[#a80054] text-white rounded-lg hover:bg-gradient-to-l transition duration-300"
          >
            <span className="inline-block text-white hover:scale-110 transition duration-300">
              Enviar mensaje
            </span>
          </button>
        </div>

        {isModalOpen && selectedImage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div ref={modalRef} className="relative w-full max-w-3xl">
              <div className="relative w-full">
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
                  className="absolute top-2 right-2 text-white p-2 rounded-full"
                >
                  <span className="text-5xl">&times;</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;