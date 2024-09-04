'use client';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/components/Context/AuthContext';
import GoogleLoginButton from '@/components/Google/Button/GoogleButton';
import { IRegisterProps } from '@/interfaces/Types';

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
  rol: Yup.string().oneOf(['emprendedor', 'client', 'admin'], 'Rol inválido').optional(),
});

const RegisterUser = () => {
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
        router.push('/login'); // Redirigir al login después del registro exitoso
      }
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black overflow-x-hidden font-poppins">
      <div className="hidden md:flex md:w-1/2 flex-shrink-0 relative md:translate-x-3 lg:translate-x-0">
        <Image
          src="/14.png"
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
            src="/5.png" 
            alt="Logo" 
            width={200} 
            height={100}
            quality={100}
            className="mx-auto"
          />
        </div>

        <div className="w-full max-w-md md:max-w-lg p-6 md:p-8 bg-[#000000] rounded-xl shadow-lg mb-4 overflow-y-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 md:mb-6 overflow-visible">REGISTRO</h1>
          <h3 className="text-base md:text-lg font-medium mb-4 md:mb-6">
            Crea una nueva cuenta
          </h3>
          <Formik
            initialValues={{ name: '', email: '', password: '', date: new Date(), rol: 'cliente' }}
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
                <div className="mb-2 relative">
                  <Field
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    className="w-full p-3 mb-2 text-base rounded-lg bg-[#303030] text-white border border-[#303030] placeholder-gray-300"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setFieldTouched('password', true, true);
                    }}
                  />
                  {touched.password && (
                    <div className="text-pink-300 text-sm">
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
                      <Field type="radio" name="rol" value="client" />
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
                >
                  <span className="transition duration-300 hover:scale-110 inline-block text-lg">
                    Registrarse
                  </span>
                </button>
               {/*  <p>O registrate con:</p>
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
