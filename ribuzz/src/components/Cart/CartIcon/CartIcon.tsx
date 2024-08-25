import React, { useState } from 'react';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import { useCart } from '../../Context/CartContext';

// Agregar en navBar cuando este el Contexto creado..
{/* <CartIcon
            className={`w-8 h-10 transition duration-300 ${isActive('/cart') ? 'filter invert' : 'hover:filter hover:invert'}`}
  /> */}

export interface IProduct {
  name: string;
  price: number;
  image: string;
  description?: string;
  stock: number;
  categoryId: number;
  id: number;
}

interface CartIconProps {
  className?: string;
}

const CartIcon: React.FC<CartIconProps> = ({ className }) => {
  const { cart } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        className="flex items-center text-gray-600 hover:text-black relative"
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
        aria-label="Cart"
      >
        <FaShoppingCart size={22} />
        {cart.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center -translate-x-1/2 translate-y-1/2">
            {cart.length}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-60 bg-white shadow-lg rounded-lg p-4 border border-gray-200"
          role="menu"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Cart</h3>
            <button 
              onClick={() => setDropdownOpen(false)} 
              className="text-gray-600 hover:text-black"
              aria-label="Close cart"
            >
              <FaTimes size={16} />
            </button>
          </div>
          <ul className="space-y-2">
            {cart.map((item: IProduct) => (
              <li key={item.id} className="flex justify-between text-gray-700">
                <span>{item.name}</span>
                <span>x ${item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CartIcon;
