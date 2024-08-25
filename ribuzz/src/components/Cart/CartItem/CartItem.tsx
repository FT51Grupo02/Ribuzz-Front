'use client';

import { FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../Context/CartContext';

export  interface IProduct{
    name: string,
    price: number,
    image: string,
    description?: string,
    stock: number,
    categoryId: number
    id: number
}

const CartItem: React.FC = () => {
    const { cart, removeFromCart } = useCart();
    const isCartEmpty = cart.length === 0;
  
    return (
      <div className="container mx-auto p-4">
        {isCartEmpty ? (
          <div className="text-center">
            <p className="text-xl font-bold mb-4">The cart is empty.</p>
            <Link href="/">
              <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
                Explore products
              </button>
            </Link>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            <div className="space-y-4">
              {cart.map((product: IProduct) => (
                <div key={product.id} className="flex justify-between items-center border-b py-2">
                  <div className="flex items-center">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      width={64} 
                      height={64} 
                      className="object-cover mr-4 rounded-lg"
                    />
                    <span>{product.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span>${product.price.toFixed(2)}</span>
                    <button 
                      onClick={() => removeFromCart(product.id)} 
                      className="ml-4 text-red-500"
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-xl font-bold">
                Total: ${cart.reduce((total: number, product: IProduct) => total + product.price, 0).toFixed(2)}
              </span>
              <Link href="/checkout">
                <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-3 rounded">
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default CartItem;
