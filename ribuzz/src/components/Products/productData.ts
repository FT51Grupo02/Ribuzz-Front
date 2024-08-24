import { ProductProps } from './Products';

export const exampleProductData: ProductProps = {
  description: "Este es un producto innovador que combina tecnología y diseño para ofrecer la mejor experiencia. Ideal para uso diario y profesional.",
  images: [
    "https://images.pexels.com/photos/8529081/pexels-photo-8529081.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/8837528/pexels-photo-8837528.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/7309217/pexels-photo-7309217.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/6623836/pexels-photo-6623836.jpeg?auto=compress&cs=tinysrgb&w=600",
  ],
  videos: [
    "/videos/product-demo.mp4"
  ],
  sellerInfo: {
    name: "Juan Pérez",
    contact: "juan.perez@example.com"
  },
  customizationOptions: [
    "Color: Rojo, Azul, Verde",
    "Tamaño: S, M, L, XL"
  ],
  reviews: [
    { username: "Ana", comment: "Excelente producto, superó mis expectativas.", rating: 5 },
    { username: "Luis", comment: "Buena calidad, pero el envío tardó más de lo esperado.", rating: 4 }
  ],
  ribuzzRating: 4.5,
  price: 100,
};
