'use client';

import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useAuth } from '@/components/Context/AuthContext';
import Image from 'next/image';
import { FaCamera, FaVideo } from 'react-icons/fa';
import { IEvent } from '@/interfaces/Types';

interface FormValues {
  name: string;
  price: number;
  description: string;
  images: File[];
  videos: File[];
  ProviderInfo: {
    name: string;
    contact: string;
    location: string;
  };
  duration: string;
  date: string;
  time: string;
  stock: number;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre es requerido'),
  price: Yup.number().required('Precio es requerido').positive('El precio debe ser positivo'),
  description: Yup.string().required('Descripción es requerida'),
  images: Yup.array().of(Yup.mixed().required('Imagen es requerida')).min(4, 'Debes seleccionar exactamente 4 imágenes').max(4, 'Debes seleccionar exactamente 4 imágenes'),
  videos: Yup.array().of(Yup.mixed().required('Video es requerido')).min(1, 'Debes seleccionar exactamente 1 video').max(1, 'Debes seleccionar exactamente 1 video'),
  ProviderInfo: Yup.object().shape({
    name: Yup.string().required('Nombre del proveedor es requerido'),
    contact: Yup.string().required('Contacto del proveedor es requerido'),
    location: Yup.string().required('Ubicación del evento es requerida'),
  }),
  duration: Yup.string().required('Duración es requerida'),
  date: Yup.date().required('Fecha es requerida'),
  time: Yup.string().required('Hora es requerida'),
  stock: Yup.number().required('Stock es requerido').positive('El stock debe ser positivo'),
});

const CreateEvent: React.FC = () => {
  const { createEvent, token } = useAuth();
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

  const validateForm = async (values: FormValues) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = err.inner.map(e => e.message);
        await Swal.fire({
          title: 'Campos incompletos',
          html: `Por favor, completa los siguientes campos:<br><br>${errors.join('<br>')}`,
          icon: 'warning',
          confirmButtonText: 'Entendido'
        });
      }
      return false;
    }
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    const isValid = await validateForm(values);
    if (!isValid) {
      setSubmitting(false);
      return;
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres crear este evento?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear evento',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Creando evento',
        text: 'Por favor, espera mientras se crea el evento...',
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

        const updatedValues: Omit<IEvent, 'id'> = {
          name: values.name,
          price: values.price,
          description: values.description,
          images: uploadedImages.filter((url): url is string => url !== null),
          videos: uploadedVideos.filter((url): url is string => url !== null),
          ProviderInfo: values.ProviderInfo,
          duration: values.duration,
          date: values.date,
          time: [values.time],
          stock: values.stock,
          publicationDate: new Date().toISOString(),
          type: 'event' as const,
          location: values.ProviderInfo.location,
        };

        console.log('Datos a enviar:', JSON.stringify(updatedValues, null, 2));

        const createdEvent = await createEvent(updatedValues);

        console.log('Evento creado exitosamente', createdEvent);

        await Swal.fire({
          title: '¡Éxito!',
          text: 'El evento ha sido creado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        setImagePreviews([]);
        setVideoPreviews([]);

      } catch (error) {
        console.error('Error al crear el evento', error);
        console.error('Token:', token);
        console.error('API URL:', process.env.NEXT_PUBLIC_API_URL);
        
        let errorMessage = 'Error desconocido';
        if (error instanceof Error) {
          errorMessage = error.message;
          console.error('Error details:', error.stack);
        } else if (typeof error === 'object' && error !== null) {
          errorMessage = JSON.stringify(error);
        }
        
        console.error('Full error object:', errorMessage);

        await Swal.fire({
          title: 'Error',
          text: `Hubo un problema al crear el evento: ${errorMessage}`,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      } finally {
        setSubmitting(false);
      }
    } else {
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
        text: 'Debes seleccionar exactamente 4 imágenes para el evento.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    }
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void) => {
    const files = event.currentTarget.files;
    if (files && files.length === 1) {
      const fileArray = Array.from(files);
      const videoPreviewsArray = fileArray.map(file => URL.createObjectURL(file));
      setVideoPreviews(videoPreviewsArray);
      setFieldValue('videos', fileArray);
      setVideoError(null);
    } else {
      setVideoError('Debes seleccionar exactamente 1 video.');
      setVideoPreviews([]);
      setFieldValue('videos', []);
      Swal.fire({
        title: 'Error en la selección de video',
        text: 'Debes seleccionar exactamente 1 video para el evento.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center lg:w-10/12'>
      <Formik<FormValues>
        initialValues={{
          name: '',
          price: 0,
          description: '',
          images: [],
          videos: [],
          ProviderInfo: { name: '', contact: '', location: '' },
          duration: '',
          date: '',
          time: '',
          stock: 0,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting, validateForm, values }) => (
          <Form className='w-full max-w-3xl bg-black bg-opacity-50 p-8 rounded-xl shadow-lg border border-pink-500 border-opacity-50 mb-10'>
            <h1 className='text-white text-3xl font-bold mb-6 text-center'>Publicar un Evento</h1>
            
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
                id="eventImages"
                name="images"
                onChange={(event) => handleImageChange(event, setFieldValue)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                multiple
                accept="image/*"
              />
              <button
                type="button"
                onClick={() => (document.querySelector('input[type="file"]#eventImages') as HTMLInputElement)?.click()}
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
                id="eventVideos"
                name="videos"
                onChange={(event) => handleVideoChange(event, setFieldValue)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                accept="video/*"
              />
              <button
                type="button"
                onClick={() => (document.querySelector('input[type="file"]#eventVideos') as HTMLInputElement)?.click()}
                className="absolute -bottom-6 right-0 bg-pink-500 text-white p-2 rounded-full shadow-md hover:bg-pink-600 transition-colors"
                title="Cambiar videos"
              >
                <FaVideo size={24} />
              </button>
              {videoError && <div className="text-pink-400 mt-2">{videoError}</div>}
            </div>

            <div className='mb-6'>
              <label htmlFor='name' className='block text-white text-lg mb-2'>Nombre del Evento</label>
              <Field
                id='name'
                name='name'
                type='text'
                className='w-full p-3 rounded bg-black bg-opacity-50 text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='name' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='price' className='block text-white text-lg mb-2'>Precio de ticket</label>
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
              <label htmlFor='duration' className='block text-white text-lg mb-2'>Duración</label>
              <Field
                id='duration'
                name='duration'
                type='text'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='duration' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='date' className='block text-white text-lg mb-2'>Fecha</label>
              <Field
                id='date'
                name='date'
                type='date'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='date' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='time' className='block text-white text-lg mb-2'>Hora</label>
              <Field
                id='time'
                name='time'
                type='time'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='time' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='stock' className='block text-white text-lg mb-2'>Capacidad (Stock)</label>
              <Field
                id='stock'
                name='stock'
                type='number'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='stock' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='ProviderInfo.name' className='block text-white text-lg mb-2'>Nombre del Organizador</label>
              <Field
                id='ProviderInfo.name'
                name='ProviderInfo.name'
                type='text'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='ProviderInfo.name' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='ProviderInfo.contact' className='block text-white text-lg mb-2'>Contacto del Organizador</label>
              <Field
                id='ProviderInfo.contact'
                name='ProviderInfo.contact'
                type='text'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='ProviderInfo.contact' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className='mb-6'>
              <label htmlFor='ProviderInfo.location' className='block text-white text-lg mb-2'>Ubicación del Evento</label>
              <Field
                id='ProviderInfo.location'
                name='ProviderInfo.location'
                type='text'
                className='w-full p-3 rounded bg-black text-white border border-pink-400 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500'
              />
              <ErrorMessage name='ProviderInfo.location' component='div' className='text-pink-400 mt-1' />
            </div>

            <div className="flex justify-center mt-6">
              <button
                type='submit'
                disabled={isSubmitting}
                className='bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-3 px-6 rounded-full transition-colors disabled:opacity-50'
              >
                <span className="inline-block text-white hover:scale-110 transition duration-300">
                  {isSubmitting ? 'Creando Evento...' : 'Crear Evento'}
                </span>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateEvent;