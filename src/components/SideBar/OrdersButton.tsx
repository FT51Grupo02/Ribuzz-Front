'use client';
import React, { useState, useEffect } from 'react';
import { fetchUsers } from '@/helpers/user.helper';
import { fetchOrders } from '@/helpers/orders.helper';
import { useAuth } from '@/components/Context/AuthContext';

const FetchOrdersButton: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (user) {
        try {
          // Obtén todos los usuarios
          const allUsers = await fetchUsers();
          
          // Encuentra el usuario específico por ID
          const currentUser = allUsers.find((u: any) => u.id === user.id);
          
          if (currentUser && Array.isArray(currentUser.orders)) {
            setOrders(currentUser.orders);
          } else {
            console.error('Usuario no encontrado o sin órdenes.');
          }
        } catch (error) {
          console.error('Error al obtener los usuarios o las órdenes:', error);
        }
      }
    };

    fetchUserOrders();
  }, [user]);

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
      {/* Botón para obtener órdenes */}
      <button onClick={() => { /* Lógica para recargar órdenes */ }}>
        Fetch Orders
      </button>

      {/* Lista de órdenes */}
      <div>
        {orders.length > 0 && (
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                <button onClick={() => handleFetchOrderDetails(order.id)}>
                  Orden ID: {order.id}
                </button>
                <p>Nombre: {order.name}</p>
                <p>Email: {order.email}</p>
                <p>Fecha: {new Date(order.date).toLocaleDateString()}</p>
                {order.photo && (
                  <img src={order.photo} alt={`Foto de ${order.name}`} />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Detalles de la orden seleccionada */}
      {selectedOrderDetails && (
        <div>
          <h3>Detalles de la Orden:</h3>
          <p>ID: {selectedOrderDetails.id}</p>
          <p>Fecha: {new Date(selectedOrderDetails.date).toLocaleDateString()}</p>
          <p>Pago: {selectedOrderDetails.pay ? selectedOrderDetails.pay : 'No pagado'}</p>
          {/* Aquí puedes agregar más detalles específicos de la orden */}
        </div>
      )}
    </div>
  );
};

export default FetchOrdersButton;