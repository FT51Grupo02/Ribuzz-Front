'use client';

import React, { useEffect, useState } from 'react';
import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { useAuth } from '@/components/Context/AuthContext';
import { IEvent, IOrderDetail } from '@/interfaces/Types';

const defaultEvent: IEvent = {
    id: '',
    name: '',
    description: '',
    price: 0,
    images: [],
    ProviderInfo: { name: '', contact: '', location: '' },
    duration: '',
    date: '',
    time: [],
    stock: 0,
    publicationDate: '',
    type: 'event',
    location: '',
    videos: []
};

const fetchUserPurchases = async (userId: string): Promise<{ id: string; date: string; pay: any }[]> => {
    const response = await fetch(`https://ribuzz-backend-ftn4.onrender.com/users/${userId}`);
    const user = await response.json();
    console.log('User Orders:', user.orders); 
    return user.orders || [];
};

const fetchOrderDetails = async (orderId: string): Promise<IOrderDetail> => {
    const response = await fetch(`https://ribuzz-backend-ftn4.onrender.com/orders/${orderId}`);
    const result = await response.json();
    console.log('Order Details Result:', result); 
    if (Array.isArray(result) && result.length > 0) {
        const details = result[0].Details || {};
        return {
            id: details.id || '',
            date: details.date || '',
            total: details.total || 0,
            products: details.products || [],
            events: details.events || [],
            services: details.services || [],
            pay: details.pay || null
        };
    }
    return { id: '', date: '', total: 0, products: [], events: [], services: [], pay: null };
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

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        };
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', options);
    };
    
    useEffect(() => {
        if (user && user.id && token) {
            fetchUserPurchases(user.id).then(orders => {
                Promise.all(orders.map(async (order) => {
                    const details = await fetchOrderDetails(order.id);
                    return details;
                }))
                .then((orderDetails: IOrderDetail[]) => {
                    const allEvents = orderDetails.flatMap(details => details.events || []);
                    console.log('All Events:', allEvents);
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
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <div className="col-span-2 lg:col-span-1">
                    <h3 className="text-3xl font-bold mb-4">Mis Eventos: Calendario</h3>
                    <ul className="list-disc pl-5 mb-4">
                        {events.map(event => (
                            <li key={event.id} className="mb-2 text-xl text-pink-400">{formatDate(event.date)}</li>
                        ))}
                    </ul>

                    {detailsVisible && selectedEvent && (
                        <div className="bg-transparent shadow-md rounded-lg p-4">
                            <h3 className="text-2xl font-bold mb-4">{selectedEvent.name}</h3>
                            <p className='text-xl'><strong className='text-pink-400'>Día:</strong> {getDayOfWeek(selectedEvent.date)}</p>
                            <p className='text-xl'><strong className='text-pink-400'>Fecha:</strong> {formatDate(selectedEvent.date)}</p>
                            <p className='text-xl'><strong className='text-pink-400'>Ubicación:</strong> {selectedEvent.location}</p>
                        </div>
                    )}
                    {buttonVisible && (
                        <button
                            className="mt-4 bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-2 px-4 rounded-full"
                            onClick={() => setDetailsVisible(prev => !prev)}
                        >
                            <span className="inline-block text-white hover:scale-110 transition duration-300">
                                {detailsVisible ? 'Ocultar Detalles' : 'Mostrar Detalles'}
                            </span>   
                        </button>
                    )}
                </div>

                <div className="col-span-2 lg:col-span-1">
                    <Calendar
                        plugins={[dayGridPlugin]}
                        events={calendarEvents}
                        eventClick={handleEventClick}
                        contentHeight="auto"  
                        locale={esLocale}   
                    />
                </div>
            </div>
        </div>
    );
};

export default EventsCalendar;