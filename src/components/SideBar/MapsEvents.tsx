'use client';
import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '@/components/Context/AuthContext';
import { IEvent, IOrderDetail } from '@/interfaces/Types';
import L from 'leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

const fetchUserPurchases = async (userId: string): Promise<{ id: string; date: string; pay: any }[]> => {
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

const getCoordinates = async (location: string) => {
  if (typeof window !== 'undefined') { 
    const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;
    if (!apiKey) {
      console.error('API key for geocoding service is not defined.');
      return null;
    }
    
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return { lat, lng };
    } else {
      console.error('No se encontraron coordenadas para esta ubicación.');
      return null;
    }
  }
  return null;
};

const isValidLocation = (location: string): boolean => {
  const [lat, lng] = location.split(',').map(Number);
  return !isNaN(lat) && !isNaN(lng);
};

const MapsEvents: React.FC = () => {
  const { token, user } = useAuth();
  const [events, setEvents] = useState<IEvent[]>([]);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (user && token) {
      fetchUserPurchases(user.id).then(orders => {
        Promise.all(orders.map(async (order) => {
          const details = await fetchOrderDetails(order.id);
          return details;
        }))
        .then(async (orderDetails: IOrderDetail[]) => {
          const allEvents = orderDetails.flatMap(details => details.events || []);
          const updatedEvents = await Promise.all(allEvents.map(async (event) => {
            if (!isValidLocation(event.location)) {
              const coords = await getCoordinates(event.location);
              if (coords) {
                return { ...event, location: `${coords.lat},${coords.lng}` };
              }
            }
            return event;
          }));
          setEvents(updatedEvents);
        })
        .catch(error => console.error('Error fetching order details:', error));
      })
      .catch(error => console.error('Error fetching user purchases:', error));
    }
  }, [user, token]);

  const handleLocationClick = (location: string) => {
    if (typeof window !== 'undefined') {
      const [lat, lng] = location.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng) && mapRef.current) {
        mapRef.current.setView([lat, lng], 13);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-transparent p-4 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">Mis Eventos</h3>
          <ul className="list-disc pl-5 mb-4">
            {events.map(event => (
              <li key={event.id} className="mb-4">
                <button
                  className="text-purple-500 hover:underline"
                  onClick={() => handleLocationClick(event.location)}
                >
                  {event.name}
                </button><br />
                <span>Ubicación: {event.location}</span><br />
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full h-96 lg:h-auto">
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            className="h-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {events
              .filter(event => isValidLocation(event.location))
              .map(event => {
                const [lat, lng] = event.location.split(',').map(Number);
                return (
                  <Marker key={event.id} position={[lat, lng]}>
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
