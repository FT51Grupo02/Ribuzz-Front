'use client'


// pages/orders.tsx
import { useState, useEffect } from 'react';
import { fetchUserOrders, fetchOrderById, Order } from '../../helpers/orders.helper';

const OrderButton: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderDetails, setOrderDetails] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

    useEffect(() => {
        // Obtén las órdenes del usuario al hacer clic en el botón
        const getOrders = async () => {
            if (userId) {
                setLoading(true);
                const userOrders = await fetchUserOrders(userId);
                setOrders(userOrders);
                setLoading(false);
            }
        };

        getOrders();
    }, [userId]);

    // Obtén los detalles de la orden seleccionada
    const handleFetchOrderDetails = async (orderId: string) => {
        const fetchedOrderDetails = await fetchOrderById(orderId);
        console.log("Fetched Order Details:", fetchedOrderDetails);
        setOrderDetails(fetchedOrderDetails);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>User Orders</h1>
            {orders.length > 0 ? (
                orders.map(order => (
                    <div
                        key={order.id}
                        onClick={() => handleFetchOrderDetails(order.id)}
                        style={{
                            border: '1px solid black',
                            padding: '10px',
                            margin: '10px',
                            cursor: 'pointer',
                        }}
                    >
                        <h2>Order ID: {order.id}</h2>
                        <p>Total: ${order.Details.total}</p>
                    </div>
                ))
            ) : (
                <p>No orders found</p>
            )}

            {orderDetails && (
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid gray' }}>
                    <h2>Order Details for {orderDetails.id}</h2>
                    <p>Date: {orderDetails.date}</p>
                    <p>Payment Status: {orderDetails.pay}</p>
                    <p>Total: ${orderDetails.Details.total}</p>
                    <h3>Products:</h3>
                    <ul>
                        {orderDetails.Details.products.map(product => (
                            <li key={product.id}>
                                {product.name} - ${product.price}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default OrderButton;