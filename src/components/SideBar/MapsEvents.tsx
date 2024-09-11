'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Importa los estilos de Leaflet
import { useAuth } from '@/components/Context/AuthContext';
import { IEvent, IOrderDetail } from '@/interfaces/Types';

// Valor predeterminado para eventos
const defaultEvent: IEvent = {
  id: '',
  name: '',
  description: '',
  price: 0,
  images: [],
  providerInfo: { name: '', contact: '' },
  duration: '',
  location: '',
  reviews: [],
  publicationDate: '',
  date: '',
  time: [],
  stock: 0,
  videos: [],
  rating: 0,
  popularity: '',
  type: 'event'
};

// Función para obtener las compras del usuario
const fetchUserPurchases = async (userId: string): Promise<{ id: string; date: string; pay: any }[]> => {
  const response = await fetch(`https://ribuzz-backend-ftn4.onrender.com/users/${userId}`);
  const user = await response.json();
  return user.orders || [];
};

// Función para obtener los detalles del pedido
const fetchOrderDetails = async (orderId: string): Promise<IOrderDetail> => {
  const response = await fetch(`https://ribuzz-backend-ftn4.onrender.com/orders/${orderId}`);
  const result = await response.json();
  if (Array.isArray(result) && result.length > 0) {
    const details = result[0].Details || {};
    return {
      id: details.id || '',
      date: details.date || '',
      total: details.total || 0,
      products: details.products || [],
      events: details.events || [],
      service: details.service || [],
      pay: details.pay || null
    };
  }
  return { id: '', date: '', total: 0, products: [], events: [], service: [], pay: null };
};

const MapsEvents: React.FC = () => {
  const { token, user } = useAuth();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<IEvent>(defaultEvent);
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
  const [buttonVisible, setButtonVisible] = useState<boolean>(false);

  useEffect(() => {
    if (user && user.id && token) {
      fetchUserPurchases(user.id).then(orders => {
        Promise.all(orders.map(async (order) => {
          const details = await fetchOrderDetails(order.id);
          return details;
        }))
        .then((orderDetails: IOrderDetail[]) => {
          const allEvents = orderDetails.flatMap(details => details.events || []);
          setEvents(allEvents);
        })
        .catch(error => console.error('Error fetching order details:', error));
      })
      .catch(error => console.error('Error fetching user purchases:', error));
    }
  }, [user, token]);



  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Mapa de Eventos</h2>

      {/* Grid para dividir los eventos y el mapa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Columna izquierda: Lista de eventos */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Lista de Eventos</h3>
          <ul>
            {events.map(event => (
              <li key={event.id} className="mb-4">
                <strong>{event.name}</strong><br />
                <span>{event.location}</span><br />
                <span>{event.date}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna derecha: Mapa */}
        <div className="w-full h-96 lg:h-auto">
          <MapContainer>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {events.map(event => {
              const [lat, lng] = event.location.split(',').map(Number);
              return (
                <Marker
                  key={event.id}
                  position={{ lat, lng }}
                >
                  <Popup>
                    <strong>{event.name}</strong><br />
                    {event.location}<br />
                    {event.date}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapsEvents;
