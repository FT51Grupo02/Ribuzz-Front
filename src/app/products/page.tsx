"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import CardProducts from "@/components/Cards/cardsproducts";
import PaginatorProducts from "@/components/Paginator/PaginatorProducts";
import SearchBarProducts from "@/components/SearchBar/SearchBarProducts";
import axios from "axios";
import { Product, Review } from "@/components/Cards/types";

// Calcula el rating promedio de las reviews
const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRating / reviews.length;
};

const Products: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    rating: "all",
    category: "all",
    price: "all",
    popularity: "all",
  });
  const productsPerPage = 4;

  // Fetch products and apply filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { search, category, price, popularity } = filters;

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/search/products`, {
          params: {
            name: search || undefined,
            categories: category !== "all" ? category : undefined,
            orderPrice: price === "highest" ? "desc" : price === "lowest" ? "asc" : undefined,
            populate: popularity === "mostPopular" ? "alta" : popularity === "leastPopular" ? "baja" : undefined,
            page: currentPage,
          },
        });

        const productsData = response.data || [];

        // Fetch detailed product information
        const productsWithDetails = await Promise.all(
          productsData.map(async (product: Product) => {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}`);
            const detailedProduct = data as Product;

            if (detailedProduct.reviews) {
              detailedProduct.rating = calculateAverageRating(detailedProduct.reviews);
            }

            return detailedProduct;
          })
        );

        setProducts(productsWithDetails);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProducts();
  }, [currentPage, filters]);

  useEffect(() => {
    // Este efecto es solo para el filtrado local después de recibir los productos
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRating = filters.rating === "all" || (product.rating && product.rating >= parseInt(filters.rating));

      // Asegurar que product.categories es un array de objetos y hacer una comparación adecuada
      const matchesCategory =
        filters.category === "all" ||
        (Array.isArray(product.categories) &&
          product.categories.some((category) => category.id.toString() === filters.category));

      return matchesSearch && matchesRating && matchesCategory;
    });

    // Ordenar productos por precio
    if (filters.price === "lowest") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.price === "highest") {
      filtered.sort((a, b) => b.price - a.price);
    }

    // Paginación
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    setFilteredProducts(filtered.slice(startIndex, endIndex));
  }, [products, filters, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
    setCurrentPage(1); // Resetear la página a la 1 cuando se cambian los filtros
  };

  return (
    <div className="relative font-poppins">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://res.cloudinary.com/devnzokpy/image/upload/v1725481344/3_pg8yhj.png"
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
            fontFamily: "Moonhouse, sans-serif",
            color: "#DADDE8",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3), -1px -1px 2px rgba(0, 0, 0, 0.3)",
          }}
        >
          Los mejores <span style={{ color: "#DF3381" }}>Productos</span> de Emprendedores
        </h2>
        <SearchBarProducts onFiltersChange={handleFiltersChange} />
        {filteredProducts.length > 0 ? (
          <>
            <CardProducts products={filteredProducts} />
            <PaginatorProducts
              currentPage={currentPage}
              totalPages={Math.ceil(products.length / productsPerPage)}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="flex justify-center items-center h-screen px-4">
            <h2 className="text-white text-3xl md:text-5xl font-semibold drop-shadow-xl text-center">
              No hay productos disponibles
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
