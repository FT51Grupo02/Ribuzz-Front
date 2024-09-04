'use client';
import { useState, useContext } from 'react';
import { FaBox } from 'react-icons/fa';
import { fetchOrders } from '@/helpers/orders.helper';
import {  useAuth } from '@/components/Context/AuthContext'; 
import Swal from 'sweetalert2';

const FetchOrdersButton: React.FC = () => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFetchOrders = async () => {
    if (!token || !user?.id) {
      setError('Falta información de autenticación.');
      Swal.fire('Error', 'Falta información de autenticación.', 'error');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchOrders(token, user.id);
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

  return (
    <div className="flex flex-col
     items-center justify-center
     mt-6 ">
      <button
        onClick={handleFetchOrders}
        className="flex text-xl hover:text-pink-400 cursor-pointer mb-4"
        disabled={loading}
      >
        <FaBox className="flex text-xl mr-2" />
        {loading ? 'Cargando...' : 'Mis Ordenes'}
      </button>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {orders.length === 0 && !loading && <p className="text-gray-500 text-center mb-4">Todavía no hay órdenes.</p>}
      <ul className="list-disc text-center">
        {orders.map(order => (
          <li key={order.id}>
            {order.description} - {order.date}
          </li> 
        ))}
      </ul>
    </div>
  );
};

export default FetchOrdersButton;