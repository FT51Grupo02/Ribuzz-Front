'use client';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/components/Context/AuthContext'; // Importar el contexto de autenticación
import { ILoginPropsUSer } from '@/interfaces/Types';
import GoogleLoginButton from '../../Google/Button/GoogleButton';

// Definir el esquema de validación usando Yup
const validationSchema = Yup.object({
  email: Yup.string().email('Cuenta de email inválida').required('Requerido'),
  password: Yup.string()
    .min(8, 'La contraseña debe poseer 8 caracteres mínimo')
    .matches(/[A-Z]/, 'La contraseña debe poseer al menos una mayúscula')
    .matches(/[!@#$%^&*]/, 'La contraseña debe poseer al menos un carácter especial')
    .required('Requerido'),
});

const LoginUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { loginUserC } = useAuth(); // Obtener la función de login del contexto

  const handleSubmit = async (values: ILoginPropsUSer) => {
    try {
      console.log("Valores enviados al backendCliente:", values);
      const isSuccess = await loginUserC(values); // Llamar a la función de login con los valores del formulario
      if (isSuccess) {
        router.push('/'); // Redirigir al usuario después de un login exitoso
      } else {
        console.error("Login fallido, no se pudo redirigir");
      }
    } catch (error) {
      console.error("Error en el login:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black overflow-x-hidden">
      <div className="hidden md:flex md:w-1/2 flex-shrink-0 relative md:translate-x-3 lg:translate-x-0">
        <Image 
          src="https://res.cloudinary.com/devnzokpy/image/upload/v1725481346/14_mq20yl.png" 
          alt="Imagen de fondo" 
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
        />
      </div>
     
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-black text-white relative z-10">
        {/* Imagen en la parte superior solo en móviles */}
        <div className="md:hidden relative w-full mb-6">
          <Image 
            src="https://res.cloudinary.com/devnzokpy/image/upload/v1725481344/5_tom1re.png" 
            alt="Logo" 
            width={200} 
            height={100}
            className="mx-auto"
            quality={100}
          />
        </div>
        <div className="w-full max-w-md md:max-w-md p-6 md:p-8 bg-[#000000] rounded-xl shadow-lg mb-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 md:mb-6 lg:text-7xl">INGRESAR</h1>
          <h3 className="text-base md:text-lg font-medium mb-4 md:mb-6">Ingresa con tu cuenta de usuario</h3>
          <Formik
            initialValues={{ email: '', password: '', rol: 'cliente' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleChange, values, setFieldTouched }) => (
              <Form className="w-full">
                <div className="mb-4">
                  <Field
                    type="email"
                    name="email"
                    placeholder="tucorreo@mail.com"
                    className="w-full p-3 text-base md:text-lg rounded-lg bg-[#303030] text-white border border-[#303030] placeholder-gray-300"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setFieldTouched('email', true, true);
                    }}
                  />
                  {errors.email && touched.email && (
                    <div className="text-pink-300 text-sm pt-2">{errors.email}</div>
                  )}
                </div>
                <div className="mb-4 relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="●●●●●●●●●"
                    className="w-full p-3 text-base md:text-lg rounded-lg bg-[#303030] text-white border border-[#303030] placeholder-gray-300"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setFieldTouched('password', true, true);
                    }}
                  />
                  {touched.password && (
                    <div className="text-pink-300 text-sm pt-2">
                      {!values.password.match(/[A-Z]/) && 'Debe incluir al menos una mayúscula. '}
                      {!values.password.match(/[!@#$%^&*]/) && 'Debe incluir al menos un carácter especial. '}
                      {values.password.length < 8 && 'Debe tener al menos 8 caracteres. '}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full p-3 mb-6 text-white font-semibold rounded-full bg-gradient-to-r from-[#C87DAB] to-[#C12886] shadow-md hover:shadow-lg transition-shadow"
                >
                  <span className="transition duration-300 hover:scale-110 inline-block text-lg md:text-xl">
                    Ingresar
                  </span>
                </button>
                <hr className="border-t-1 border-pink-400 border-opacity-60 mb-2 pb-4" />
              </Form>
            )}
          </Formik>
          <div className="flex flex-col items-center">
            <h5 className="text-sm md:text-base mb-2">O continúa con:</h5>
            <GoogleLoginButton /> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;