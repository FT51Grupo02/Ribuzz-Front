'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaBookOpen, FaBrain } from 'react-icons/fa';
import { FaChildReaching } from "react-icons/fa6";
import { GiLoveMystery } from "react-icons/gi";
import { AiFillThunderbolt } from "react-icons/ai";
import { IoMdClose } from 'react-icons/io';

const content = [
  "En el corazón de Medellín, una ciudad conocida por su dinamismo y espíritu emprendedor, nació una idea que cambiaría la forma en que las personas se conectan y colaboran. Esta idea surgió de la mente y el corazón de José David, un joven disciplinado que valoraba por encima de todo a su familia y la integridad. José David siempre ha creído que las empresas son una extensión de las personas que las crean, y que el verdadero éxito radica en la conexión genuina y el desarrollo integral de ambos.",
  "Desde joven, José David tenía un sueño: conectar con los demás de manera más efectiva. Este sueño se hizo aún más claro después de su primera experiencia presentando un pitch elevator, donde se dio cuenta de la importancia de una buena presentación y de las conexiones que se pueden forjar en esos breves momentos. Así nacieron las tarjetas de presentación NFC, una herramienta innovadora para ayudar a otros a compartir sus historias de manera instantánea y memorable.",
  "A medida que José David se adentraba más en el mundo del emprendimiento, se dio cuenta de un problema profundo: la alta tasa de deserción entre los emprendedores. Con un índice del 66.5% de deserción en un rango de 5 años, muchos abandonaban sus sueños debido a la falta de adquisición de clientes, errores de gestión, ausencia de un ecosistema de apoyo y miedos e inseguridades personales. José David se enamoró de este problema y decidió dedicar su vida a encontrar una solución.",
  "Para José David, las empresas son personas. Cree firmemente que si una persona se desarrolla personalmente y está bien, su empresa progresará al mismo ritmo. Esta filosofía se convirtió en el corazón de RiBuzz. José David quería crear una plataforma que no solo ayudara a los emprendedores a encontrar clientes y gestionar sus negocios, sino que también les proporcionara un ecosistema de apoyo integral que les permitiera crecer tanto profesional como personalmente.",
  "RiBuzz es el resultado de esta visión. Es una plataforma de marketplace y networking diseñada para conectar a los emprendedores con oportunidades, clientes y otros profesionales que comparten su pasión. Pero más allá de ser una simple herramienta, RiBuzz es una comunidad donde las historias y las sonrisas de las personas son lo más importante. Cada conexión en RiBuzz es una oportunidad para sembrar semillas de conocimiento, compartir aprendizajes y ayudar a otros a crecer."
];

const titles = [
  "Historia",
  "El sueño de un niño",
  "Enamorarse del problema",
  "Nuestra filosofía",
  "La creación de RiBuzz"
];

const Page2 = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setActiveIndex(null);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden py-40 max-sm:py-10">
      <div className="absolute inset-0 rotate-180">
        <Image
          src="/1.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-white text-3xl sm:text-5xl md:text-7xl font-bold mb-6 sm:mb-12">La historia de nuestra marca</h1>

        <div className="flex flex-wrap justify-center gap-4 w-full">
          {titles.map((title, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center justify-between w-56 min-h-[220px] sm:w-64 sm:min-h-[240px] md:w-80 md:min-h-[280px] lg:w-72 lg:min-h-[300px] xl:w-64 xl:min-h-[320px]"
            >
              <div
                onClick={() => handleToggle(index)}
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 flex items-center justify-center bg-white rounded-full mb-2 sm:mb-4 cursor-pointer transition-transform duration-300 hover:bg-gradient-to-r hover:from-pink-400 hover:to-pink-600 hover:scale-105 group"
              >
                {index === 0 && <FaBookOpen size={80} className="text-black group-hover:text-white" />}
                {index === 1 && <FaChildReaching size={80} className="text-black group-hover:text-white" />}
                {index === 2 && <GiLoveMystery size={80} className="text-black group-hover:text-white" />}
                {index === 3 && <FaBrain size={80} className="text-black group-hover:text-white" />}
                {index === 4 && <AiFillThunderbolt size={80} className="text-black group-hover:text-white" />}
              </div>
              <div className="text-center flex flex-col justify-between flex-grow">
                <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-white">{title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contenido desplegable */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20 backdrop-blur-md"
          onClick={handleClose}
        >
          <div
            className="relative bg-black text-white p-4 sm:p-8 md:p-12 lg:p-16 rounded-lg max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl w-full bg-opacity-80"
            onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del contenido cierre el modal
          >
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center mb-2 sm:mb-4 md:mb-6 lg:mb-10 text-white">{titles[activeIndex]}</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-4 sm:mb-6 md:mb-8 text-cyan-100">{content[activeIndex]}</p>
            <div className="flex justify-center mt-6 sm:mt-8 md:mt-10">
              <Image
                src="/11.png"
                alt="Logo"
                width={200}
                height={50}
                objectFit="contain"
              />
            </div>
          </div>
          <button
            onClick={() => setActiveIndex(null)}
            className="absolute bottom-10 w-12 h-12 flex items-center justify-center bg-black bg-opacity-80 text-white rounded-full shadow-lg text-2xl transition duration-300 hover:scale-110"
          >
            <IoMdClose className='transition duration-300 hover:scale-110' size={30} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Page2;
