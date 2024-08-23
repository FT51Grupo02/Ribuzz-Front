'use client'

import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [rating, setRating] = useState<string>("all");
  const [publicationDate, setPublicationDate] = useState<string>("all");
  const [popularity, setPopularity] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRating(event.target.value);
  };

  const handlePublicationDateChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPublicationDate(event.target.value);
  };

  const handlePopularityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPopularity(event.target.value);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(event.target.value);
  };

  const handleSearch = () => {
    console.log("Searching for:", { search, rating, publicationDate, popularity, location });
  };

  return (
    <div className="flex flex-col items-center p-4">
      {/* Contenedor general */}
      <div className="flex flex-col gap-4 max-w-5xl w-full">
        {/* En pantallas mayores a 768px, el input de búsqueda y el botón de buscar estarán en una fila */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:justify-center">
          {/* Input de búsqueda y botón de búsqueda en una fila */}
          <div className="flex gap-4 w-full max-w-5xl">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={search}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full overflow-hidden text-ellipsis whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex items-center">
              <button
                onClick={handleSearch}
                className="px-4 py-2 text-lg md:text-xl font-semibold rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 text-gray-50 hover:filter hover:bg-white transition duration-300"
              >
                <span className="transition duration-300 hover:scale-110 inline-block text-lg">
                  Buscar
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4 w-full items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
            <select
              value={rating}
              onChange={handleRatingChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-ellipsis text-overflow-hidden"
            >
              <option value="all">Rating</option>
              <option value="5">5 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="2">2 estrellas</option>
              <option value="1">1 estrella</option>
            </select>

            <select
              value={publicationDate}
              onChange={handlePublicationDateChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-ellipsis text-overflow-hidden"
            >
              <option value="all">Fecha de publicación</option>
              <option value="last24h">Últimas 24 horas</option>
              <option value="lastWeek">Última semana</option>
              <option value="lastMonth">Último mes</option>
              <option value="lastYear">Último año</option>
            </select>

            <select
              value={popularity}
              onChange={handlePopularityChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-ellipsis text-overflow-hidden"
            >
              <option value="all">Popularidad</option>
              <option value="mostPopular">Más popular</option>
              <option value="leastPopular">Menos popular</option>
            </select>

            <select
              value={location}
              onChange={handleLocationChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-ellipsis text-overflow-hidden"
            >
              <option value="all">Ubicación</option>
              <option value="nearby">Cerca de mí</option>
              <option value="city">En la ciudad</option>
              <option value="country">En el país</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
