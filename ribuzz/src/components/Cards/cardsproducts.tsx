import React from 'react';
import Card from '../Cards/card';

interface Product {
  name: string;
  price: string;
  image: string;
  rating: number;
  description: string;
}

const products: Product[] = [
  {
    name: "Servicio 1",
    price: "20.00",
    image: "https://images.pexels.com/photos/8529081/pexels-photo-8529081.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4,
    description: "Descripción de Servicio 1.",
  },
  {
    name: "Servicio 2",
    price: "28.50",
    image: "https://images.pexels.com/photos/8837528/pexels-photo-8837528.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 5,
    description: "Descripción de Servicio 2.",
  },
  {
    name: "Servicio 3",
    price: "15.50",
    image: "https://images.pexels.com/photos/7309217/pexels-photo-7309217.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 3,
    description: "Descripción de Servicio 3.",
  },
  {
    name: "Servicio 4",
    price: "48.50",
    image: "https://images.pexels.com/photos/6623836/pexels-photo-6623836.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 2,
    description: "Descripción de Servicio 4.",
  },
  {
    name: "Servicio 5",
    price: "23.99",
    image: "https://images.pexels.com/photos/6694923/pexels-photo-6694923.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 3,
    description: "Descripción de Servicio 5.",
  },
  {
    name: "Servicio 6",
    price: "33.50",
    image: "https://images.pexels.com/photos/5427932/pexels-photo-5427932.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4,
    description: "Descripción de Servicio 6.",
  },
  {
    name: "Servicio 7",
    price: "19.99",
    image: "https://images.pexels.com/photos/5566960/pexels-photo-5566960.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 2,
    description: "Descripción de Servicio 7.",
  },
  {
    name: "Servicio 8",
    price: "30.00",
    image: "https://images.pexels.com/photos/5973961/pexels-photo-5973961.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4,
    description: "Descripción de Servicio 8.",
  },

];

const CardProducts: React.FC = () => {
  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <div key={index} className="flex justify-center transition duration-300 hover:scale-105">
            <Card
              name={product.name}
              price={product.price}
              image={product.image}
              rating={product.rating}
              description={product.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardProducts;
