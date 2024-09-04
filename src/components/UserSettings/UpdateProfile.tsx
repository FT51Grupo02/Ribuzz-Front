'use client';
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useAuth } from '@/components/Context/AuthContext';
import { updateUserProfile } from '@/helpers/user.helper';
import Image from 'next/image';
import { FaCamera } from 'react-icons/fa';

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
    const { token } = useAuth();
    const [imagePreview, setImagePreview] = useState<string>('https://res.cloudinary.com/devnzokpy/image/upload/v1725481343/0_gytttz.png');
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const id = localStorage.getItem('userId');
        if (id) setUserId(id);
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

        if (!token || !userId) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se ha encontrado el token o ID de usuario.'
            });
            return;
        }

        const profileData = {
            name: values.name,
            email: values.email,
            password: values.password,
        };

        try {
            await updateUserProfile(userId, profileData, token);
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

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
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
                                className="object-cover rounded-full border-2 border-gray-300"
                            />
                            <input
                                type="file"
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
                                    <div className="text-red-500 text-sm">{errors.name}</div>
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
                                    <div className="text-red-500 text-sm">{errors.email}</div>
                                ) : null}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 pt-4">Contraseña</label>
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Introduce tu contraseña"
                                    className="mt-1 block w-full p-2 bg-transparent border border-gray-600 rounded-md text-gray-300 overflow-hidden text-ellipsis"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        handleChange(e);
                                        setFieldTouched('password', true, true);
                                    }}
                                />
                                {errors.password && touched.password ? (
                                    <div className="text-red-500 text-sm">{errors.password}</div>
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
