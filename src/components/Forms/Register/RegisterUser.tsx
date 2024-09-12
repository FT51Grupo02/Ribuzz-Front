'use client';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Image from 'next/image';
import { useAuth } from '@/components/Context/AuthContext';
import { IRegisterProps } from '@/interfaces/Types';
import { useState } from 'react';
import Swal from 'sweetalert2';

// Definir el esquema de validación usando Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Requerido'),
  email: Yup.string().email('Cuenta de email inválida').required('Requerido'),
  password: Yup.string()
    .min(8, 'La contraseña debe poseer 8 caracteres mínimo')
    .matches(/[A-Z]/, 'La contraseña debe poseer al menos una mayúscula')
    .matches(/[!@#$%^&*]/, 'La contraseña debe poseer al menos un carácter especial')
    .required('Requerido'),
  date: Yup.date()
    .required('Fecha requerida')
    .typeError('Fecha inválida')
    .transform(value => (isNaN(value.getTime()) ? new Date() : value)),
  rol: Yup.string().oneOf(['emprendedor', 'cliente', 'admin'], 'Rol inválido').optional(),
});

/* const RegisterUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (values: IRegisterProps) => {
    try {
      const registerData = {
        name: values.name,
        email: values.email,
        password: values.password,
        date: new Date(values.date),
        rol: values.rol,
      };
  
      const result = await register(registerData);
  
      if (result) {
        console.log('User ID:', result.id);
        // Redirigir según el rol del usuario
        if (values.rol === 'emprendedor') {
          router.push('/register/entrepreneurq');
        } else if (values.rol === 'cliente') {
          router.push('/register/clientq');
        }
      }
    } catch (error) {
      // Manejar error de tipo unknown convirtiéndolo a Error y mostrando el mensaje
      if (error instanceof Error) {
        if (error.message.includes('Usuario ya registrado')) {
          // Mostrar alerta con Swal
          Swal.fire({
            icon: 'error',
            title: 'Usuario ya registrado',
            text: 'El correo electrónico ingresado ya está en uso.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error en el registro',
            text: 'Ocurrió un error inesperado. Por favor intenta nuevamente.',
          });
        }
      } else {
        console.error('Error inesperado:', error);
      }
    }
  }; */

  const RegisterUser = () => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [userData, setUserData] = useState<IRegisterProps | null>(null); // Estado para guardar los datos temporalmente
  
    const handleSubmit = async (values: IRegisterProps) => {
      // Guardar los datos temporalmente en el estado
      setIsSubmitting(true);
      localStorage.setItem('registerData', JSON.stringify(values));
  
      // Redirigir al formulario de preguntas según el rol
      try { 
  
        if (values.rol === 'emprendedor') {
          router.push('/register/entrepreneurq'); // Redirige al formulario de emprendedores
        } else if (values.rol === 'cliente') {
          router.push('/register/clientq'); // Redirige al formulario de clientes
        }
      } catch (error) {
        // Manejo de errores
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: 'Ocurrió un error inesperado. Por favor intenta nuevamente.',
        });
      } finally {
        setIsSubmitting(false); // Finalizar el estado de carga
      }
    };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black font-poppins">
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
        {/* Imagen en la parte superior solo en móviles */}
        <div className="md:hidden w-full bg-black flex justify-center mb-4">
          <Image 
            src="https://res.cloudinary.com/devnzokpy/image/upload/v1725918380/5_yzrcts.webp" 
            alt="Logo" 
            width={200} 
            height={100}
            quality={100}
            className="mx-auto"
          />
        </div>

        <div className="w-full max-w-md md:max-w-lg p-6 md:p-8 bg-[#000000] rounded-xl shadow-lg mb-4 overflow-y-visible">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 md:mb-6 overflow-visible">REGISTRO</h1>
          <h3 className="text-base md:text-lg font-medium mb-4 md:mb-6">
            Crea una nueva cuenta
          </h3>
          <Formik
            initialValues={{ name: '', email: '', password: '', date: new Date(), rol: 'emprendedor' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ errors, touched, setFieldTouched, handleChange, values }) => (
              <Form className="w-full">
                <div className="mb-4">
                  <Field
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    className="w-full p-3 text-base rounded-lg bg-[#303030] text-white border border-[#303030] placeholder-gray-300"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setFieldTouched('name', true, true);
                    }}
                  />
                  {errors.name && touched.name && (
                    <div className="text-pink-300 text-sm pt-2">{errors.name}</div>
                  )}
                </div>
                <div className="mb-4">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-3 text-base rounded-lg bg-[#303030] text-white border border-[#303030] placeholder-gray-300"
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
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Contraseña"
                      className="w-full p-3 text-base rounded-lg bg-[#303030] text-white border border-[#303030] placeholder-gray-300 pr-12"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        setFieldTouched('password', true, true);
                      }}
                    />
                    <div
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-300 text-xl"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                  {touched.password && (
                    <div className="text-pink-300 text-sm pt-2">
                      {!values.password.match(/[A-Z]/) && 'Debe incluir al menos una mayúscula. '}
                      {!values.password.match(/[!@#$%^&*]/) && 'Debe incluir al menos un carácter especial. '}
                      {values.password.length < 8 && 'Debe tener al menos 8 caracteres. '}
                    </div>
                  )}
                </div>
                <div className="mb-8">
                  <Field
                    type="date"
                    name="date"
                    className="w-full p-3 text-base rounded-lg bg-[#303030] text-white border border-[#303030]"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setFieldTouched('date', true, true);
                    }}
                  />
                  {errors.date && touched.date && (
                    <div className="text-pink-300 text-sm pt-2">{errors.date as string}</div>
                  )}
                </div>
                <hr className="border-t-1 border-pink-400 border-opacity-60 mb-2 pb-4" />
                <div className="mb-4">
                  <label className="block text-white mb-2 text-xl">Rol:</label>
                  <div className="flex flex-wrap items-center mb-2">
                    <label className="mr-4 flex items-center">
                      <Field type="radio" name="rol" value="emprendedor" />
                      <span className="ml-2 text-lg">Emprendedor</span>
                    </label>
                    <label className="mr-4 flex items-center">
                      <Field type="radio" name="rol" value="cliente" />
                      <span className="ml-2 text-lg">Cliente</span>
                    </label>
                  </div>
                  {errors.rol && touched.rol && (
                    <div className="text-pink-300 text-sm">{errors.rol}</div>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full p-3 mb-6 text-white font-semibold rounded-full bg-gradient-to-r from-[#C87DAB] to-[#C12886] shadow-md hover:shadow-lg transition-shadow"
                  disabled={isSubmitting} 
                >
                  <span className="transition duration-300 hover:scale-110 inline-block text-lg">
                    {isSubmitting ? 'Procesando...' : 'Registrarse'}
                  </span>
                </button>
                {/* <p>O regístrate con:</p>
                <GoogleLoginButton /> */}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
