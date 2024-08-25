'use client'
import IProduct from '@/interfaces/IProduct'
import { IUserSession } from '@/interfaces/Types';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

const ProductDetail: React.FC<IProduct> = ({ name, image, description, price, stock, id }) => {
    const router = useRouter();
    const [userSession, setUserSession] = useState<IUserSession>();

    useEffect(() => {
        if (typeof window !== "undefined" && window.localStorage) {
            const userData = localStorage.getItem("userSession")
            setUserSession(JSON.parse(userData!))
        }
    }, [])

    const handleClick = () => {
        if (userSession && userSession.token) {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]")
            const productExist = cart.some((product: IProduct) => product.id === id)

            if (productExist) {
                Swal.fire({
                    title: "Ya añadiste este producto a tu carrito",
                    icon: "warning",
                    width: 350,
                    padding: "2em",
                    background: 'rgba(0, 0, 0, 0.9)',
                    color: '#f3f4f6',
                    confirmButtonText: "OK",
                    confirmButtonColor: '#4A1D96',
                    customClass: {
                        confirmButton: 'swal-confirm-button'
                    }
                });
                router.push("/cart")
            } else {
                cart.push({ name, description, image, price, stock, id })
                localStorage.setItem('cart', JSON.stringify(cart))
                Swal.fire({
                    title: "Producto añadido al carrito",
                    icon: "success",
                    width: 350,
                    padding: "2em",
                    background: 'rgba(0, 0, 0, 0.9)', 
                    color: '#f3f4f6',
                    confirmButtonText: "OK",
                    confirmButtonColor: '#4A1D96',
                    customClass: {
                        confirmButton: 'swal-confirm-button'
                    }
                });
                router.push("/cart")
            }

        } else {
            Swal.fire({
                title: "Debes iniciar sesión para agregar productos al carrito",
                icon: "warning",
                width: 350,
                padding: "2em",
                background: 'rgba(0, 0, 0, 0.9)',
                color: '#f3f4f6',
                confirmButtonText: "OK",
                confirmButtonColor: '#4A1D96',
                customClass: {
                    confirmButton: 'swal-confirm-button'
                }
            });
        }
    }

    return (
        <div className="p-6 rounded-lg mr-10 my-10">
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 flex justify-center">
                    <img
                        src={image}
                        alt={name}
                        className="w-full max-w-sm h-80 object-contain"
                    />
                </div>
                <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0">
                    <h2 className="text-3xl font-bold mb-4">{name}</h2>
                    <p className="text-lg mb-4">{description}</p>
                    <div className="flex items-center mb-4">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white mr-4">${price}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Stock: {stock}</span>
                    </div>
                    <div className="flex space-x-4 mt-10">
                        <button
                            onClick={router.back}
                            className="w-full text-white bg-gradient-to-l from-purple-800 to-blue-900 hover:bg-gradient-to-r focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gradient-to-r dark:from-purple-800 dark:to-blue-900 dark:hover:bg-gradient-to-l"
                        >
                            <span className="transition duration-300 hover:scale-110 inline-block">
                            ◀ Ver más productos
                            </span>
                        </button>
                        <button
                            onClick={handleClick}
                            className="w-full text-white bg-gradient-to-r from-purple-900 to-blue-800 hover:bg-gradient-to-l focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gradient-to-r dark:from-purple-900 dark:to-blue-800 dark:hover:bg-gradient-to-l"
                        >
                            <span className="transition duration-300 hover:scale-110 inline-block">
                                Agregar al carrito ▶
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail
