"use client";

import { useState, useEffect, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import debounce from "lodash/debounce";

interface SearchBarProductsProps {
  onFiltersChange: (filters: {
    search: string;
    rating: string;
    category: string;
    price: string;
    popularity: string;
  }) => void;
}

const SearchBarProducts: React.FC<SearchBarProductsProps> = ({ onFiltersChange }) => {
  const [search, setSearch] = useState<string>("");
  const [rating, setRating] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [price, setPrice] = useState<string>("all");
  const [popularity, setPopularity] = useState<string>("all");

  const debouncedFiltersChange = useCallback(
    debounce(() => {
      console.log("Filters changed:", { search, rating, category, price, popularity }); // Debugging
      onFiltersChange({
        search,
        rating,
        category,
        price,
        popularity,
      });
    }, 300), // Usar 300ms en lugar de 0 para evitar llamadas excesivas
    [search, rating, category, price, popularity]
  );

  useEffect(() => {
    debouncedFiltersChange();

    // Limpiar el debounce al desmontar el componente
    return () => {
      debouncedFiltersChange.cancel();
    };
  }, [debouncedFiltersChange]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRating(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPrice(event.target.value);
  };

  const handlePopularityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPopularity(event.target.value);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex flex-col gap-4 max-w-5xl w-full">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:justify-center">
          <div className="flex gap-4 w-full max-w-5xl">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border border-pink-700 bg-black bg-opacity-80 text-white rounded-lg w-full overflow-hidden text-ellipsis whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:text-gray-300"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4 w-full items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
            <select
              value={rating}
              onChange={handleRatingChange}
              className="w-full px-4 py-2 border border-pink-700 bg-black bg-opacity-80 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">Rating</option>
              <option value="5">5 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="2">2 estrellas</option>
              <option value="1">1 estrella</option>
            </select>

            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2 border border-pink-700 bg-black bg-opacity-80 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">Categoría</option>
              <option value="Electrónica">Electrónica</option>
              <option value="Moda">Moda</option>
              <option value="Hogar">Hogar</option>
              <option value="Libros">Libros</option>
            </select>

            <select
              value={price}
              onChange={handlePriceChange}
              className="w-full px-4 py-2 border border-pink-700 bg-black bg-opacity-80 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">Precio</option>
              <option value="lowest">Más barato</option>
              <option value="highest">Más caro</option>
            </select>

            <select
              value={popularity}
              onChange={handlePopularityChange}
              className="w-full px-4 py-2 border border-pink-700 bg-black bg-opacity-80 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">Popularidad</option>
              <option value="mostPopular">Más vendido</option>
              <option value="leastPopular">Menos vendido</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBarProducts;
