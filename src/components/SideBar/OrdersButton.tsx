'use client';
import { useState } from 'react';
import { FaBox } from 'react-icons/fa';
import { fetchOrders, fetchOrderDetails } from '@/helpers/orders.helper'; // Asegúrate de tener esta función en helpers
import { useAuth } from '@/components/Context/AuthContext';
import Swal from 'sweetalert2';

const FetchOrdersButton: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchOrders = async () => {
    if (!user?.id) {
      setError('Falta información de autenticación.');
      Swal.fire('Error', 'Falta información de autenticación.', 'error');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchOrders(user.id);
      console.log('Órdenes obtenidas:', data); // Log de las órdenes obtenidas
      setOrders(data);
      Swal.fire('Éxito', 'Órdenes obtenidas exitosamente.', 'success');
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      setError('Error al obtener las órdenes');
      Swal.fire('Error', 'Error al obtener las órdenes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetails = async (orderId: string) => {
    try {
      const orderDetails = await fetchOrderDetails(orderId);
      setSelectedOrder(orderDetails);
    } catch (error) {
      console.error('Error al obtener detalles de la orden:', error);
      Swal.fire('Error', 'Error al obtener detalles de la orden.', 'error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <button
        onClick={handleFetchOrders}
        className="flex text-xl hover:text-pink-400 cursor-pointer mb-4"
        disabled={loading}
      >
        <FaBox className="flex text-xl mr-2" />
        {loading ? 'Cargando...' : 'Mis Órdenes'}
      </button>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {orders.length === 0 && !loading && <p className="text-gray-500 text-center mb-4">Todavía no hay órdenes.</p>}
      <ul className="list-disc text-center">
        {orders.map(order => (
          <li key={order.id} onClick={() => handleViewOrderDetails(order.id)} className="cursor-pointer">
            {order.date} - {order.id}
          </li>
        ))}
      </ul>

      {selectedOrder && (
        <div className="mt-6">
          <h3>Detalles de la Orden</h3>
          <p>ID: {selectedOrder.id}</p>
          <p>Fecha: {selectedOrder.date}</p>
          <p>Detalles:</p>
          <p>Total: {selectedOrder.Details.total}</p>
          <p>Productos:</p>
          <ul>
            {selectedOrder.Details.products.map((item: any) => (
              <li key={item.id}>
                {item.name} - {item.price}
              </li>
            ))}
          </ul>
          <p>Servicios:</p>
          <ul>
            {selectedOrder.Details.service.map((service: any) => (
              <li key={service.id}>
                {service.name} - {service.price}
              </li>
            ))}
          </ul>
          <p>Eventos:</p>
          <ul>
            {selectedOrder.Details.events.map((event: any) => (
              <li key={event.id}>
                {event.name} - {event.date} - {event.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FetchOrdersButton;
