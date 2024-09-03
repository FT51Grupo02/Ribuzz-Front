'use client';

import React, { useState, useEffect } from 'react';
import CardEvents from '@/components/Cards/cardevents';
import SearchBarEvents from '@/components/SearchBar/SearchBarEvents';
import PaginatorEvents from '@/components/Paginator/PaginatorEvents';
import Image from 'next/image';
import axios from 'axios';
import { Event } from '@/components/Cards/types';

const Events: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    rating: 'all',
    publicationDate: 'all',
    popularity: 'all',
    location: 'all',
  });
  const eventsPerPage = 3;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params: { [key: string]: string | number | undefined } = {
          name: filters.search || undefined,
          rating: filters.rating !== 'all' ? filters.rating : undefined,
          publicationDate: filters.publicationDate !== 'all' ? filters.publicationDate : undefined,
          popularity: filters.popularity !== 'all' ? filters.popularity : undefined,
          location: filters.location !== 'all' ? filters.location : undefined,
          page: currentPage,
          limit: eventsPerPage
        };

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/search/events`, { params });
        setEvents(response.data || []);
      } catch (error) {
        console.error("Error al obtener los eventos:", error);
        setEvents([]);
      }
    };

    fetchEvents();
  }, [currentPage, filters]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    setFilteredEvents(events.slice(startIndex, endIndex));
  }, [events, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  return (
    <div className="relative font-poppins">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/12.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <div className="relative z-10 pb-10 shadow-2xl">
        <h2
          className="max-sm:px-1 pt-3 text-center text-2xl md:text-3xl lg:text-4xl font-extralight text-black"
          style={{
            fontFamily: 'Moonhouse, sans-serif',
            color: '#DADDE8',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3), -1px -1px 2px rgba(0, 0, 0, 0.3)'
          }}
        >
          Los mejores <span style={{ color: '#19BDDA' }}>Eventos</span> para Emprendedores
        </h2>

        <SearchBarEvents onFiltersChange={handleFiltersChange} />

        <CardEvents events={filteredEvents} />

        <PaginatorEvents
          currentPage={currentPage}
          totalPages={Math.ceil(events.length / eventsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Events;
