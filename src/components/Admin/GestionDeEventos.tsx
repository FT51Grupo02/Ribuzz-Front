'use client';
import React, { useEffect, useState } from 'react';
import { IEvent } from '../../interfaces/Types';
import Swal from 'sweetalert2';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa'; // Importa los íconos necesarios

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchEvents = async (): Promise<IEvent[]> => {
  try {
    const response = await fetch(`${API_URL}/search/events`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: IEvent[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

const updateEventStock = async (id: string, stock: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
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
    console.error('Error updating event stock:', error);
    throw error;
  }
};

const deleteEvent = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
  } catch (error) {
    console.error('Error deleting event:', error);
  }
};

const GestionDeEventos: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [newStock, setNewStock] = useState<number | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás deshacer esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
    });

    if (result.isConfirmed) {
      await deleteEvent(id);
      setEvents(events.filter(event => event.id !== id));
      Swal.fire('Eliminado!', 'El evento ha sido eliminado.', 'success');
    }
  };

  const handleStockEdit = (id: string, currentStock: number) => {
    setEditingStock(id);
    setNewStock(currentStock);
  };

  const handleStockSave = async (id: string) => {
    if (newStock === null) return;

    try {
      await updateEventStock(id, newStock);
      setEvents(events.map(event =>
        event.id === id ? { ...event, stock: newStock } : event
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
      <h1 className="text-xl font-bold mb-4">Gestión de Eventos</h1>
      <ul>
        {events.map(event => (
          <li key={event.id} className="mb-4 p-4 border border-gray-300 rounded relative">
            <button
              onClick={() => handleDelete(event.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              aria-label="Eliminar evento"
            >
              <FaTrash />
            </button>
            <h2 className="text-lg font-semibold">{event.name}</h2>
            <p>{event.description}</p>
            <p className="font-semibold">Price: ${event.price}</p>
            <p className="font-semibold">Date: {new Date(event.date).toLocaleDateString()}</p>
            <p className="font-semibold">Location: {event.location}</p>
            <p className="font-semibold">
              Stock:
              {editingStock === event.id ? (
                <span>
                  <input
                    type="number"
                    value={newStock ?? ''}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="ml-2 w-20 text-black"
                  />
                  <button
                    onClick={() => handleStockSave(event.id)}
                    className="ml-2 bg-violet-500 text-white px-2 py-1 rounded hover:bg-violet-600"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                  >
                    <FaTimes />
                  </button>
                </span>
              ) : (
                <span className="ml-2">{event.stock}</span>
              )}
              {editingStock !== event.id && (
                <button
                  onClick={() => handleStockEdit(event.id, event.stock)}
                  className="ml-2 bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
                >
                  <FaEdit />
                </button>
              )}
            </p>
            <div>
              <strong>Images:</strong>
              <div className="flex space-x-2">
                {event.images.map((image, index) => (
                  <img key={index} src={image} alt={event.name} className="w-20 h-20 object-cover" />
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionDeEventos;
