'use client';
import { useState } from 'react';
import { FaBox } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchOrders } from '@/helpers/orders.helper';

const FetchOrdersButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = ''; 
      const data = await fetchOrders(token);
      setOrders(data);
      toast.success('Órdenes obtenidas exitosamente');
    } catch (error) {
      console.error(error);
      setError('Error al obtener las órdenes');
      toast.error('Error al obtener las órdenes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleFetchOrders}
        className="text-xl hover:text-pink-400 cursor-pointer"
        disabled={loading}
      >
        <FaBox className="text-xl mr-2" />
        {loading ? '' : ''}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {orders.map(order => (
          <li key={order.id}>{order.description}</li> // Ajusta según la estructura de tus datos
        ))}
      </ul>
    </div>
  );
};

export default FetchOrdersButton;
