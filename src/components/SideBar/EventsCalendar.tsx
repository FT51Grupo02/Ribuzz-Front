'use client';

import React, { useEffect, useState } from 'react';
import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useAuth } from '@/components/Context/AuthContext'; // Ruta correcta
import { IEvent, IOrderDetail } from '@/interfaces/Types'; // Asegúrate de que esta ruta sea correcta

const defaultEvent: IEvent = {
    id: '',
    name: '',
    description: '',
    price: 0,
    images: [],
    providerInfo: {
        name: '',
        contact: ''
    },
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
    return {
        id: '',
        date: '',
        total: 0,
        products: [],
        events: [],
        service: [],
        pay: null
    }; 
};

const getDayOfWeek = (dateString: string): string => {
    const date = new Date(dateString);
    const options = { weekday: 'long' } as Intl.DateTimeFormatOptions;
    return date.toLocaleDateString('es-ES', options);
};

const EventsCalendar: React.FC = () => {
    const { token, user } = useAuth();
    const [events, setEvents] = useState<IEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<IEvent>(defaultEvent);
    const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
    const [buttonVisible, setButtonVisible] = useState<boolean>(false);

    useEffect(() => {
        if (user && token) {
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

    const calendarEvents = events.map(event => ({
        title: event.name,
        date: event.date,
        id: event.id
    }));

    const handleEventClick = (eventInfo: { event: { id: string } }) => {
        const selected = events.find(e => e.id === eventInfo.event.id);
        setSelectedEvent(selected || defaultEvent);
        setDetailsVisible(true);
        setButtonVisible(true);
    };

    return (
        <div className="relative bg-transparent rounded-xl mx-auto max-w-6xl p-6 flex">
            <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4 text-center">Eventos</h2>
                <Calendar
                    plugins={[dayGridPlugin]}
                    events={calendarEvents}
                    eventClick={handleEventClick}
                />
                {buttonVisible && (
                     <button
                     className={`mt-4 bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-2 px-4 rounded-full`}
                     onClick={() => setDetailsVisible(prev => !prev)}
                 >
                        {detailsVisible ? 'Ocultar Detalles' : 'Mostrar Detalles'}
                    </button>
                )}
            </div>
            <div className="flex-1 ml-6">
                <h3 className="text-2xl font-bold mb-4">Mis Eventos</h3>
                <ul className="list-disc pl-5">
                    {events.map(event => (
                        <li key={event.id} className="mb-2">
                             {event.date}
                        </li>
                    ))}
                </ul>
            </div>
            {detailsVisible && selectedEvent && (
                <div className="mt-6 bg-transparent shadow-md rounded-lg p-4">
                    <h3 className="text-2xl font-bold mb-4">{selectedEvent.name}</h3>
                    <p><strong>Día:</strong> {getDayOfWeek(selectedEvent.date)}</p>
                    <p><strong>Fecha:</strong> {selectedEvent.date}</p>
                    <p><strong>Ubicación:</strong> {selectedEvent.location}</p>
                </div>
            )}
        </div>
    );
};

export default EventsCalendar;
