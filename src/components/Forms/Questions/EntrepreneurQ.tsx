'use client'
import { useRouter } from 'next/navigation';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EntrepreneurQ = () => {
  const router = useRouter();

  const initialValues = {
    progressStage: '',
    problemSolution: '',
    motivation: '',
    investmentCommitment: '',
    qualityAssurance: '',
    recognition: '',
    complaintManagement: '',
    companyValues: '',
    integrityImplementation: '',
    ethicalExamples: '',
    connectionsAndOpportunities: '',
    networkingParticipation: '',
    mentorshipInterest: ''
  };

  const validationSchema = Yup.object({
    progressStage: Yup.string().required('Este campo es obligatorio'),
    problemSolution: Yup.string().required('Este campo es obligatorio'),
    motivation: Yup.string().required('Este campo es obligatorio'),
    investmentCommitment: Yup.string().required('Este campo es obligatorio'),
    qualityAssurance: Yup.string().required('Este campo es obligatorio'),
    recognition: Yup.string().required('Este campo es obligatorio'),
    complaintManagement: Yup.string().required('Este campo es obligatorio'),
    companyValues: Yup.string().required('Este campo es obligatorio'),
    integrityImplementation: Yup.string().required('Este campo es obligatorio'),
    ethicalExamples: Yup.string().required('Este campo es obligatorio'),
    connectionsAndOpportunities: Yup.string().required('Este campo es obligatorio'),
    networkingParticipation: Yup.string().required('Este campo es obligatorio'),
    mentorshipInterest: Yup.string().required('Este campo es obligatorio')
  });

  const handleSubmit = (values: typeof initialValues) => {
    // Aquí puedes manejar la lógica para enviar los datos al backend
    console.log('Formulario enviado:', values);
    // Después de enviar, podrías redirigir al usuario a otra página
    router.push('/login/option'); // Cambia la ruta según tu preferencia
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="flex flex-col p-4 space-y-4 max-w-md mx-auto bg-gradient-to-r from-[#C87DAB] to-[#C12886] rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Preguntas para Emprendedores</h2>

          {/* Nivel de Progreso y Establecimiento */}
          <div>
            <label htmlFor="progressStage" className="block mb-2">¿En qué etapa se encuentra tu emprendimiento?</label>
            <Field as="select" id="progressStage" name="progressStage" className="w-full p-2 border border-gray-700 bg-gray-200 rounded">
              <option value="">Selecciona una opción</option>
              <option value="ideaInicial">Idea inicial</option>
              <option value="desarrolloProducto">Desarrollo del Producto</option>
              <option value="lanzamientoMercado">Lanzamiento al Mercado</option>
              <option value="crecimientoExpansion">Crecimiento y Expansión</option>
            </Field>
            <ErrorMessage name="progressStage" component="div" className="text-red-500" />
          </div>

          {/* Problema y Solución */}
          <div>
            <label htmlFor="problemSolution" className="block mb-2">¿Qué problema estás tratando de resolver con tu producto o servicio?</label>
            <Field as="select" id="problemSolution" name="problemSolution" className="w-full p-2 border border-gray-700 bg-gray-200 rounded">
              <option value="">Selecciona una opción</option>
              <option value="identificacionProblema">Identificación preliminar del problema</option>
              <option value="desarrolloSolucion">Desarrollo de una solución basada en la investigación</option>
              <option value="solucionLanzada">Solución lanzada y obteniendo feedback</option>
              <option value="solucionEstablecida">Solución establecida y reconocida en el mercado</option>
            </Field>
            <ErrorMessage name="problemSolution" component="div" className="text-red-500" />
          </div>

          {/* Motivación */}
          <div>
            <label htmlFor="motivation" className="block mb-2">¿Qué te motiva a resolver este problema?</label>
            <Field as="select" id="motivation" name="motivation" className="w-full p-2 border border-gray-700 bg-gray-200 rounded">
              <option value="">Selecciona una opción</option>
              <option value="pasionPersonal">Pasión personal y experiencia directa con el problema</option>
              <option value="oportunidadSignificativa">Identificación de una oportunidad significativa en el mercado</option>
              <option value="feedbackClientes">Experiencia positiva y feedback de los primeros clientes</option>
              <option value="exitoMercado">Reconocimiento y éxito en el mercado, buscando expansión</option>
            </Field>
            <ErrorMessage name="motivation" component="div" className="text-red-500" />
          </div>

          {/* Compromiso de Inversión */}
          <div>
            <label htmlFor="investmentCommitment" className="block mb-2">¿Cuánto tiempo y recursos estás dispuesto a invertir en tu emprendimiento?</label>
            <Field as="select" id="investmentCommitment" name="investmentCommitment" className="w-full p-2 border border-gray-700 bg-gray-200 rounded">
              <option value="">Selecciona una opción</option>
              <option value="tiempoParcial">Tiempo parcial y recursos limitados</option>
              <option value="tiempoCompleto">Tiempo completo en el desarrollo del producto/servicio</option>
              <option value="inversionSignificativa">Inversión significativa y búsqueda de financiamiento adicional</option>
              <option value="equipoDedicado">Equipo dedicado y recursos sustanciales ya invertidos</option>
            </Field>
            <ErrorMessage name="investmentCommitment" component="div" className="text-red-500" />
          </div>

          {/* Calidad y Garantía */}
          <div>
            <label htmlFor="qualityAssurance" className="block mb-2">¿Cómo aseguras la calidad y la garantía de tu producto o servicio?</label>
            <Field as="select" id="qualityAssurance" name="qualityAssurance" className="w-full p-2 border border-gray-700 bg-gray-200 rounded">
              <option value="">Selecciona una opción</option>
              <option value="sinProcesos">Sin procesos formales de control de calidad aún</option>
              <option value="desarrolloProcesos">Desarrollo y prueba de procesos de control de calidad</option>
              <option value="procesosEstablecidos">Procesos establecidos y aplicados a los primeros productos</option>
              <option value="procesosCertificados">Procesos certificados y auditados externamente</option>
            </Field>
            <ErrorMessage name="qualityAssurance" component="div" className="text-red-500" />
          </div>

          {/* Reconocimiento */}
          <div>
            <label htmlFor="recognition" className="block mb-2">¿Has recibido algún reconocimiento o certificación por la calidad de tu producto/servicio?</label>
            <Field as="select" id="recognition" name="recognition" className="w-full p-2 border border-gray-700 bg-gray-200 rounded">
              <option value="">Selecciona una opción</option>
              <option value="noReconocimiento">No, aún no he recibido reconocimiento o certificación</option>
              <option value="enProcesoCertificacion">En proceso de obtener certificaciones</option>
              <option value="reconocimientosIniciales">Reconocimientos iniciales y algunos premios</option>
              <option value="multiplesCertificaciones">Múltiples certificaciones y premios por la calidad</option>
            </Field>
            <ErrorMessage name="recognition" component="div" className="text-red-500" />
          </div>

          {/* Gestión de Quejas */}
          <div>
            <label htmlFor="complaintManagement" className="block mb-2">¿Cómo gestionas las quejas y devoluciones de los clientes?</label>
            <Field as="select" id="complaintManagement" name="complaintManagement" className="w-full p-2 border border-gray-700 bg-gray-200 rounded">
              <option value="">Selecciona una opción</option>
              <option value="sinProceso">Sin proceso formal para gestionar quejas y devoluciones</option>
              <option value="desarrolloSistema">Desarrollo de un sistema de gestión de quejas y devoluciones</option>
              <option value="sistemaBasico">Sistema básico en funcionamiento</option>
              <option value="sistemaEficiente">Sistema eficiente y automatizado para gestionar quejas y devoluciones</option>
            </Field>
            <ErrorMessage name="complaintManagement" component="div" className="text-red-500" />
          </div>

          {/* Valores de la Empresa */}
          <div>
            <label htmlFor="companyValues" className="block mb-2">¿Qué valores son fundamentales para tu empresa?</label>
            <Field as="select" id="companyValues" name="companyValues" className="w-full p-2 border border-gray-700 bg-gray-200 rounded">
              <option value="">Selecciona una opción</option>
              <option value="valoresNoDefinidos">No tengo valores fundamentales definidos aún</option>
              <option value="valoresEnDesarrollo">Valores en desarrollo y aplicados internamente</option>
              <option value="valoresDefinidos">Valores bien definidos y aplicados en el día a día</option>
              <option value="valoresReconocidos">Valores reconocidos y respetados externamente</option>
            </Field>
            <ErrorMessage name="companyValues" component="div" className="text-red-500" />
          </div>

          {/* Implementación de Integridad */}
          <div>
            <label htmlFor="integrityImplementation" className="block mb-2">¿Cómo implementas la integridad en tu empresa?</label>
            <Field as="select" id="integrityImplementation" name="integrityImplementation" className="w-full p-2 border border-gray-700 bg-gray-200 rounded">
              <option value="">Selecciona una opción</option>
              <option value="sinPoliticas">Sin políticas formales de integridad</option>
              <option value="politicasEnDesarrollo">Políticas de integridad en desarrollo</option>
              <option value="politicasImplementadas">Políticas implementadas y seguidas</option>
              <option value="practicasExemplares">Prácticas ejemplares de integridad reconocidas</option>
            </Field>
            <ErrorMessage name="integrityImplementation" component="div" className="text-red-500" />
          </div>

          {/* Ejemplos Éticos */}
          <div>
            <label htmlFor="ethicalExamples" className="block mb-2">¿Puedes dar ejemplos de cómo tu empresa ha actuado éticamente?</label>
            <Field as="select" id="ethicalExamples" name="ethicalExamples" className="w-full p-2 border border-gray-700 bg-gray-200 rounded">
              <option value="">Selecciona una opción</option>
              <option value="sinEjemplos">No tengo ejemplos documentados</option>
              <option value="ejemplosTempranos">Ejemplos tempranos de comportamiento ético</option>
              <option value="ejemplosComunes">Ejemplos comunes y bien documentados</option>
              <option value="ejemplosNotables">Ejemplos notables de comportamiento ético reconocido</option>
            </Field>
            <ErrorMessage name="ethicalExamples" component="div" className="text-red-500" />
          </div>

          {/* Conexiones y Oportunidades */}
          <div>
            <label htmlFor="connectionsAndOpportunities" className="block mb-2">¿Qué conexiones y oportunidades estás buscando en RiBuzz?</label>
            <Field as="select" id="connectionsAndOpportunities" name="connectionsAndOpportunities" className="w-full p-2 border border-gray-700 bg-gray-200 rounded">
              <option value="">Selecciona una opción</option>
              <option value="conexionesMentor">Conexiones con mentores en mi industria</option>
              <option value="oportunidadesInversion">Oportunidades de inversión para crecimiento</option>
              <option value="networking">Oportunidades de networking con otros emprendedores</option>
              <option value="sociosPotenciales">Conexiones con socios potenciales y colaboradores</option>
            </Field>
            <ErrorMessage name="connectionsAndOpportunities" component="div" className="text-red-500" />
          </div>

          {/* Participación en Eventos */}
          <div>
            <label htmlFor="networkingParticipation" className="block mb-2">¿Qué eventos de networking has participado o te gustaría participar?</label>
            <Field as="select" id="networkingParticipation" name="networkingParticipation" className="w-full p-2 border border-gray-700 bg-gray-200 rounded">
              <option value="">Selecciona una opción</option>
              <option value="eventosLocales">Eventos locales y regionales</option>
              <option value="eventosNacionales">Eventos nacionales y conferencias</option>
              <option value="eventosInternacionales">Eventos internacionales y ferias</option>
              <option value="eventosOnline">Eventos y seminarios en línea</option>
            </Field>
            <ErrorMessage name="networkingParticipation" component="div" className="text-red-500" />
          </div>

          {/* Interés en Mentoría */}
          <div>
            <label htmlFor="mentorshipInterest" className="block mb-2">¿Estás interesado en recibir mentoría y cómo esperas que te ayude?</label>
            <Field as="select" id="mentorshipInterest" name="mentorshipInterest" className="w-full p-2 border border-gray-700 bg-gray-200 rounded">
              <option value="">Selecciona una opción</option>
              <option value="noInteresado">No estoy interesado en recibir mentoría</option>
              <option value="interesadoGeneral">Interesado en mentoría general</option>
              <option value="mentoriaEspecifica">Interesado en mentoría específica en áreas clave</option>
              <option value="mentoriaEstrategica">Interesado en mentoría estratégica y planificación de negocio</option>
            </Field>
            <ErrorMessage name="mentorshipInterest" component="div" className="text-red-500" />
          </div>

          <button
            type="submit"
            className="w-full p-3 mb-6 text-white font-semibold rounded-full bg-gradient-to-r from-[#110c0f] to-[#6d0445] shadow-md hover:shadow-lg transition-shadow"
          >
            Enviar
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default EntrepreneurQ;
