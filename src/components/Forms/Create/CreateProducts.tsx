'use client';

import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useAuth } from '@/components/Context/AuthContext';
import Image from 'next/image';
import { FaCamera, FaVideo } from 'react-icons/fa';

interface SellerInfo {
    name: string;
    contact: string;
}

interface FormValues {
  name: string;
  price: number;
  description: string;
  stock: number;
  images: File[];
  videos: File[];
  categories: string[];
  details: string[];
  sellerInfo: SellerInfo;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre es requerido'),
  price: Yup.number().required('Precio es requerido').positive('El precio debe ser positivo'),
  description: Yup.string().required('Descripción es requerida'),
  stock: Yup.number().required('Stock es requerido').min(0, 'El stock no puede ser negativo'),
  images: Yup.array().of(Yup.mixed().required('Imagen es requerida')).min(4, 'Debes seleccionar exactamente 4 imágenes').max(4, 'No puedes seleccionar más de 4 imágenes'),
  videos: Yup.array().of(Yup.mixed().required('Video es requerido')).min(1, 'Debes seleccionar al menos 1 video'),
  categories: Yup.array().of(Yup.string().required('Categoría es requerida')).min(1, 'Al menos una categoría es requerida'),
  details: Yup.array().of(Yup.string()).optional(),
  sellerInfo: Yup.object().shape({
    name: Yup.string().required('Nombre del vendedor es requerido'),
    contact: Yup.string().required('Contacto del vendedor es requerido'),
  }),
});

const initialValues: FormValues = {
  name: '',
  price: 0,
  description: '',
  stock: 0,
  images: [],
  videos: [],
  categories: [],
  details: [],
  sellerInfo: { name: '', contact: '' },
};

const CreateProduct: React.FC = () => {
  const { token } = useAuth();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const handleFileUpload = async (file: File, type: 'image' | 'video'): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${type}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        return data.secure_url;
      } else {
        console.error(`Error al subir el ${type}:`, data);
        return null;
      }
    } catch (error) {
      console.error(`Error al subir el ${type}:`, error);
      return null;
    }
  };

  const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: FormikHelpers<FormValues>) => {
    Swal.fire({
      title: 'Subiendo producto',
      text: 'Por favor, espera mientras se sube el producto...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const uploadedImages = await Promise.all(values.images.map(file => handleFileUpload(file, 'image')));
      const uploadedVideos = await Promise.all(values.videos.map(file => handleFileUpload(file, 'video')));

      const updatedValues = {
        ...values,
        images: uploadedImages.filter((url): url is string => url !== null),
        videos: uploadedVideos.filter((url): url is string => url !== null),
      };

      console.log('Datos a enviar:', JSON.stringify(updatedValues, null, 2));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedValues),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Respuesta del servidor:', response.status, errorData);
        throw new Error(`Error al crear el producto: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Producto creado exitosamente', data);

      Swal.fire({
        title: '¡Éxito!',
        text: 'El producto ha sido creado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      resetForm();
      setImagePreviews([]);
      setVideoPreviews([]);

    } catch (error) {
      console.error('Error al crear el producto', error);

      Swal.fire({
        title: 'Error',
        text: `Hubo un problema al crear el producto: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void) => {
    const files = event.currentTarget.files;
    if (files && files.length === 4) {
      const fileArray = Array.from(files);
      const imagePreviewsArray = fileArray.map(file => URL.createObjectURL(file));
      setImagePreviews(imagePreviewsArray);
      setFieldValue('images', fileArray);
      setImageError(null);
    } else {
      setImageError('Debes seleccionar exactamente 4 imágenes.');
      setImagePreviews([]);
      setFieldValue('images', []);
      Swal.fire({
        title: 'Error en la selección de imágenes',
        text: 'Debes seleccionar exactamente 4 imágenes para el producto.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    }
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void) => {
    const files = event.currentTarget.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const videoPreviewsArray = fileArray.map(file => URL.createObjectURL(file));
      setVideoPreviews(videoPreviewsArray);
      setFieldValue('videos', fileArray);
      setVideoError(null);
    } else {
      setVideoError('Debes seleccionar al menos un video.');
      setVideoPreviews([]);
      setFieldValue('videos', []);
      Swal.fire({
        title: 'Error en la selección de video',
        text: 'Debes seleccionar al menos un video para el producto.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center lg:w-10/12'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting, validateForm, values }) => (
          <Form className='w-full max-w-3xl bg-black bg-opacity-50 p-8 rounded-xl shadow-lg border border-pink-500 border-opacity-50'>
            <h1 className='text-white text-3xl font-bold mb-6 text-center'>Publicar un Producto</h1>
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
                name="images"
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

            <div className="relative mb-6">
              <div className="flex justify-center space-x-4 mb-4">
                {videoPreviews.map((videoPreview, index) => (
                  <video
                    key={index}
                    src={videoPreview}
                    width={120}
                    height={120}
                    className="rounded-lg border-4 border-pink-500"
                    style={{ aspectRatio: '1 / 1' }}
                  />
                ))}
              </div>
              <input
                type="file"
                id="productVideos"
                name="videos"
                onChange={(event) => handleVideoChange(event, setFieldValue)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                multiple
                accept="video/*"
              />
              <button
                type="button"
                onClick={() => (document.querySelector('input[type="file"]#productVideos') as HTMLInputElement)?.click()}
                className="absolute -bottom-6 right-0 bg-pink-500 text-white p-2 rounded-full shadow-md hover:bg-pink-600 transition-colors"
                title="Cambiar videos"
              >
                <FaVideo size={24} />
              </button>
              {videoError && <div className="text-pink-400 mt-2">{videoError}</div>}
            </div>

            <div className='mb-6'>
              <label htmlFor='name' className='block text-white text-lg mb-2'>Nombre del Producto</label>
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
              <label htmlFor='stock' className='block text-white text-lg mb-2'>Cantidad (Stock)</label>
              <Field
                id='stock'
                name='stock'
                type='number'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='stock' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='categories' className='block text-white text-lg mb-2'>Categorías</label>
              <Field
                as='select'
                id='categories'
                name='categories'
                multiple
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              >
                <option value='Electrónica'>Electrónica</option>
                <option value='Moda'>Moda</option>
                <option value='Hogar'>Hogar</option>
                <option value='Libros'>Libros</option>
              </Field>
              <ErrorMessage name='categories' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='details' className='block text-white text-lg mb-2'>Detalles (Separalos por comas)</label>
              <Field
                id='details'
                name='details'
                type='text'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('details', e.target.value.split(',').map(detail => detail.trim()))}
              />
              <ErrorMessage name='details' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='sellerInfo.name' className='block text-white text-lg mb-2'>Nombre del Vendedor</label>
              <Field
                id='sellerInfo.name'
                name='sellerInfo.name'
                type='text'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='sellerInfo.name' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='sellerInfo.contact' className='block text-white text-lg mb-2'>Contacto del Vendedor</label>
              <Field
                id='sellerInfo.contact'
                name='sellerInfo.contact'
                type='text'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='sellerInfo.contact' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className="flex justify-center mt-6">
              <button
                type='submit'
                disabled={isSubmitting}
                className='bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-3 px-6 rounded-full transition-colors disabled:opacity-50'
              >
                <span className="inline-block text-white hover:scale-110 transition duration-300">
                  {isSubmitting ? 'Creando Producto...' : 'Crear Producto'}
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