'use client'
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaStar, FaTrashAlt } from 'react-icons/fa';
import { IService } from '../../interfaces/Types';

const GestionDeServicios: React.FC = () => {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://ribuzz-backend-ftn4.onrender.com/search/services')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: string | undefined) => {
    if (!id) {
      Swal.fire('Error', 'No se puede eliminar un servicio sin ID', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás recuperar este servicio después de eliminarlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://ribuzz-backend-ftn4.onrender.com/services/${id}`, {
          method: 'DELETE',
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(() => {
            setServices(services.filter(service => service.id !== id));
            Swal.fire(
              'Eliminado',
              'El servicio ha sido eliminado.',
              'success'
            );
          })
          .catch(error => {
            Swal.fire(
              'Error',
              `Hubo un problema al eliminar el servicio: ${error.message}`,
              'error'
            );
          });
      }
    });
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-white">Error: {error}</div>;

  return (
    <div className="p-4 text-white">
      <h1 className="text-xl font-bold mb-4">Servicios Disponibles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {services.map(service => (
          <div key={service.id} className="border rounded-lg p-4 relative">
            <button
              onClick={() => handleDelete(service.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <FaTrashAlt />
            </button>
            <h2 className="text-lg font-semibold">{service.name}</h2>
            <p className="text-gray-300">{service.description}</p>
            <p className="font-bold mt-2">${service.price}</p>
            <div className="mt-2">
              {service.images && service.images.length > 0 && (
                <img
                  src={service.images[0]}
                  alt={service.name}
                  className="w-full h-32 object-cover rounded"
                />
              )}
            </div>
            <div className="mt-2">
              <h3 className="text-md font-semibold">Proveedor:</h3>
              <p>{service.providerInfo.name}</p>
              <p>{service.providerInfo.contact}</p>
            </div>
            {service.details && (
              <div className="mt-2">
                <h3 className="text-md font-semibold">Detalles:</h3>
                <ul>
                  {service.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}
            {service.rating && (
              <div className="mt-2 flex items-center">
                <h3 className="text-md font-semibold mr-2">Calificación:</h3>
                <div className="flex items-center">
                  {[...Array(service.rating)].map((_, index) => (
                    <FaStar key={index} className="text-yellow-500" />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionDeServicios;