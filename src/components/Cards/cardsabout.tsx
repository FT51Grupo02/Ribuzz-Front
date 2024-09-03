import React from 'react'
import { GiTeamIdea } from 'react-icons/gi'
import { FaHeart, FaHandsHoldingChild, FaHandshakeSimple } from "react-icons/fa6";

const CardAbout = () => {
  return (
    <div className="font-poppins grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40">
      <div className="p-4 bg-white shadow-md text-center rounded-xl transition duration-300 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600 group">
        <div className="flex justify-center items-center mb-4 text-black group-hover:text-white transition-colors duration-300">
          <FaHandsHoldingChild size={50} />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-black group-hover:text-white transition-colors duration-300">Integridad:</h2>
        <p className="text-gray-600 group-hover:text-white transition-colors duration-300">
          Valoramos a las personas por encima de todo. Las empresas y las personas son un solo complemento y ambos deben de estar conectados para crear el impacto y la huella que se desea.
        </p>
      </div>
      <div className="p-4 bg-white shadow-md text-center rounded-xl transition duration-300 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600 group">
        <div className="flex justify-center items-center mb-4 text-black group-hover:text-white transition-colors duration-300">
          <FaHandshakeSimple size={50} />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-black group-hover:text-white transition-colors duration-300">Conexión:</h2>
        <p className="text-gray-600 group-hover:text-white transition-colors duration-300">
          Creemos en el poder de las conexiones genuinas. Fomentamos un entorno donde las relaciones se basan en el respeto mutuo y la colaboración auténtica.
        </p>
      </div>
      <div className="p-4 bg-white shadow-md text-center rounded-xl transition duration-300 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600 group">
        <div className="flex justify-center items-center mb-4 text-black group-hover:text-white transition-colors duration-300">
          <FaHeart size={50} />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-black group-hover:text-white transition-colors duration-300">Pasión:</h2>
        <p className="text-gray-600 group-hover:text-white transition-colors duration-300">
          Estamos profundamente comprometidos con nuestra misión y dedicados a ayudar a nuestros usuarios a alcanzar sus sueños. Nuestra pasión impulsa nuestra determinación y éxito.
        </p>
      </div>
      <div className="p-4 bg-white shadow-md text-center rounded-xl transition duration-300 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600 group">
        <div className="flex justify-center items-center mb-4 text-black group-hover:text-white transition-colors duration-300">
          <GiTeamIdea size={50} />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-black group-hover:text-white transition-colors duration-300">Innovación:</h2>
        <p className="text-gray-600 group-hover:text-white transition-colors duration-300">
          Nos esforzamos por adoptar y promover nuevas tecnologías y métodos que faciliten el éxito de nuestros usuarios. La innovación es clave para mantener nuestra relevancia y competitividad en el mercado.
        </p>
      </div>
    </div>
  )
}

export default CardAbout
