'use client';
import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useAuth } from '@/components/Context/AuthContext';
import Image from 'next/image';
import { FaCamera } from 'react-icons/fa';

// Definición de los valores iniciales del formulario
interface FormValues {
  name: string;
  price: number;
  description: string;
  stock: number;
  images: string[];
  videos: string;
  categories: string[];
  details: string[];
}

// Validación del formulario con Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre es requerido'),
  price: Yup.number().required('Precio es requerido').positive('El precio debe ser positivo'),
  description: Yup.string().required('Descripción es requerida'),
  stock: Yup.number().required('Stock es requerido').min(0, 'El stock no puede ser negativo'),
  images: Yup.array().of(Yup.string().url('URL inválida')).min(4, 'Debes seleccionar exactamente 4 imágenes').max(4, 'No puedes seleccionar más de 4 imágenes'),
  videos: Yup.array().of(Yup.string().url('URL inválida')).optional(),
  categories: Yup.array().of(Yup.string().required('Categoría es requerida')).required('Al menos una categoría es requerida'),
  details: Yup.array().of(Yup.string()).optional(),
});

const CreateProduct: React.FC = () => {
  const { token } = useAuth(); // Obtener el token del contexto
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  // Subida de imágenes a Cloudinary
  const handleImageUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        return data.secure_url;
      } else {
        console.error('Error al subir la imagen:', data);
        return null;
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      return null;
    }
  };

  // Manejo del envío del formulario
  const handleSubmit = async (values: FormValues, { resetForm }: any) => {
    console.log('Datos enviados al backend:', values);

    // Subir imágenes a Cloudinary
    const uploadedImages = await Promise.all(
      values.images.map(async (file) => {
        const imageFile = new File([file], file); // Crear un archivo desde el nombre del archivo
        return await handleImageUpload(imageFile);
      })
    );

    const updatedValues = {
      ...values,
      images: uploadedImages.filter((url) => url !== null),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedValues),
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

  // Manejo del cambio de imagen
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void) => {
    const files = event.currentTarget.files;
    if (files && files.length === 4) {
      const fileArray = Array.from(files);
      const imagePreviewsArray = fileArray.map(file => URL.createObjectURL(file));
      setImagePreviews(imagePreviewsArray);

      // Subir imágenes a Cloudinary
      const uploadedImageUrls = await Promise.all(
        fileArray.map(file => handleImageUpload(file))
      );
      setFieldValue('images', uploadedImageUrls.filter(url => url !== null));

      setImageError(null);
    } else {
      setImageError('Debes seleccionar exactamente 4 imágenes.');
      setImagePreviews([]);
      setFieldValue('images', []);
    }
  };

  return (
    <div className='min-h-screen p-8 flex flex-col items-center lg:w-10/12'>
      <h1 className='text-white text-3xl font-bold mb-6'>Publicar un Producto</h1>
      <Formik
        initialValues={{
          name: '',
          price: 0,
          description: '',
          stock: 0,
          images: [], 
          videos: '',
          categories: [],
          details: []
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className='w-full max-w-3xl bg-black bg-opacity-50 p-8 rounded-xl shadow-lg'>
            <div className="relative mb-6">
              <div className="flex justify-center space-x-4 mb-4">
                {imagePreviews.map((imagePreview, index) => (
                  <Image
                    key={index}
                    src={imagePreview}
                    alt={`Imagen ${index + 1}`}
                    width={120}
                    height={120}
                    quality={100}
                    objectFit="cover"
                    className="rounded-lg border-4 border-pink-500"
                    style={{ aspectRatio: '1 / 1' }}
                  />
                ))}
              </div>
              <input
                type="file"
                id="productImages"
                name="productImages"
                onChange={(event) => handleImageChange(event, setFieldValue)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                multiple
                accept="image/*"
              />
              <button
                type="button"
                onClick={() => (document.querySelector('input[type="file"]#productImages') as HTMLInputElement)?.click()}
                className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full shadow-md hover:bg-pink-600 transition-colors"
                title="Cambiar imágenes"
              >
                <FaCamera size={24} />
              </button>
              {imageError && <div className="text-pink-400 mt-2">{imageError}</div>}
            </div>

            <div className='mb-6'>
              <label htmlFor='name' className='block text-white text-lg mb-2'>Nombre</label>
              <Field
                id='name'
                name='name'
                type='text'
                className='w-full p-3 rounded bg-black bg-opacity-50 text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='name' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='price' className='block text-white text-lg mb-2'>Precio</label>
              <Field
                id='price'
                name='price'
                type='number'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='price' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='description' className='block text-white text-lg mb-2'>Descripción</label>
              <Field
                id='description'
                name='description'
                as='textarea'
                rows='4'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='description' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='stock' className='block text-white text-lg mb-2'>Stock</label>
              <Field
                id='stock'
                name='stock'
                type='number'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='stock' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='videos' className='block text-white text-lg mb-2'>Video (URL)</label>
              <Field
                id='videos'
                name='videos'
                type='text'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('videos', e.target.value.split(',').map(url => url.trim()))}
              />
              <ErrorMessage name='videos' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='categories' className='block text-white text-lg mb-2'>Categorías (Separadas por comas)</label>
              <Field
                id='categories'
                name='categories'
                type='text'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('categories', e.target.value.split(',').map(cat => cat.trim()))}
              />
              <ErrorMessage name='categories' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='details' className='block text-white text-lg mb-2'>Detalles (Separados por comas)</label>
              <Field
                id='details'
                name='details'
                type='text'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('details', e.target.value.split(',').map(detail => detail.trim()))}
              />
              <ErrorMessage name='details' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className="flex justify-center mt-6">
              <button
                type='submit'
                className='bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-3 px-6 rounded-full transition-colors'
              >
                <span className="inline-block text-white hover:scale-110 transition duration-300">
                  Crear Producto
                </span>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateProduct;
