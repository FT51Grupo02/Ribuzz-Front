'use client';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import Image from 'next/image';

// Definir la interfaz para los valores del formulario
interface FormValues {
  email: string;
  password: string;
}

// Definir el esquema de validación usando Yup
const validationSchema = Yup.object({
  email: Yup.string().email('Cuenta de email invalida').required('Requerido'),
  password: Yup.string()
    .min(8, 'La contraseña debe poseer 8 caracteres minimo')
    .matches(/[A-Z]/, 'La contraseña debe poseer al menos una mayuscula')
    .matches(/[!@#$%^&*]/, 'La contraseña debe poseer al menos un caracter especial')
    .required('Requerido'),
});

const RegisterClient = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (values: FormValues) => {
    console.log(values);
    // Implementar lógica de registro aquí
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
          
      {/* Imagen para pantallas grandes */}
      <div className="hidden md:flex md:w-1/2 flex-shrink-0 relative">
        <Image 
          src="/0.png" 
          alt="Imagen de fondo" 
          fill
          style={{ objectFit: 'cover' }} 
        />
      </div>

      {/* Sección del Formulario */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-black text-white">
      <div className="md:hidden relative w-full  mb-4 bg-black flex items-center justify-center">
          <Image 
            src="/5.png" 
            alt="Logo" 
            fill
            style={{ objectFit: 'contain' }} 
            className="rounded-lg"
          />
        </div>
        <div className="w-full max-w-sm md:max-w-md p-6 md:p-8 bg-[#000000] rounded-xl shadow-lg border-b border-[#C877A9]">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 font-poppins">INICIAR SESIÓN</h1>
          <h3 className="text-sm md:text-md font-medium mb-4 md:mb-6 font-poppins">Ingresa con tu cuenta de email</h3>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="w-full">
                <div className="mb-3 md:mb-4">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-2 md:p-4 mb-2 text-sm md:text-base rounded-lg bg-[#303030] text-white border border-[#303030] placeholder-[#FFFFFF]"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-xs md:text-sm">{errors.email}</div>
                  )}
                </div>
                <div className="mb-3 md:mb-4 relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="*******"
                    className="w-full p-2 md:p-4 mb-2 text-sm md:text-base rounded-lg bg-[#303030] text-white border border-[#303030] placeholder-[#FFFFFF]"
                  />
                  {errors.password && touched.password && (
                    <div className="text-red-500 text-xs md:text-sm">{errors.password}</div>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full p-3 md:p-4 mb-4 text-white font-semibold rounded-full bg-gradient-to-r from-[#C87DAB] to-[#C12886] shadow-md hover:shadow-lg transition-shadow text-sm md:text-base"
                >
                  Ingresa
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <div className="flex flex-col items-center mt-4 md:mt-6">
          <h5 className="text-xs md:text-sm font-poppins mb-2">O continua con:</h5>
          <button
            type="button"
            className="flex items-center bg-gray-800 text-white p-2 rounded-lg border border-gray-600 text-xs md:text-sm"
          >
            <FcGoogle className="w-4 h-4 md:w-6 md:h-6" />
            <span className="ml-2">Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterClient;
