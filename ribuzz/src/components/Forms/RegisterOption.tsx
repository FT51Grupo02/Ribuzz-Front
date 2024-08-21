'use client';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { FormValues } from '../../types/FormValues';

// Definir el esquema de validación usando Yup
const validationSchema = Yup.object({
  userType: Yup.string().oneOf(['emprendedor', 'cliente'], 'Selecciona una opción').required('Selecciona una opción'),
});

const RegisterOption = () => {
  const router = useRouter();

  const handleSubmit = (values: FormValues) => {
    if (values.userType === 'emprendedor') {
      router.push('/entrepeneurlogin');
    } else if (values.userType === 'cliente') {
      router.push('/clientlogin');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Imagen para pantallas pequeñas */}
      <div className="block md:hidden flex-shrink-0 bg-[url('/assets/0.png')] bg-cover bg-center h-[45vh] w-full bg-no-repeat"></div>
      
      {/* Imagen para pantallas grandes */}
      <div className="hidden md:flex md:w-1/2 flex-shrink-0 bg-[url('/assets/0.png')] bg-cover bg-center bg-no-repeat h-full"></div>
      
      {/* Sección del Formulario */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-black text-white">
        <div className="w-full max-w-md p-8 bg-[#000000] rounded-xl shadow-lg border-b border-[#C877A9]">
          <h1 className="text-4xl font-bold mb-10 font-poppins text-white">REGISTER</h1>
          <h3 className="text-md font-small mb-6 font-poppins text-white">Choose your option:</h3>
          <Formik
            initialValues={{ userType: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form className="w-full">
                <div className="mb-4">
                  <button
                    type="submit"
                    className="w-full p-4 mb-2 text-white font-semibold rounded-full bg-gradient-to-r from-[#C87DAB] to-[#C12886] shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => setFieldValue('userType', 'emprendedor')}
                  >
                    CUENTA DE EMPRENDEDOR
                  </button>
                  <button
                    type="submit"
                    className="w-full p-4 text-white font-semibold rounded-full bg-gradient-to-r from-[#C87DAB] to-[#C12886] shadow-md hover:shadow-lg transition-shadow"
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

