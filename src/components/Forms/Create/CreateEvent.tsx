'use client'
import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { useAuth } from '@/components/Context/AuthContext';

// Definición de los valores iniciales del formulario
interface FormValues {
  name: string;
  price: number;
  description: string;
  stock: number;
  images: string[];
  date: string; // Añadido el campo date
  location: string; // Añadido el campo location
}

// Validación del formulario con Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre es requerido'),
  price: Yup.number().required('Precio es requerido').positive('El precio debe ser positivo'),
  description: Yup.string().required('Descripción es requerida'),
  stock: Yup.number().required('Stock es requerido').min(0, 'El stock no puede ser negativo'),
  images: Yup.array().of(Yup.string().url('URL inválida')).required('Al menos una imagen es requerida'),
  date: Yup.string().required('Fecha es requerida').matches(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe estar en formato YYYY-MM-DD'),
  location: Yup.string().required('Ubicación es requerida'),
});

const CreateEvent: React.FC = () => {
  const { token } = useAuth(); // Obtener el token del contexto
  const handleSubmit = async (values: FormValues, { resetForm }: any) => {
    try {
      console.log('Datos enviados al backend:', values); // Añadido para ver qué se está enviando

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Error al crear el evento');
      }

      const data = await response.json();
      console.log('Evento creado exitosamente', data);

      // Mostrar alerta de éxito
      Swal.fire({
        title: '¡Éxito!',
        text: 'El evento ha sido creado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      // Limpiar el formulario después de enviarlo
      resetForm();

    } catch (error) {
      console.error('Error al crear el evento', error);

      // Mostrar alerta de error
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al crear el evento.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  return (
    <div className='bg-black min-h-screen p-8 flex flex-col items-center'>
      <h1 className='text-white text-2xl mb-4'>Crear Evento</h1>
      <Formik
        initialValues={{
          name: '',
          price: 0,
          description: '',
          stock: 0,
          images: [''], // Iniciar con un campo de imagen vacío
          date: '',
          location: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className='w-full max-w-lg bg-transparent p-6 rounded-lg'>
            <div className='mb-4'>
              <label htmlFor='name' className='block text-white mb-2'>Nombre</label>
              <Field
                id='name'
                name='name'
                type='text'
                className='w-full p-2 rounded bg-transparent text-white'
              />
              <ErrorMessage name='name' component='div' className='text-red-500' />
            </div>

            <div className='mb-4'>
              <label htmlFor='price' className='block text-white mb-2'>Precio</label>
              <Field
                id='price'
                name='price'
                type='number'
                className='w-full p-2 rounded bg-transparent text-white'
              />
              <ErrorMessage name='price' component='div' className='text-red-500' />
            </div>

            <div className='mb-4'>
              <label htmlFor='description' className='block text-white mb-2'>Descripción</label>
              <Field
                id='description'
                name='description'
                as='textarea'
                rows='4'
                className='w-full p-2 rounded bg-transparent text-white'
              />
              <ErrorMessage name='description' component='div' className='text-red-500' />
            </div>

            <div className='mb-4'>
              <label htmlFor='stock' className='block text-white mb-2'>Stock</label>
              <Field
                id='stock'
                name='stock'
                type='number'
                className='w-full p-2 rounded bg-transparent text-white'
              />
              <ErrorMessage name='stock' component='div' className='text-red-500' />
            </div>

            <div className='mb-4'>
              <label htmlFor='images' className='block text-white mb-2'>Imágenes (URLs separadas por comas)</label>
              <Field
                id='images'
                name='images'
                type='text'
                className='w-full p-2 rounded bg-transparent text-white'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('images', e.target.value.split(',').map(url => url.trim()))}
              />
              <ErrorMessage name='images' component='div' className='text-red-500' />
            </div>

            <div className='mb-4'>
              <label htmlFor='date' className='block text-white mb-2'>Fecha</label>
              <Field
                id='date'
                name='date'
                type='date'
                className='w-full p-2 rounded bg-transparent text-white'
              />
              <ErrorMessage name='date' component='div' className='text-red-500' />
            </div>

            <div className='mb-4'>
              <label htmlFor='location' className='block text-white mb-2'>Ubicación</label>
              <Field
                id='location'
                name='location'
                type='text'
                className='w-full p-2 rounded bg-transparent text-white'
              />
              <ErrorMessage name='location' component='div' className='text-red-500' />
            </div>

            <button
              type='submit'
              className='bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-2 px-4 rounded-full'
            >
              Crear Evento
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateEvent;
