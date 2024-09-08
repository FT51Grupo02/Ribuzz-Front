'use client'
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/Context/AuthContext'; // Asegúrate de que esta ruta sea correcta
import { IProduct, IEvent, IService } from '@/interfaces/Types';

export interface IOrderDetail {
    id: string;
    date: string;
    total: number;
    products?: IProduct[];
    events?: IEvent[];
    services?: IService[];
    pay?: any; // Ajusta según el tipo de datos de 'pay'
}

// Helper function to fetch user purchases
const fetchUserPurchases = async (userId: string) => {
    const response = await fetch(`https://ribuzz-backend-ftn4.onrender.com/users/${userId}`);
    const user = await response.json();
    console.log('User data:', user); // Log user data
    return user.orders;
};

// Helper function to fetch order details
const fetchOrderDetails = async (orderId: string) => {
    const response = await fetch(`https://ribuzz-backend-ftn4.onrender.com/orders/${orderId}`);
    const details = await response.json();
    console.log('Order details for ID', orderId, ':', details); // Log order details
    return details;
};

const OrderButton = () => {
    const [purchases, setPurchases] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [orderDetails, setOrderDetails] = useState<any>({});
    const [detailsVisible, setDetailsVisible] = useState<string | null>(null);
    const { user } = useAuth(); // Using context to get the user

    useEffect(() => {
        const getPurchases = async () => {
            if (user && user.id) {
                console.log('Fetching purchases for user ID:', user.id); // Log user ID
                const orders = await fetchUserPurchases(user.id);
                console.log('Fetched orders:', orders); // Log orders
                setPurchases(orders);

                // Fetch details for each order
                const detailsPromises = orders.map((order: any) => fetchOrderDetails(order.id));
                const details = await Promise.all(detailsPromises);
                console.log('Fetched details:', details); // Log details

                // Create a dictionary of order details keyed by order ID
                const detailsMap = details.reduce((acc: any, detail: any) => {
                    acc[detail.id] = detail;
                    return acc;
                }, {});

                console.log('Order details map:', detailsMap); // Log details map
                setOrderDetails(detailsMap);
            }
        };

        getPurchases();
    }, [user]);

    const handleViewDetails = (orderId: string) => {
        // Toggle visibility of the order details
        setDetailsVisible(detailsVisible === orderId ? null : orderId);
        if (detailsVisible !== orderId) {
            // Update the selectedOrder only if it's a new order being expanded
            const order = orderDetails[orderId] || null;
            setSelectedOrder(order);
            console.log('Selected order details:', order); // Log the selected order details
        }
    };

    return (
        <div className="relative bg-black bg-opacity-30 rounded-xl mx-auto max-w-4xl p-6">
            <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-6 text-center text-white">Mis Compras</h1>
                <ul className="space-y-4">
                    {purchases.map((order) => (
                        <li
                            key={order.id}
                            className="relative bg-transparent bg-opacity-20 rounded-lg p-4 shadow-md flex flex-col"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-semibold">Orden ID: {order.id}</p>
                                    <p className="text-sm text-gray-600">Fecha: {new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => handleViewDetails(order.id)}
                                    className="ml-4 bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-2 px-4 rounded-full"
                                >
                                    {detailsVisible === order.id ? 'Ocultar Detalles' : 'Ver Detalles'}
                                </button>
                            </div>
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#C87DAB] to-[#C12886]"></span>

                            {detailsVisible === order.id && selectedOrder && (
                                <div className="mt-4 bg-white bg-opacity-80 rounded-lg p-4 shadow-md">
                                    <h2 className="text-2xl font-bold mb-2">Detalles de la Compra</h2>
                                    <h3 className="text-xl font-semibold mt-4">Productos:</h3>
                                    <ul className="space-y-4">
                                        {selectedOrder.products && selectedOrder.products.length > 0 ? (
                                            selectedOrder.products.map((product: any) => (
                                                <li key={product.id} className="flex flex-col md:flex-row items-center border-b border-gray-300 pb-4">
                                                    <div className="flex items-center mb-4 md:mb-0">
                                                        <img
                                                            src={product.images[0] || ''} // Displaying only the first image
                                                            alt={product.name}
                                                            className="w-16 h-16 object-cover rounded-lg mr-4"
                                                        />
                                                        <div>
                                                            <h4 className="text-lg font-semibold">{product.name}</h4>
                                                            <p className="text-sm text-gray-600">Precio: ${product.price}</p>
                                                            <p className="text-sm text-gray-600">Descripción: {product.description}</p>
                                                            <p className="text-sm text-gray-600">Detalles: {product.details.join(', ')}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-600">No hay productos disponibles.</p>
                                        )}
                                    </ul>
                                    <div className="mt-4">
                                        <p className="text-lg font-semibold">Total: ${selectedOrder.total}</p>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrderButton;