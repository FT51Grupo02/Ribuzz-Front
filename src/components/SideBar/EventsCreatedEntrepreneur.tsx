'use client'

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/Context/AuthContext';
import { IEvent } from '@/interfaces/Types';

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

const fetchEntrepreneurEvents = async (entrepreneurId: string): Promise<IEvent[]> => {
    const response = await fetch('https://ribuzz-backend-ftn4.onrender.com/search/events');
    const allEvents = await response.json();
    return allEvents.filter((event: IEvent) => event.ProviderInfo.contact === entrepreneurId);
};

const getDayOfWeek = (dateString: string): string => {
    const date = new Date(dateString);
    const options = { weekday: 'long' } as Intl.DateTimeFormatOptions;
    return date.toLocaleDateString('es-ES', options);
};

const EventsCreatedEntrepreneur: React.FC = () => {
    const { token, user } = useAuth();
    const [events, setEvents] = useState<IEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<IEvent>(defaultEvent);
    const [detailsVisible, setDetailsVisible] = useState<boolean>(false);

    useEffect(() => {
        if (user && user.id && token) {
            fetchEntrepreneurEvents(user.id)
                .then((events: IEvent[]) => setEvents(events))
                .catch(error => console.error('Error fetching events:', error));
        }
    }, [user, token]);

    const handleCardClick = (event: IEvent) => {
        setSelectedEvent(event);
        setDetailsVisible(true);
    };

    return (
        <div className="container mx-auto p-4">
            <h3 className="text-2xl font-bold mb-4">Mis Eventos Creados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <div 
                        key={event.id} 
                        className="bg-white shadow-lg rounded-lg p-4 cursor-pointer"
                        onClick={() => handleCardClick(event)}
                    >
                        <h4 className="text-xl font-bold mb-2">{event.name}</h4>
                        <p><strong>Fecha:</strong> {event.date}</p>
                        <p><strong>Ubicación:</strong> {event.location}</p>
                        <p><strong>Descripción:</strong> {event.description}</p>
                    </div>
                ))}
            </div>

            {detailsVisible && selectedEvent && (
                <div className="mt-6 bg-transparent shadow-md rounded-lg p-4">
                    <h3 className="text-xl font-bold mb-4">{selectedEvent.name}</h3>
                    <p><strong>Día:</strong> {getDayOfWeek(selectedEvent.date)}</p>
                    <p><strong>Fecha:</strong> {selectedEvent.date}</p>
                    <p><strong>Ubicación:</strong> {selectedEvent.location}</p>
                    <p><strong>Descripción:</strong> {selectedEvent.description}</p>
                    <p><strong>Precio:</strong> ${selectedEvent.price}</p>
                    <p><strong>Duración:</strong> {selectedEvent.duration}</p>
                    <p><strong>Stock:</strong> {selectedEvent.stock}</p>
                    <p><strong>Proveedor:</strong> {selectedEvent.ProviderInfo.name}</p>
                    <p><strong>Contacto del Proveedor:</strong> {selectedEvent.ProviderInfo.contact}</p>
                </div>
            )}
        </div>
    );
};

export default EventsCreatedEntrepreneur;