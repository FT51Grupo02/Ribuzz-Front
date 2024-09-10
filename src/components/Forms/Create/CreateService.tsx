'use client'
import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2'; // Importar SweetAlert2

// Definición de los valores iniciales del formulario
interface FormValues {
  name: string;
  price: number;
  description: string;
  stock: number;
  images: string[];
}

// Validación del formulario con Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre es requerido'),
  price: Yup.number().required('Precio es requerido').positive('El precio debe ser positivo'),
  description: Yup.string().required('Descripción es requerida'),
  stock: Yup.number().required('Stock es requerido').min(0, 'El stock no puede ser negativo'),
  images: Yup.array().of(Yup.string().url('URL inválida')).required('Al menos una imagen es requerida'),
});

const CreateService: React.FC = () => {
  const handleSubmit = async (values: FormValues) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Error al crear el producto');
      }

      const data = await response.json();
      console.log('Producto creado exitosamente', data);

      // Mostrar alerta de éxito
      Swal.fire({
        title: '¡Éxito!',
        text: 'El producto ha sido creado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      // Aquí podrías redirigir al usuario o realizar otras acciones

    } catch (error) {
      console.error('Error al crear el producto', error);

      // Mostrar alerta de error
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al crear el producto.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  return (
    <div className='bg-black min-h-screen p-8 flex flex-col items-center'>
      <h1 className='text-white text-2xl mb-4'>Crear Servicio</h1>
      <Formik
        initialValues={{
          name: '',
          price: 0,
          description: '',
          stock: 0,
          images: [''] // Iniciar con un campo de imagen vacío
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('images', e.target.value.split(','))}
              />
              <ErrorMessage name='images' component='div' className='text-red-500' />
            </div>

            <button
              type='submit'
              className='bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-2 px-4 rounded-full'
            >
              Crear Producto
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateService;
