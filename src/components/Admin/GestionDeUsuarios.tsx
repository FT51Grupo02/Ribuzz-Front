'use client';

import React, { useEffect, useState } from 'react';
import { IUser, UserRole } from '../../interfaces/Types';
import { fetchUsers } from '../../helpers/user.helper';
import { FaUserCircle, FaTrash, FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Loader from '../Loader/Loader';

interface GestionDeUsuariosProps {
  token: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const GestionDeUsuarios: React.FC<GestionDeUsuariosProps> = ({ token }) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [updatedRole, setUpdatedRole] = useState<UserRole | ''>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await fetchUsers(token);
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los usuarios');
        setLoading(false);
        Swal.fire('Error', 'No se pudieron cargar los usuarios.', 'error');
      }
    };

    fetchData();
  }, [token]);

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
        try {
          const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
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

  const handleEditRole = (userId: string, currentRole: UserRole | undefined) => {
    setEditingUserId(userId);
    setUpdatedRole(currentRole || '');
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setUpdatedRole('');
  };

  const handleSaveRole = async (email: string) => {
    if (!updatedRole) {
      Swal.fire('Error', 'Por favor, selecciona un rol válido.', 'error');
      return;
    }

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
    return <Loader/>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="text-white px-2">
      <h2 className="text-white mb-4 text-2xl font-bold">Lista de Usuarios</h2>
      <ul className="divide-y divide-gray-600">
        {users.map((user) => (
          <li key={user.id} className="flex items-center py-4 relative">
            {user.photo ? (
              <img src={user.photo} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
            ) : (
              <FaUserCircle className="w-12 h-12 text-gray-400 mr-4" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-300">{user.email}</p>
              <p className="mt-1">
                <span className="font-semibold">Rol:</span> 
                {editingUserId === user.id ? (
                  <>
                    <select 
                      value={updatedRole} 
                      onChange={(e) => setUpdatedRole(e.target.value as UserRole)} 
                      className="bg-gray-800 text-white p-1 ml-2 rounded"
                    >
                      <option value="">Seleccionar rol</option>
                      <option value="admin">Admin</option>
                      <option value="cliente">Cliente</option>
                      <option value="emprendedor">Emprendedor</option>
                    </select>
                    <button 
                      className="ml-2 text-green-500 hover:text-green-400 transition-colors" 
                      onClick={() => handleSaveRole(user.email)}
                    >
                      <FaCheck />
                    </button>
                    <button 
                      className="ml-2 text-red-500 hover:text-red-400 transition-colors" 
                      onClick={handleCancelEdit}
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="ml-2">{user.role || 'Sin rol definido'}</span>
                    <button 
                      className="ml-2 text-blue-500 hover:text-blue-400 transition-colors" 
                      onClick={() => handleEditRole(user.id as string, user.role)}
                    >
                      <FaPencilAlt />
                    </button>
                  </>
                )}
              </p>
              <p className="text-sm text-gray-400 mt-1">Registrado: {user.date ? new Date(user.date).toLocaleDateString() : 'Fecha no disponible'}</p>
            </div>
            <button 
              className="absolute right-0 top-0 mt-4 mr-4 text-red-500 hover:text-red-400 transition-colors"
              onClick={() => handleDelete(user.id as string)}
            >
              <FaTrash className="w-5 h-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionDeUsuarios;