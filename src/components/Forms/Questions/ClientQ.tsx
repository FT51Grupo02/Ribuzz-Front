'use client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { register } from '@/helpers/auth.helper';
import { useState } from 'react';

const ClientQ: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      businessStage: '',
      budget: '',
      investmentWillingness: '',
      externalProviders: '',
      currentChallenges: '',
      specificProblems: '',
      businessBarriers: '',
      serviceQuality: '',
      qualityVsCost: '',
      serviceProviderValues: '',
      integratedPackages: '',
      essentialServices: '',
      openToConsulting: '',
    },
    validationSchema: Yup.object({
      businessStage: Yup.string().required('Campo obligatorio'),
      budget: Yup.string().required('Campo obligatorio'),
      investmentWillingness: Yup.string().required('Campo obligatorio'),
      externalProviders: Yup.string().required('Campo obligatorio'),
      currentChallenges: Yup.string().required('Campo obligatorio'),
      specificProblems: Yup.string().required('Campo obligatorio'),
      businessBarriers: Yup.string().required('Campo obligatorio'),
      serviceQuality: Yup.string().required('Campo obligatorio'),
      qualityVsCost: Yup.string().required('Campo obligatorio'),
      serviceProviderValues: Yup.string().required('Campo obligatorio'),
      integratedPackages: Yup.string().required('Campo obligatorio'),
      essentialServices: Yup.string().required('Campo obligatorio'),
      openToConsulting: Yup.string().required('Campo obligatorio'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const registerData = JSON.parse(localStorage.getItem('registerData') || '{}'); // Recuperar los datos del registro
      
      const combinedData = {
        ...registerData, // Datos del registro
        questions: values  // Respuestas del formulario de preguntas
      };
  
      try {
        const result = await register(combinedData); // Enviar datos combinados al backend
        if (result) {
          router.push('/login/option'); // Redirigir después de enviar
        }
      } catch (error) {
        console.error('Error al registrar:', error);
        // Aquí puedes mostrar un mensaje de error
      }finally {
        setLoading(false); // Restablece el estado de carga
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="max-w-lg mx-auto p-6 bg-gradient-to-r from-[#C87DAB] to-[#C12886]shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Preguntas para Clientes</h2>

      <div className="mb-4">
        <label htmlFor="businessStage" className="block text-sm font-medium text-white">¿En qué etapa se encuentra tu empresa?</label>
        <select
          id="businessStage"
          name="businessStage"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.businessStage}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Selecciona una opción</option>
          <option value="startup">Startup: Estamos en las primeras etapas de desarrollo</option>
          <option value="smallBusiness">Pequeña Empresa: Tenemos algunos clientes y un equipo pequeño</option>
          <option value="mediumBusiness">Mediana Empresa: Estamos en expansión con una base sólida de clientes</option>
          <option value="largeBusiness">Gran Empresa: Estamos bien establecidos con un amplio mercado</option>
        </select>
        {formik.touched.businessStage && formik.errors.businessStage ? (
          <div className="text-red-600 text-sm mt-1">{formik.errors.businessStage}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="budget" className="block text-sm font-medium text-white">¿Cuál es el presupuesto mensual que puedes destinar a la adquisición de servicios/productos?</label>
        <select
          id="budget"
          name="budget"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.budget}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Selecciona una opción</option>
          <option value="less2000k">Menos de $2.000.000 COP</option>
          <option value="between2000kAnd8000k">Entre $2.000.000 y $8.000.000 COP</option>
          <option value="between8000kAnd20000k">Entre $8.000.000 y $20.000.000 COP</option>
          <option value="moreThan20000k">Más de $20.000.000 COP</option>
        </select>
        {formik.touched.budget && formik.errors.budget ? (
          <div className="text-red-600 text-sm mt-1">{formik.errors.budget}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="investmentWillingness" className="block text-sm font-medium text-white">¿Cuánto estás dispuesto a invertir en la solución de tus problemas actuales?</label>
        <select
          id="investmentWillingness"
          name="investmentWillingness"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.investmentWillingness}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Selecciona una opción</option>
          <option value="economicSolutions">Soluciones económicas con presupuesto limitado</option>
          <option value="moderateInvestment">Inversión moderada para obtener buenos resultados</option>
          <option value="significantInvestment">Presupuesto significativo buscando alta calidad</option>
          <option value="premiumInvestment">Inversión grande para soluciones premium</option>
        </select>
        {formik.touched.investmentWillingness && formik.errors.investmentWillingness ? (
          <div className="text-red-600 text-sm mt-1">{formik.errors.investmentWillingness}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="externalProviders" className="block text-sm font-medium text-white">¿Has trabajado anteriormente con proveedores externos? Si es así, ¿cuál fue tu experiencia?</label>
        <select
          id="externalProviders"
          name="externalProviders"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.externalProviders}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Selecciona una opción</option>
          <option value="noExperience">No, nunca he trabajado con proveedores externos</option>
          <option value="regularExperience">Sí, pero la experiencia fue regular</option>
          <option value="goodExperience">Sí, y la experiencia fue buena en general</option>
          <option value="excellentExperience">Sí, y la experiencia fue excelente, busco replicarla</option>
        </select>
        {formik.touched.externalProviders && formik.errors.externalProviders ? (
          <div className="text-red-600 text-sm mt-1">{formik.errors.externalProviders}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="currentChallenges" className="block text-sm font-medium text-white">¿Cuáles son los principales desafíos que enfrenta tu empresa actualmente?</label>
        <select
          id="currentChallenges"
          name="currentChallenges"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.currentChallenges}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Selecciona una opción</option>
          <option value="businessStructure">Estructurar nuestro modelo de negocio y operación</option>
          <option value="marketingImprovement">Mejorar nuestro marketing y presencia en línea</option>
          <option value="operationsOptimization">Optimizar nuestras operaciones y escalar nuestras actividades</option>
          <option value="strategicSolutions">Soluciones estratégicas para mantener y ampliar nuestro mercado</option>
        </select>
        {formik.touched.currentChallenges && formik.errors.currentChallenges ? (
          <div className="text-red-600 text-sm mt-1">{formik.errors.currentChallenges}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="specificProblems" className="block text-sm font-medium text-white">¿Qué problemas específicos estás buscando resolver con nuestros productos/servicios?</label>
        <select
          id="specificProblems"
          name="specificProblems"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.specificProblems}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Selecciona una opción</option>
          <option value="businessStructureHelp">Ayuda con la estructura básica de mi negocio</option>
          <option value="visibilityMarketing">Mejorar la visibilidad y el marketing digital</option>
          <option value="efficiencyOptimization">Optimizar la eficiencia operativa</option>
          <option value="strategicGrowth">Estrategias para el crecimiento a largo plazo</option>
        </select>
        {formik.touched.specificProblems && formik.errors.specificProblems ? (
          <div className="text-red-600 text-sm mt-1">{formik.errors.specificProblems}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="businessBarriers" className="block text-sm font-medium text-white">¿Qué barreras encuentras en tu negocio para crecer o mejorar?</label>
        <select
          id="businessBarriers"
          name="businessBarriers"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.businessBarriers}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Selecciona una opción</option>
          <option value="fundingBarriers">Barreras financieras y de financiación</option>
          <option value="marketBarriers">Barreras en el mercado y competencia</option>
          <option value="operationalBarriers">Barreras operativas y de recursos</option>
          <option value="strategicBarriers">Barreras estratégicas y de planificación</option>
        </select>
        {formik.touched.businessBarriers && formik.errors.businessBarriers ? (
          <div className="text-red-600 text-sm mt-1">{formik.errors.businessBarriers}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="serviceQuality" className="block text-sm font-medium text-white">¿Cómo valoras la calidad del servicio o producto que has recibido hasta ahora?</label>
        <select
          id="serviceQuality"
          name="serviceQuality"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.serviceQuality}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Selecciona una opción</option>
          <option value="poor">Pobre: No cumple con las expectativas</option>
          <option value="fair">Aceptable: Satisface las necesidades básicas</option>
          <option value="good">Buena: Cumple con la mayoría de expectativas</option>
          <option value="excellent">Excelente: Supera las expectativas</option>
        </select>
        {formik.touched.serviceQuality && formik.errors.serviceQuality ? (
          <div className="text-red-600 text-sm mt-1">{formik.errors.serviceQuality}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="qualityVsCost" className="block text-sm font-medium text-white">¿Qué tan importante es para ti la relación calidad-precio en los productos/servicios?</label>
        <select
          id="qualityVsCost"
          name="qualityVsCost"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.qualityVsCost}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Selecciona una opción</option>
          <option value="priceSensitive">Precios más bajos son preferibles</option>
          <option value="balance">Balance entre calidad y costo</option>
          <option value="qualityFocus">Calidad superior es más importante</option>
          <option value="premium">Estoy dispuesto a pagar más por una calidad excepcional</option>
        </select>
        {formik.touched.qualityVsCost && formik.errors.qualityVsCost ? (
          <div className="text-red-600 text-sm mt-1">{formik.errors.qualityVsCost}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="serviceProviderValues" className="block text-sm font-medium text-white">¿Qué valores o principios buscas en un proveedor de servicios?</label>
        <select
          id="serviceProviderValues"
          name="serviceProviderValues"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.serviceProviderValues}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Selecciona una opción</option>
          <option value="transparency">Transparencia y comunicación clara</option>
          <option value="reliability">Fiabilidad y cumplimiento de compromisos</option>
          <option value="innovation">Innovación y creatividad en soluciones</option>
          <option value="customerService">Excelente servicio al cliente y soporte</option>
        </select>
        {formik.touched.serviceProviderValues && formik.errors.serviceProviderValues ? (
          <div className="text-red-600 text-sm mt-1">{formik.errors.serviceProviderValues}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="integratedPackages" className="block text-sm font-medium text-white">¿Te interesan paquetes integrales que combinen varios servicios?</label>
        <select
          id="integratedPackages"
          name="integratedPackages"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.integratedPackages}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Selecciona una opción</option>
          <option value="notInterested">No, prefiero servicios individuales</option>
          <option value="occasionally">Sí, ocasionalmente si son relevantes</option>
          <option value="often">Sí, a menudo busco paquetes integrales</option>
          <option value="always">Sí, siempre me interesan los paquetes integrales</option>
        </select>
        {formik.touched.integratedPackages && formik.errors.integratedPackages ? (
          <div className="text-red-600 text-sm mt-1">{formik.errors.integratedPackages}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="essentialServices" className="block text-sm font-medium text-white">¿Qué servicios consideras esenciales para tu negocio?</label>
        <select
          id="essentialServices"
          name="essentialServices"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.essentialServices}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Selecciona una opción</option>
          <option value="basic">Servicios básicos para el funcionamiento diario</option>
          <option value="advanced">Servicios avanzados para mejorar la competitividad</option>
          <option value="specialized">Servicios especializados para necesidades concretas</option>
          <option value="allInclusive">Servicios integrales para una solución completa</option>
        </select>
        {formik.touched.essentialServices && formik.errors.essentialServices ? (
          <div className="text-red-600 text-sm mt-1">{formik.errors.essentialServices}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="openToConsulting" className="block text-sm font-medium text-white">¿Estás abierto a recibir consultoría para mejorar tus procesos de negocio?</label>
        <select
          id="openToConsulting"
          name="openToConsulting"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.openToConsulting}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Selecciona una opción</option>
          <option value="notOpen">No, prefiero manejarlo internamente</option>
          <option value="occasionally">Sí, estoy dispuesto a considerar consultoría en ocasiones</option>
          <option value="often">Sí, a menudo busco consultoría para mejorar procesos</option>
          <option value="always">Sí, siempre estoy abierto a recibir consultoría</option>
        </select>
        {formik.touched.openToConsulting && formik.errors.openToConsulting ? (
          <div className="text-red-600 text-sm mt-1">{formik.errors.openToConsulting}</div>
        ) : null}
      </div>

      <button type="submit" className="w-full p-3 mb-6 text-white font-semibold rounded-full bg-gradient-to-r from-[#110c0f] to-[#6d0445] shadow-md hover:shadow-lg transition-shadow" disabled={loading}>
        {loading ? 'Procesando...' : 'Enviar'}
      </button>
    </form>
  );
};

export default ClientQ;
