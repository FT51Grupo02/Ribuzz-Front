"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CardServices from '@/components/Cards/cardsservices';
import PaginatorServices from '@/components/Paginator/PaginatorServices';
import SearchBarServices from '@/components/SearchBar/SearchBarServices';
import axios from 'axios';
import { Service, Review } from '@/components/Cards/types';

const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRating / reviews.length;
};

const Services: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    rating: 'all',
    publicationDate: 'all',
    popularity: 'all',
    location: 'all',
  });
  const servicesPerPage = 4;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { search, publicationDate, popularity, location } = filters;

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/search/services`, {
          params: {
            name: search || undefined,
            publicationDate: publicationDate !== 'all' ? publicationDate : undefined,
            popularity: popularity === 'mostPopular' ? 'alta' : popularity === 'leastPopular' ? 'baja' : undefined,
            location: location !== 'all' ? location : undefined,
            page: currentPage,
            limit: servicesPerPage
          },
        });

        const servicesData = response.data || [];

        // Fetch detailed service information
        const servicesWithDetails = await Promise.all(servicesData.map(async (service: Service) => {
          const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/services/${service.id}`);
          const detailedService = data as Service;

          if (detailedService.reviews) {
            detailedService.rating = calculateAverageRating(detailedService.reviews);
          }

          return detailedService;
        }));

        setServices(servicesWithDetails);
      } catch (error) {
        console.error('Error al obtener los servicios:', error);
      }
    };

    fetchServices();
  }, [currentPage, filters]);

  useEffect(() => {
    let filtered = services.filter((service) => {
      const matchesSearch = filters.search === '' || service.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRating = filters.rating === 'all' || (service.rating !== undefined && service.rating >= parseInt(filters.rating));
      const matchesPublicationDate = filters.publicationDate === 'all' || service.publicationDate === filters.publicationDate;
      return matchesSearch && matchesRating && matchesPublicationDate;
    });

    const startIndex = (currentPage - 1) * servicesPerPage;
    const endIndex = startIndex + servicesPerPage;
    setFilteredServices(filtered.slice(startIndex, endIndex));
  }, [services, filters, currentPage]);

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
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://res.cloudinary.com/devnzokpy/image/upload/v1725481346/15_x3wcot.jpg"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <div className="relative z-10 pb-10 shadow-2xl">
        <h2 className="max-sm:px-1 pt-3 text-center text-2xl md:text-3xl lg:text-4xl font-extralight text-black" style={{ fontFamily: 'Moonhouse, sans-serif', color: '#DADDE8', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3), -1px -1px 2px rgba(0, 0, 0, 0.3)' }}>
          Los mejores <span style={{ color: '#19BDDA' }}>Servicios</span> de Emprendedores
        </h2>
        <SearchBarServices onSearch={handleFiltersChange} />
        <CardServices services={filteredServices} />
        <PaginatorServices
          currentPage={currentPage}
          totalPages={Math.ceil(services.length / servicesPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Services;
