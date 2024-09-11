'use client';
import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { FaCamera } from 'react-icons/fa';

// Definición de los valores iniciales del formulario
interface FormValues {
  name: string;
  price: number;
  description: string;
  stock: number;
  images: string[];
  videos: string;
  details: string[];
}

// Validación del formulario con Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre es requerido'),
  price: Yup.number().required('Precio es requerido').positive('El precio debe ser positivo'),
  description: Yup.string().required('Descripción es requerida'),
  stock: Yup.number().required('Stock es requerido').min(0, 'El stock no puede ser negativo'),
  images: Yup.array().of(Yup.string().url('URL inválida')).required('Al menos una imagen es requerida'),
  videos: Yup.array().of(Yup.string().url('URL inválida')).optional(),
  details: Yup.array().of(Yup.string().required('Detalle es requerido')).required('Al menos un detalle es requerido'),
});

const CreateService: React.FC = () => {
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

  // Manejo del cambio de imagen
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void) => {
    const files = event.currentTarget.files;
    if (files && files.length) {
      if (files.length <= 4) {
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
        setImageError('Debes seleccionar hasta 4 imágenes.');
        setImagePreviews([]);
        setFieldValue('images', []);
      }
    }
  };

  // Manejo del envío del formulario
  const handleSubmit = async (values: FormValues, { resetForm }: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Error al crear el servicio');
      }

      const data = await response.json();
      console.log('Servicio creado exitosamente', data);

      // Mostrar alerta de éxito
      Swal.fire({
        title: '¡Éxito!',
        text: 'El servicio ha sido creado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      // Limpiar el formulario después del envío exitoso
      resetForm();

    } catch (error) {
      console.error('Error al crear el servicio', error);

      // Mostrar alerta de error
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al crear el servicio.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  return (
    <div className='min-h-screen p-8 flex flex-col items-center lg:w-10/12'>
      <h1 className='text-white text-3xl font-bold mb-6'>Publicar un Servicio</h1>
      <Formik
        initialValues={{
          name: '',
          price: 0,
          description: '',
          stock: 0,
          images: [], 
          videos: '', 
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
                  <img
                    key={index}
                    src={imagePreview}
                    alt={`Imagen ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-lg border-4 border-pink-500"
                    style={{ aspectRatio: '1 / 1' }}
                  />
                ))}
              </div>
              <input
                type="file"
                id="serviceImages"
                name="serviceImages"
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
                className='bg-gradient-to-r  from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-3 px-6 rounded-full transition-colors'
              >
                <span className="inline-block text-white hover:scale-110 transition duration-300">
                  Crear Servicio
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
