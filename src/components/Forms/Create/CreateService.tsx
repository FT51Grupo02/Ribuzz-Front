'use client';

import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useAuth } from '@/components/Context/AuthContext';
import Image from 'next/image';
import { FaCamera, FaVideo } from 'react-icons/fa';
import { IService } from '@/interfaces/Types';

interface FormValues {
  name: string;
  price: number;
  description: string;
  images: File[];
  videos: File[];
  details: string[];
  categories: string[];
  providerInfo: {
    name: string;
    contact: string;
    location: string;
  };
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre es requerido'),
  price: Yup.number().required('Precio es requerido').positive('El precio debe ser positivo'),
  description: Yup.string().required('Descripción es requerida'),
  images: Yup.array().of(Yup.mixed().required('Imagen es requerida')).min(1, 'Debes seleccionar al menos 1 imagen').max(4, 'No puedes seleccionar más de 4 imágenes'),
  videos: Yup.array().of(Yup.mixed().required('Video es requerido')).min(1, 'Debes seleccionar al menos 1 video'),
  details: Yup.array().of(Yup.string()).optional(),
  categories: Yup.array().of(Yup.string()).min(1, 'Debes seleccionar al menos una categoría'),
  providerInfo: Yup.object().shape({
    name: Yup.string().required('Nombre del proveedor es requerido'),
    contact: Yup.string().required('Contacto del proveedor es requerido'),
    location: Yup.string().required('Ubicación del servicio es requerida'),
  }),
});

const CreateService: React.FC = () => {
  const { createService, token } = useAuth();
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

  const handleSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    const { setSubmitting, resetForm } = formikHelpers;
    
    Swal.fire({
      title: 'Creando servicio',
      text: 'Por favor, espera mientras se crea el servicio...',
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

      const updatedValues: IService = {
        name: values.name,
        price: values.price,
        description: values.description,
        images: uploadedImages.filter((url): url is string => url !== null),
        videos: uploadedVideos.filter((url): url is string => url !== null),
        categories: values.categories,
        details: values.details,
        providerInfo: values.providerInfo,
        publicationDate: new Date().toISOString(),
        type: 'service' as const,
      };

      console.log('Datos a enviar:', JSON.stringify(updatedValues, null, 2));

      const createdService = await createService(updatedValues);
      console.log('Servicio creado exitosamente', createdService);

      Swal.fire({
        title: '¡Éxito!',
        text: 'El servicio ha sido creado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      resetForm();
      setImagePreviews([]);
      setVideoPreviews([]);

    } catch (error) {
      console.error('Error al crear el servicio', error);
      console.error('Token:', token);
      console.error('API URL:', process.env.NEXT_PUBLIC_API_URL);
      console.error('Full error object:', JSON.stringify(error, null, 2));

      Swal.fire({
        title: 'Error',
        text: `Hubo un problema al crear el servicio: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void) => {
    const files = event.currentTarget.files;
    if (files && files.length > 0 && files.length <= 4) {
      const fileArray = Array.from(files);
      const imagePreviewsArray = fileArray.map(file => URL.createObjectURL(file));
      setImagePreviews(imagePreviewsArray);
      setFieldValue('images', fileArray);
      setImageError(null);
    } else {
      setImageError('Debes seleccionar entre 1 y 4 imágenes.');
      setImagePreviews([]);
      setFieldValue('images', []);
      Swal.fire({
        title: 'Error en la selección de imágenes',
        text: 'Debes seleccionar entre 1 y 4 imágenes para el servicio.',
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
        text: 'Debes seleccionar al menos un video para el servicio.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center lg:w-10/12'>
      <Formik
        initialValues={{
          name: '',
          price: 0,
          description: '',
          images: [] as File[],
          videos: [] as File[],
          details: [] as string[],
          categories: [] as string[],
          providerInfo: { name: '', contact: '', location: '' },
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting, validateForm, values }) => (
          <Form className='w-full max-w-3xl bg-black bg-opacity-50 p-8 rounded-xl shadow-lg border border-pink-500 border-opacity-50 mb-10'>
            <h1 className='text-white text-3xl font-bold mb-6 text-center'>Publicar un Servicio</h1>
            
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
                id="serviceImages"
                name="images"
                onChange={(event) => handleImageChange(event, setFieldValue)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                multiple
                accept="image/*"
              />
              <button
                type="button"
                onClick={() => (document.querySelector('input[type="file"]#serviceImages') as HTMLInputElement)?.click()}
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
                id="serviceVideos"
                name="videos"
                onChange={(event) => handleVideoChange(event, setFieldValue)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                multiple
                accept="video/*"
              />
              <button
                type="button"
                onClick={() => (document.querySelector('input[type="file"]#serviceVideos') as HTMLInputElement)?.click()}
                className="absolute -bottom-6 right-0 bg-pink-500 text-white p-2 rounded-full shadow-md hover:bg-pink-600 transition-colors"
                title="Cambiar videos"
              >
                <FaVideo size={24} />
              </button>
              {videoError && <div className="text-pink-400 mt-2">{videoError}</div>}
            </div>

            <div className='mb-6'>
              <label htmlFor='name' className='block text-white text-lg mb-2'>Nombre del Servicio</label>
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
              <label htmlFor='providerInfo.name' className='block text-white text-lg mb-2'>Nombre del Proveedor</label>
              <Field
                id='providerInfo.name'
                name='providerInfo.name'
                type='text'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='providerInfo.name' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='providerInfo.contact' className='block text-white text-lg mb-2'>Contacto del Proveedor</label>
              <Field
                id='providerInfo.contact'
                name='providerInfo.contact'
                type='text'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='providerInfo.contact' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='providerInfo.location' className='block text-white text-lg mb-2'>Ubicación del Servicio</label>
              <Field
                id='providerInfo.location'
                name='providerInfo.location'
                type='text'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='providerInfo.location' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className="flex justify-center mt-6">
              <button
                type='submit'
                disabled={isSubmitting}
                className='bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-3 px-6 rounded-full transition-colors disabled:opacity-50'
              >
                <span className="inline-block text-white hover:scale-110 transition duration-300">
                  {isSubmitting ? 'Creando Servicio...' : 'Crear Servicio'}
                </span>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateService;