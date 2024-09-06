'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CardEvents from '@/components/Cards/cardevents';
import PaginatorEvents from '@/components/Paginator/PaginatorEvents';
import SearchBarEvents from '@/components/SearchBar/SearchBarEvents';
import axios from 'axios';
import { Event, Review } from '@/components/Cards/types';

const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRating / reviews.length;
};

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
  const [eventsLoaded, setEventsLoaded] = useState(false); // New state for tracking loading status
  const eventsPerPage = 2; // Ajusta según el número de eventos por página

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { search, publicationDate, popularity, location } = filters;

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/search/events`, {
          params: {
            name: search || undefined,
            publicationDate: publicationDate !== 'all' ? publicationDate : undefined,
            popularity: popularity === 'mostPopular' ? 'alta' : popularity === 'leastPopular' ? 'baja' : undefined,
            location: location !== 'all' ? location : undefined,
            page: 1, // Siempre trae la primera página de eventos
            limit: 1000, // Trae todos los eventos posibles para aplicar filtros y paginación local
          },
        });

        const eventsData = response.data || [];

        // Fetch detailed event information
        const eventsWithDetails = await Promise.all(
          eventsData.map(async (event: Event) => {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events/${event.id}`);
            const detailedEvent = data as Event;

            if (detailedEvent.reviews) {
              detailedEvent.rating = calculateAverageRating(detailedEvent.reviews);
            }

            return detailedEvent;
          })
        );

        setEvents(eventsWithDetails);
        setEventsLoaded(true); // Update loading status after events are fetched
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
        setEventsLoaded(true); // Ensure loading status is updated even on error
      }
    };

    fetchEvents();
  }, [filters]);

  useEffect(() => {
    const filtered = events.filter((event) => {
      const matchesSearch = filters.search === '' || event.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRating = filters.rating === 'all' || (event.rating !== undefined && event.rating >= parseInt(filters.rating));
      const matchesPublicationDate = filters.publicationDate === 'all' || event.publicationDate === filters.publicationDate;
      const matchesPopularity = filters.popularity === 'all' || (event.popularity !== undefined && event.popularity === filters.popularity);
      const matchesLocation = filters.location === 'all' || event.location === filters.location;

      return matchesSearch && matchesRating && matchesPublicationDate && matchesPopularity && matchesLocation;
    });

    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    setFilteredEvents(filtered.slice(startIndex, endIndex));
  }, [events, filters, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: {
    search: string;
    rating: string;
    publicationDate: string;
    popularity: string;
    location: string;
  }) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  const totalPages = Math.ceil(
    events.filter((event) => {
      const matchesSearch = filters.search === '' || event.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRating = filters.rating === 'all' || (event.rating !== undefined && event.rating >= parseInt(filters.rating));
      const matchesPublicationDate = filters.publicationDate === 'all' || event.publicationDate === filters.publicationDate;
      const matchesPopularity = filters.popularity === 'all' || event.popularity === filters.popularity;
      const matchesLocation = filters.location === 'all' || event.location === filters.location;

      return matchesSearch && matchesRating && matchesPublicationDate && matchesPopularity && matchesLocation;
    }).length / eventsPerPage
  );

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://res.cloudinary.com/devnzokpy/image/upload/v1725481346/12_vrxcte.png"
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
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3), -1px -1px 2px rgba(0, 0, 0, 0.3)',
          }}
        >
          Los mejores <span style={{ color: '#19BDDA' }}>Eventos</span> de Emprendedores
        </h2>
        <SearchBarEvents onFiltersChange={handleFiltersChange} />
        <CardEvents events={filteredEvents} eventsLoaded={eventsLoaded} />
        <PaginatorEvents currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default Events;
