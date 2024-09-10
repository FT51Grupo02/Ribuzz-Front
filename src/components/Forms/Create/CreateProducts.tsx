'use client'
import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2'; 
import { useAuth } from '@/components/Context/AuthContext'; 

// Definición de los valores iniciales del formulario
interface FormValues {
  name: string;
  price: number;
  description: string;
  stock: number;
  images: string[];
  videos: string[];
  categories: string[];
}

// Validación del formulario con Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre es requerido'),
  price: Yup.number().required('Precio es requerido').positive('El precio debe ser positivo'),
  description: Yup.string().required('Descripción es requerida'),
  stock: Yup.number().required('Stock es requerido').min(0, 'El stock no puede ser negativo'),
  images: Yup.array().of(Yup.string().url('URL inválida')).required('Al menos una imagen es requerida'),
  videos: Yup.array().of(Yup.string().url('URL inválida')).optional(), // Validación opcional para videos
  categories: Yup.array().of(Yup.string().required('Categoría es requerida')).required('Al menos una categoría es requerida'),
});

const CreateProduct: React.FC = () => {
  const { token } = useAuth(); // Obtener el token del contexto

  const handleSubmit = async (values: FormValues, { resetForm }: any) => {
    console.log('Datos enviados al backend:', values);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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

      // Limpiar el formulario
      resetForm();

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
      <h1 className='text-white text-2xl mb-4'>Crear Producto</h1>
      <Formik
        initialValues={{
          name: '',
          price: 0,
          description: '',
          stock: 0,
          images: [], 
          videos: [],
          categories: []
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
              <label htmlFor='videos' className='block text-white mb-2'>Videos (URLs separadas por comas, opcional)</label>
              <Field
                id='videos'
                name='videos'
                type='text'
                className='w-full p-2 rounded bg-transparent text-white'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('videos', e.target.value.split(',').map(url => url.trim()))}
              />
              <ErrorMessage name='videos' component='div' className='text-red-500' />
            </div>

            <div className='mb-4'>
              <label htmlFor='categories' className='block text-white mb-2'>Categorías (Separadas por comas)</label>
              <Field
                id='categories'
                name='categories'
                type='text'
                className='w-full p-2 rounded bg-transparent text-white'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('categories', e.target.value.split(',').map(cat => cat.trim()))}
              />
              <ErrorMessage name='categories' component='div' className='text-red-500' />
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

export default CreateProduct;

