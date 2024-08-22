'use client';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { FormValues } from '../../types/FormValues';
import Image from 'next/image';

// Definir el esquema de validación usando Yup
const validationSchema = Yup.object({
  userType: Yup.string().oneOf(['emprendedor', 'cliente'], 'Selecciona una opción').required('Selecciona una opción'),
});

const RegisterOption = () => {
  const router = useRouter();

  const handleSubmit = (values: FormValues) => {
    if (values.userType === 'emprendedor') {
      router.push('/login/entrepeneur');
    } else if (values.userType === 'cliente') {
      router.push('/login/user');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
         
      {/* Imagen para pantallas grandes */}
      <div className="hidden md:flex md:w-1/2 flex-shrink-0 relative">
        <Image 
          src="/0.png" 
          alt="Imagen de fondo" 
          layout="fill" 
          style={{ objectFit: 'cover' }} 
        />
      </div>
     
     {/* Sección del Formulario */}
    <div className="flex-1 flex-col items-center justify-center p-1 md:p-6 bg-black text-white">
        <div className="md:hidden relative w-full h-40 mb-4 bg-black flex items-center justify-center">
          <Image 
            src="/5.png" 
            alt="Logo" 
            layout="fill" 
            style={{ objectFit: 'contain' }} 
            className="rounded-lg"
          />
        </div>
      <div className="w-full max-w-md p-8 bg-[#000000] rounded-xl shadow-lg border-b border-[#C877A9]">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-10 font-poppins text-white">REGISTRATE</h1>
        <h3 className="text-sm md:text-md font-small mb-4 md:mb-6 font-poppins text-white">Elige una opcion:</h3>
        <Formik
          initialValues={{ userType: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="w-full">
              <div className="mb-3 md:mb-4">
                <button
                  type="submit"
                  className="w-full p-3 md:p-4 mb-2 text-sm md:text-base text-white font-semibold rounded-full bg-gradient-to-r from-[#C87DAB] to-[#C12886] shadow-md hover:shadow-lg transition-shadow"
                  onClick={() => setFieldValue('userType', 'emprendedor')}
                >
                  CUENTA DE EMPRENDEDOR
                </button>
                <button
                  type="submit"
                  className="w-full p-3 md:p-4 text-sm md:text-base text-white font-semibold rounded-full bg-gradient-to-r from-[#C87DAB] to-[#C12886] shadow-md hover:shadow-lg transition-shadow"
                  onClick={() => setFieldValue('userType', 'cliente')}
                >
                  CUENTA DE USUARIO
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
    </div>
  );
};

export default RegisterOption;

