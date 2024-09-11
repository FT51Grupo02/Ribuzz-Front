'use client';
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useAuth } from '@/components/Context/AuthContext';
import { updateUserProfile } from '@/helpers/user.helper';
import Image from 'next/image';
import { FaCamera, FaEye, FaEyeSlash } from 'react-icons/fa';

const UpdateProfileSchema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('Requerido'),
    password: Yup.string()
        .min(8, 'La contraseña debe poseer 8 caracteres mínimo')
        .matches(/[A-Z]/, 'La contraseña debe poseer al menos una mayúscula')
        .matches(/[!@#$%^&*]/, 'La contraseña debe poseer al menos un carácter especial')
        .required('Requerido'),
    name: Yup.string().required('Requerido'),
});

const UpdateProfile: React.FC = () => {
    const { token, user, updateUser } = useAuth(); // Obtiene el token y el método updateUser del contexto de autenticación
    const [imagePreview, setImagePreview] = useState<string>(user?.photo || 'https://res.cloudinary.com/devnzokpy/image/upload/v1725918379/0_vh4jdp.webp');
    const [userId, setUserId] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña

    // Obtiene el ID de usuario del localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserId(parsedUser.id);
        } else {
            console.error('No se encontró el ID de usuario en el localStorage');
        }
    }, []);

    const handleSubmit = async (values: { email: string; password: string; name: string; }) => {
        const confirmUpdate = await Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Deseas actualizar tu perfil?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, actualizar',
          cancelButtonText: 'No, cancelar'
        });
      
        if (!confirmUpdate.isConfirmed) return;
      
        if (!token) {
          Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: 'No se ha encontrado el token de autenticación. Inicia sesión nuevamente.'
          });
          return;
        }
      
        if (!userId) {
          Swal.fire({
            icon: 'error',
            title: 'Error de usuario',
            text: 'No se ha encontrado el ID de usuario. Por favor, vuelve a iniciar sesión.'
          });
          return;
        }
      
        const profileData = {
          name: values.name,
          email: values.email,
          password: values.password,
          photo: imagePreview,
        };
      
        try {
          const updatedUser = await updateUserProfile(userId, profileData, token);
          updateUser(updatedUser); // Actualiza el usuario en el contexto
          Swal.fire({
            icon: 'success',
            title: 'Perfil actualizado',
            text: 'Tu perfil se ha actualizado correctamente.'
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al actualizar tu perfil. Inténtalo de nuevo.'
          });
          console.error('Error al actualizar perfil:', error);
        }
      };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
                    setImagePreview(data.secure_url); // Actualiza el estado con la URL de Cloudinary
                    console.log('Imagen subida a Cloudinary:', data.secure_url); // Imprime la URL de la imagen subida
                } else {
                    console.error('Error al subir la imagen:', data);
                }
            } catch (error) {
                console.error('Error al subir la imagen:', error);
            }
        }
    };

    return (
        <Formik
            initialValues={{ email: '', password: '', name: '', profilePhoto: null }}
            validationSchema={UpdateProfileSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
        >
            {({ errors, touched, handleChange, setFieldTouched }) => (
                <Form className="space-y-4 p-4 sm:p-6 md:p-8 max-w-lg mx-auto">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                        <Image
                            src={imagePreview}
                            alt="Perfil"
                            width={120}
                            height={120}
                            quality={100}
                            objectFit="cover"
                            className="rounded-full border-4 border-pink-600"
                            style={{ aspectRatio: '1 / 1' }}
                        />
                            <input
                                type="file"
                                id="profilePhoto"
                                name="profilePhoto"
                                onChange={(event) => {
                                    handleImageChange(event);
                                    handleChange(event);
                                    setFieldTouched('profilePhoto', true, true);
                                }}
                                className="absolute bottom-0 right-0 opacity-0 w-8 h-8 cursor-pointer"
                            />
                            <button
                                type="button"
                                onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                                className="absolute -bottom-2 right-0 bg-black text-white p-2 rounded-full opacity-50 hover:opacity-100 transition-opacity"
                                title="Cambiar imagen"
                            >
                                <FaCamera size={24} />
                            </button>
                        </div>
                        <div className="mt-4 flex flex-col w-full">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nombre</label>
                                <Field
                                    id="name"
                                    name="name"
                                    placeholder="Introduce tu nombre"
                                    className="mt-1 block w-full p-2 bg-transparent border border-gray-600 rounded-md text-gray-300 overflow-hidden text-ellipsis"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        handleChange(e);
                                        setFieldTouched('name', true, true);
                                    }}
                                />
                                {errors.name && touched.name ? (
                                    <div className="text-pink-400 text-sm pt-2">{errors.name}</div>
                                ) : null}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 pt-4">Email</label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Introduce tu email"
                                    className="mt-1 block w-full p-2 bg-transparent border border-gray-600 rounded-md text-gray-300 overflow-hidden text-ellipsis"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        handleChange(e);
                                        setFieldTouched('email', true, true);
                                    }}
                                />
                                {errors.email && touched.email ? (
                                    <div className="text-pink-400 text-sm pt-2">{errors.email}</div>
                                ) : null}
                            </div>

                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 pt-4">Contraseña</label>
                                <div className="relative">
                                    <Field
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"} // Alternar tipo de campo
                                        placeholder="Introduce tu contraseña"
                                        className="mt-1 block w-full p-2 bg-transparent border border-gray-600 rounded-md text-gray-300 overflow-hidden text-ellipsis pr-12" // Espacio para el ícono
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            handleChange(e);
                                            setFieldTouched('password', true, true);
                                        }}
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-300 text-xl"
                                        onClick={() => setShowPassword(prev => !prev)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Alternar entre los íconos */}
                                    </div>
                                </div>
                                {errors.password && touched.password ? (
                                    <div className="text-pink-400 text-sm pt-2">{errors.password}</div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-6">
                        <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#C87DAB] to-[#C12886] text-white rounded-md">
                            <span className="inline-block transition duration-300 hover:scale-110">
                                Actualizar Perfil
                            </span>
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default UpdateProfile;