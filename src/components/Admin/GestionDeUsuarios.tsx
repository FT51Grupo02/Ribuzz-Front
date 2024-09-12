'use client';
import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../../helpers/user.helper'; 
import { FaUserCircle, FaTrash, FaPencilAlt, FaCheck, FaTimes, FaCamera } from 'react-icons/fa'; 
import Swal from 'sweetalert2'; 

export interface IUser {
  id?: string;
  name: string;
  email: string;
  date?: string;
  photo?: string | null;
  rol?: string
}

interface GestionDeUsuariosProps {
  token: string; // El token se pasará como prop
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const GestionDeUsuarios: React.FC<GestionDeUsuariosProps> = ({ token }) => {
  const [users, setUsers] = useState<IUser[]>([]); // Estado para almacenar usuarios
  const [loading, setLoading] = useState<boolean>(true); // Estado para manejar la carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const [editingUserId, setEditingUserId] = useState<string | null>(null); // Estado para almacenar el usuario que se está editando
  const [updatedRole, setUpdatedRole] = useState<string>(''); // Estado para almacenar el rol editado
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Estado para almacenar la vista previa de la imagen

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await fetchUsers(token);
        setUsers(usersData);
        setLoading(false); // Ya no está cargando
      } catch (error) {
        setError('Error al cargar los usuarios');
        setLoading(false); // Detenemos la carga incluso si hay error
      }
    };

    fetchData();
  }, [token]); // Se ejecuta cuando se monte el componente o cambie el token

  // Función para eliminar un usuario
  const handleDelete = (userId: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma la eliminación
        try {
          const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            // Si la eliminación fue exitosa, actualizamos la lista de usuarios eliminando el usuario
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
          } else {
            throw new Error('Error al eliminar el usuario');
          }
        } catch (error) {
          Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
        }
      }
    });
  };

  // Función para iniciar la edición del rol
  const handleEditRole = (userId: string, currentRole: string) => {
    setEditingUserId(userId);
    setUpdatedRole(currentRole);
  };

  // Función para cancelar la edición del rol
  const handleCancelEdit = () => {
    setEditingUserId(null);
    setUpdatedRole('');
  };

  // Función para guardar el nuevo rol
  const handleSaveRole = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/authadmin/admin`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email}),
      });

      if (response.ok) {
        // Actualizamos el rol del usuario en la lista
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editingUserId ? { ...user, rol: updatedRole } : user
          )
        );
        setEditingUserId(null);
        Swal.fire('¡Rol actualizado!', 'El rol del usuario ha sido actualizado.', 'success');
      } else {
        throw new Error('Error al actualizar el rol');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el rol.', 'error');
    }
  };

  // Función para manejar el cambio de imagen
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>, userId: string) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!); // Usa tu upload preset
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!); // Añade la API key

      console.log('Uploading to Cloudinary with preset:', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      console.log('Cloudinary URL:', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`);

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          const newPhotoUrl = data.secure_url;
          setImagePreview(newPhotoUrl); // Actualiza el estado con la URL de Cloudinary
          // Actualiza la imagen del usuario en la base de datos
          const updateResponse = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photo: newPhotoUrl }),
          });

          if (updateResponse.ok) {
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.id === userId ? { ...user, photo: newPhotoUrl } : user
              )
            );
            Swal.fire('¡Imagen actualizada!', 'La imagen del usuario ha sido actualizada.', 'success');
          } else {
            throw new Error('Error al actualizar la imagen');
          }
        } else {
          console.error('Error al subir la imagen:', data);
        }
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      }
    }
  };

  if (loading) {
    return <div>Cargando usuarios...</div>; // Mensaje mientras se cargan los datos
  }

  if (error) {
    return <div>{error}</div>; // Muestra el error si lo hay
  }

  return (
    <div className="text-white">
      <h2 className="text-white mb-4 text-lg">Lista de Usuarios</h2>
      <ul className="divide-y divide-gray-600"> {/* Aplica una línea horizontal entre cada usuario */}
        {users.map((user) => (
          <li key={user.id} className="flex items-center py-2 relative"> {/* Cada usuario se renderiza en una línea horizontal */}
            {/* Si el usuario tiene foto, la muestra. Si no, muestra el icono FaUserCircle */}
            {user.photo ? (
              <img src={user.photo} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
            ) : (
              <FaUserCircle className="w-12 h-12 text-gray-400 mr-4" /> // Icono si no hay foto
            )}
            <div className="flex-1">
              <p><strong>Nombre:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p>
                <strong>Rol:</strong> 
                {editingUserId === user.id ? (
                  <>
                    <select 
                      value={updatedRole} 
                      onChange={(e) => setUpdatedRole(e.target.value)} 
                      className="bg-gray-800 text-white p-1 ml-2 rounded"
                    >
                      <option value="admin">Admin</option>
                      <option value="cliente">Cliente</option>
                      <option value="emprendedor">Emprendedor</option>
                    </select>
                    {/* Botones de Guardar (✓) y Cancelar (✗) */}
                    <button className="ml-2 text-green-500" onClick={() => handleSaveRole(user.email)}>
                      <FaCheck />
                    </button>
                    <button className="ml-2 text-red-500" onClick={handleCancelEdit}>
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="ml-2">{user.rol || 'Sin rol definido'}</span>
                    <button className="ml-2 text-blue-500" onClick={() => handleEditRole(user.id as string, user.rol || '')}>
                      <FaPencilAlt />
                    </button>
                  </>
                )}
              </p>
              <p><strong>Fecha:</strong> {user.date || 'Fecha no disponible'}</p>
            </div>
            <div className="flex items-center">
              {/* Campo para subir una nueva foto */}
              <label htmlFor={`upload-photo-${user.id}`} className="cursor-pointer text-blue-500">
                <FaCamera className="w-6 h-6" />
              </label>
              <input 
                type="file" 
                id={`upload-photo-${user.id}`} 
                accept="image/*" 
                className="hidden"
                onChange={(e) => handleImageChange(e, user.id as string)}
              />
              {/* Icono de basura para eliminar el usuario */}
              <button 
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => handleDelete(user.id as string)}
              >
                <FaTrash className="w-6 h-6" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionDeUsuarios;
