'use client';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { IProduct } from '../../interfaces/Types';
import { FaEdit, FaTimes, FaCheck } from 'react-icons/fa'; // Importar los íconos

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

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-white">{error}</p>;

  return (
    <div className="p-4 text-white">
      <h1 className="text-xl font-bold mb-4">Gestión de Productos</h1>
      <ul>
        {products.map(product => (
          <li key={product.id} className="mb-4 p-4 border border-gray-300 rounded">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p>{product.description}</p>
            <p className="font-semibold">Price: ${product.price}</p>
            <p className="font-semibold">
              Stock: 
              {editingStock === product.id ? (
                <span>
                  <input
                    type="number"
                    value={newStock ?? ''}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="ml-2 w-20 text-black"
                  />
                  <button
                    onClick={() => handleStockSave(product.id)}
                    className="ml-2 bg-violet-500 text-white px-2 py-1 rounded hover:bg-violet-600"
                  >
                    <FaCheck /> {/* Ícono de guardar (tic) */}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                  >
                    <FaTimes />
                  </button>
                </span>
              ) : (
                <span className="ml-2">{product.stock}</span>
              )}
              {editingStock !== product.id && (
                <button
                  onClick={() => handleStockEdit(product.id, product.stock)}
                  className="ml-2 bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
                >
                  <FaEdit />
                </button>
              )}
            </p>
            <div>
              <strong>Images:</strong>
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <img key={index} src={image} alt={product.name} className="w-20 h-20 object-cover" />
                ))}
              </div>
            </div>
            <button
              onClick={() => handleDelete(product.id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionDeProductos;

