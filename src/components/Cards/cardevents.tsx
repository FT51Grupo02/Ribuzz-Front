"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Event } from '@/components/Cards/types'; 
import './CardEvents.css';

interface CardEventsProps {
  events?: Event[];
  eventsLoaded: boolean; // Add eventsLoaded prop
}

const CardEvents: React.FC<CardEventsProps> = ({ events, eventsLoaded }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventsLoaded) {
      setLoading(false);
    }
  }, [eventsLoaded]);

  const handleViewDetails = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen font-poppins">
        <div className="w-16 h-16 border-4 border-t-4 border-t-cyan-500 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen px-4">
        <h2 className="text-white text-3xl md:text-5xl font-semibold drop-shadow-xl text-center">
          No hay eventos disponibles
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full pt-4 px-4 md:px-6 lg:px-8">
      {events.map((event: Event) => (
        <div
          key={event.id}
          className="relative flex flex-col md:flex-row w-full max-w-4.5xl bg-black bg-opacity-90 shadow-lg rounded-lg overflow-hidden mb-6 hover:shadow-2xl border border-transparent hover:border-cyan-800 transition duration-300 custom-card-height"
          style={{ aspectRatio: '16 / 9' }}
        >
          <div className="relative w-full md:w-1/3 lg:w-1/4 h-full">
            <Image
              src={event.images[0]}
              alt={event.name}
              fill
              style={{ objectFit: 'cover' }}
              className="w-full h-full md:h-auto"
            />
          </div>

          <div className="flex flex-col justify-between w-full md:w-2/3 lg:w-3/4 p-4 flex-grow">
            <div className="flex flex-col flex-grow">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-cyan-500 drop-shadow-md">
                {event.name}
              </h2>
              <p className="text-white mt-2 text-sm md:text-base lg:text-lg">
                {event.date} | {event.location}
              </p>
              <p className="text-gray-200 mt-4 text-sm md:text-base lg:text-lg leading-relaxed flex-grow overflow-hidden text-ellipsis">
                {event.description}
              </p>
            </div>

            <div className="flex flex-col mt-4 max-sm:mt-10">
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 text-sm md:text-base lg:text-lg">
                  {Array.from({ length: event.rating ?? 0 }).map((_, index) => (
                    <span key={index} className="inline-block">★</span>
                  ))}
                </span>
              </div>
              {event.time && (
                <div className="text-gray-100 text-sm md:text-base lg:text-lg">
                  {event.time.join(' | ')}
                </div>
              )}
            </div>

            <button
              onClick={() => handleViewDetails(event.id.toString())}
              className="absolute bottom-4 right-4 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg text-sm md:text-base lg:text-lg transition duration-300 transform hover:scale-105"
            >
              Ver detalles
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardEvents;
