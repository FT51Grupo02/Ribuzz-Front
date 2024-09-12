'use client';
import React, { useEffect, useState } from 'react';
import { IUser } from '../../interfaces/Types'; // Importa la interfaz de usuario
import { fetchUsers } from '../../helpers/user.helper'; // Importa la función fetchUsers
import { FaUserCircle, FaTrash, FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa'; // Importa los iconos
import Swal from 'sweetalert2'; // Importa SweetAlert2

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
        body: JSON.stringify({ email, role: updatedRole }),
      });

      if (response.ok) {
        // Actualizamos el rol del usuario en la lista
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editingUserId ? { ...user, role: updatedRole } : user
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
                    <span className="ml-2">{user.role || 'Sin rol definido'}</span>
                    <button className="ml-2 text-blue-500" onClick={() => handleEditRole(user.id as string, user.role || '')}>
                      <FaPencilAlt />
                    </button>
                  </>
                )}
              </p>
              <p><strong>Fecha:</strong> {user.date || 'Fecha no disponible'}</p>
            </div>
            {/* Icono de basura para eliminar el usuario */}
            <button 
              className="absolute right-0 top-0 mt-2 mr-2 text-red-500 hover:text-red-700"
              onClick={() => handleDelete(user.id as string)}
            >
              <FaTrash className="w-6 h-6" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionDeUsuarios;
