import { GetUserById } from '@/helpers/user.helper';
import { fetchOrders } from '@/helpers/orders.helper';
import React, { useState } from 'react';
import { useAuth } from '@/components/Context/AuthContext';

const FetchOrdersButton: React.FC = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);

  const handleFetchOrders = async () => {
    if (user && token) {
      try {
        const userData = await GetUserById(
          user.id, 
          { name: user.name, email: user.email, password: '' }, // Ajusta esto según sea necesario
          token, 
          [] // Asumiendo que no tienes órdenes inicialmente
        );
  
        if (userData && Array.isArray(userData.orders)) {
          setOrders(userData.orders);
        }
      } catch (error) {
        console.error('Error al obtener las órdenes:', error);
      }
    }
  };

  const handleFetchOrderDetails = async (orderId: string) => {
    try {
      const orderDetails = await fetchOrders(orderId);
      setSelectedOrderDetails(orderDetails);
    } catch (error) {
      console.error('Error al obtener los detalles de la orden:', error);
    }
  };

  return (
    <div>
      <button onClick={handleFetchOrders}>
        Fetch Orders
      </button>

      <div>
        {orders.length > 0 && (
          <ul>
            {orders.map(order => (
              <li key={order.id}>
                <button onClick={() => handleFetchOrderDetails(order.id)}>
                  Orden ID: {order.id}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedOrderDetails && (
        <div>
          <h3>Detalles de la Orden:</h3>
          <p>ID: {selectedOrderDetails.id}</p>
          <p>Fecha: {selectedOrderDetails.date}</p>
          <p>Pago: {selectedOrderDetails.pay ? selectedOrderDetails.pay : 'No pagado'}</p>
        
        </div>
      )}
    </div>
  );
};

export default FetchOrdersButton;