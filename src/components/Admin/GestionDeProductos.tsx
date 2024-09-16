'use client';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { IProduct } from '../../interfaces/Types';
import { FaEdit, FaTimes, FaCheck, FaTrash } from 'react-icons/fa';
import Loader from '../Loader/Loader';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchProducts = async (): Promise<IProduct[]> => {
  try {
    const response = await fetch(`${API_URL}/search/products`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: IProduct[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

const updateProductStock = async (id: string, stock: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stock }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
};

const deleteProduct = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

const GestionDeProductos: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [newStock, setNewStock] = useState<number | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro de eliminar el producto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(product => product.id !== id));
        Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
      }
    }
  };

  const handleStockEdit = (id: string, currentStock: number) => {
    setEditingStock(id);
    setNewStock(currentStock);
  };

  const handleStockSave = async (id: string) => {
    if (newStock === null) return;

    try {
      await updateProductStock(id, newStock);
      setProducts(products.map(product =>
        product.id === id ? { ...product, stock: newStock } : product
      ));
      setEditingStock(null);
      setNewStock(null);
      Swal.fire('Actualizado', 'El stock ha sido actualizado.', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el stock.', 'error');
    }
  };

  const handleCancelEdit = () => {
    setEditingStock(null);
    setNewStock(null);
  };

  if (loading) return <Loader/>;
  if (error) return <p className="text-white">{error}</p>;

  return (
    <div className="p-4 text-white max-w-4xl mx-auto">
      <h1 className="font-bold mb-4 text-center text-pink-500 text-3xl">Gestión de Productos</h1>
      <ul className="space-y-4">
        {products.map(product => (
          <li key={product.id} className="p-4 border border-gray-300 rounded bg-black bg-opacity-90">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
              <h2 className="text-lg font-semibold mb-2 sm:mb-0">{product.name}</h2>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-500 hover:text-red-700"
                aria-label="Eliminar producto"
              >
                <FaTrash />
              </button>
            </div>
            <p className="text-sm mb-2">{product.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <p className="font-semibold">Precio: ${product.price}</p>
              <div className="font-semibold flex items-center">
                <span className="mr-2">Stock:</span>
                {editingStock === product.id ? (
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={newStock ?? ''}
                      onChange={(e) => setNewStock(Number(e.target.value))}
                      className="w-20 text-black px-2 py-1 rounded mr-2"
                    />
                    <button
                      onClick={() => handleStockSave(product.id)}
                      className="bg-violet-500 text-white px-2 py-1 rounded hover:bg-violet-600 mr-2"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="mr-2">{product.stock}</span>
                    <button
                      onClick={() => handleStockEdit(product.id, product.stock)}
                      className="bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
                    >
                      <FaEdit />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <strong>Imágenes:</strong>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                {product.images.map((image, index) => (
                  <img key={index} src={image} alt={product.name} className="w-full h-24 object-cover rounded" />
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionDeProductos;