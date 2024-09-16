'use client';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/components/Context/AuthContext'; 
import { ILoginPropsUser } from '@/interfaces/Types';
import GoogleLoginButton from '../../Google/Button/GoogleButton';
import Swal from 'sweetalert2';
import Link from 'next/link';

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
  const { loginUserC } = useAuth();

  const handleSubmit = async (values: ILoginPropsUser) => {
    try {
      const result = await loginUserC(values);
      if (result.success) {
        router.push('/');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: result.message || 'El correo o contraseña es incorrecto.',
        });
      }
    } catch (error) {
      console.error("Error en el login:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al intentar iniciar sesión. Inténtalo de nuevo.',
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black overflow-x-hidden">
      <div className="hidden md:flex md:w-1/2 flex-shrink-0 relative md:translate-x-3 lg:translate-x-0">
        <Image 
          src="https://res.cloudinary.com/devnzokpy/image/upload/v1725918381/14_ikwddp.webp" 
          alt="Imagen de fondo" 
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
        />
      </div>
     
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-black text-white relative z-10">
        <div className="md:hidden relative w-full mb-6">
          <Image 
            src="https://res.cloudinary.com/devnzokpy/image/upload/v1725918380/5_yzrcts.webp" 
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
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleChange, values, setFieldTouched, isSubmitting }) => (
              <Form className="w-full">
                <div className="mb-4">
                  <Field
                    type="email"
                    name="email"
                    placeholder="tucorreo@mail.com"
                    className="w-full p-3 text-base md:text-lg rounded-lg bg-[#303030] text-white border border-[#303030] placeholder-gray-300"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setFieldTouched('email', true, false);
                    }}
                  />
                  {errors.email && touched.email && (
                    <div className="text-pink-300 text-sm pt-2">{errors.email}</div>
                  )}
                </div>
                <div className="mb-4 relative">
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="●●●●●●●●●"
                      className="w-full p-3 text-base md:text-lg rounded-lg bg-[#303030] text-white border border-[#303030] placeholder-gray-300 pr-12"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        setFieldTouched('password', true, false);
                      }}
                    />
                    <div
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-300 text-xl"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                  {touched.password && isSubmitting && (
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
                  disabled={isSubmitting}
                >
                  <span className="transition duration-300 hover:scale-110 inline-block text-lg md:text-xl">
                    {isSubmitting ? 'Ingresando...' : 'Ingresar'}
                  </span>
                </button>
                <div className="text-center mb-4">
                  <Link href="/forgot-password" className="text-pink-300 hover:text-pink-400 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
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