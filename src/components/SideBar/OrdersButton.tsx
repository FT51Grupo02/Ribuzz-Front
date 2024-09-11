'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/Context/AuthContext'; // Asegúrate de que esta ruta sea correcta
import { IProduct, IEvent, IService } from '@/interfaces/Types';

export interface IOrderDetail {
    id: string;
    date: string;
    total: number;
    products?: IProduct[];
    events?: IEvent[];
    service?: IService[];
    pay?: any; // Ajusta según el tipo de datos de 'pay'
}

const defaultOrderDetail: IOrderDetail = {
    id: '',
    date: '',
    total: 0,
    products: [],
    events: [],
    service: [],
    pay: null
};

const fetchUserPurchases = async (userId: string): Promise<IOrderDetail[]> => {
    const response = await fetch(`https://ribuzz-backend-ftn4.onrender.com/users/${userId}`);
    const user = await response.json();
    return user.orders || []; 
};

const fetchOrderDetails = async (orderId: string): Promise<IOrderDetail> => {
    const response = await fetch(`https://ribuzz-backend-ftn4.onrender.com/orders/${orderId}`);
    const result = await response.json();
    
    if (Array.isArray(result) && result.length > 0) {
        const details = result[0].Details || {}; 
        return {
            ...defaultOrderDetail,
            ...details 
        };
    }
    
    console.error('No details found for order ID:', orderId);
    return defaultOrderDetail; 
};

const OrderButton = () => {
    const { user } = useAuth(); 
    const [orders, setOrders] = useState<IOrderDetail[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<IOrderDetail>(defaultOrderDetail);
    const [detailsVisible, setDetailsVisible] = useState<boolean>(false);

    useEffect(() => {
        if (user && user.id) {
            fetchUserPurchases(user.id).then(fetchedOrders => {
                setOrders(fetchedOrders); 
            });
        }
    }, [user]);

    const handleViewDetails = async (orderId: string) => {
        const details = await fetchOrderDetails(orderId);
        if (details && details.id) {
            setSelectedOrder(details); 
            setDetailsVisible(true); // Mostrar detalles después de hacer clic
        } else {
            console.error('No details found for order ID:', orderId);
            setSelectedOrder(defaultOrderDetail); 
            setDetailsVisible(true); // Mostrar detalles incluso si no se encontraron
        }
    };

    return (
        <div className="relative bg-transparent rounded-xl mx-auto max-w-4xl p-6">
            <h2 className="text-3xl font-bold mb-4 text-center">Mis Órdenes</h2>
            <ul className="space-y-4">
                {orders.map(order => (
                    <li 
                        key={order.id} 
                        className="relative flex flex-col md:flex-row justify-between items-center py-4"
                    >
                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#C87DAB] to-[#C12886]"></div>
                        <span className="text-lg font-medium text-white z-10">Orden ID: {order.id}</span>
                        <button 
                            onClick={() => handleViewDetails(order.id)}
                            className="bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-2 px-4 rounded-full"
                        >
                            Ver Detalles
                        </button>
                    </li>
                ))}
            </ul>
            
            {!detailsVisible && (
                <div className="mt-6 bg-transparent shadow-md rounded-lg p-4 text-center">
                    <p>Aquí verás tus compras</p>
                </div>
            )}
            
            {detailsVisible && selectedOrder && (
                <div className="mt-6 bg-transparent shadow-md rounded-lg p-4">
                    <h3 className="text-2xl font-bold mb-4">Detalles de la Orden</h3>
                    <p>ID: {selectedOrder.id}</p>
                    <p>Total: ${selectedOrder.total.toFixed(2)}</p>
                    
                    {selectedOrder.products && selectedOrder.products.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-xl font-semibold mb-2">Productos</h4>
                            <ul className="list-disc pl-5">
                                {selectedOrder.products.map(product => (
                                    <li key={product.id} className="mb-2">{product.name} - ${product.price}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {selectedOrder.events && selectedOrder.events.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-xl font-semibold mb-2">Eventos</h4>
                            <ul className="list-disc pl-5">
                                {selectedOrder.events.map(event => (
                                    <li key={event.id} className="mb-2">{event.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {selectedOrder.service && selectedOrder.service.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-xl font-semibold mb-2">Servicios</h4>
                            <ul className="list-disc pl-5">
                                {selectedOrder.service.map(service => (
                                    <li key={service.id} className="mb-2">{service.name} - ${service.price}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderButton;
