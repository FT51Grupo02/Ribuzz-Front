import React from 'react';
import Image from 'next/image';
import { FaHome, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight} from 'react-icons/fa';
import { FaPeopleGroup } from "react-icons/fa6";
import { PiCalendarStarFill } from "react-icons/pi";
import { GiPencil, GiReceiveMoney, GiSandsOfTime   } from "react-icons/gi";
import { BsBuildings } from "react-icons/bs";
import NewsletterSection from '../Newsletter/NewsLetterSection';

const HomeContainer: React.FC = () => {
  return (
    <div 
        className="bg-[#090909] p-8" 
        style={{ 
            backgroundImage: `url('/10.png')`, 
            backgroundRepeat: 'repeat', 
            backgroundSize: 'auto' 
        }}
        >
      
       {/* Primera Sección */}
        <section className="flex flex-col md:flex-row items-center justify-center mb-16">
        <div className="md:w-1/2 mb-4 md:mb-0 flex justify-center relative">
            {/* Imagen de fondo */}
            <Image 
                src="/3.png" 
                alt="Imagen descriptiva" 
                width={500} 
                height={500} 
                className="rounded-lg shadow-lg" 
            />

            {/* Imagen superpuesta */}
            <div className="absolute inset-0 flex items-center justify-center">
                <Image 
                src="/card.png" 
                alt="Imagen superpuesta" 
                width={200} 
                height={200} 
                className="rounded-lg" 
                />
            </div>
            </div>
            <div className="md:w-1/2 flex flex-col justify-center items-center">
            <div className="w-full flex justify-center mb-4">
                <Image 
                src="/9.png" 
                alt="Imagen descriptiva" 
                width={500} 
                height={500} 
                className="rounded-lg shadow-lg" 
                />
            </div>
            <p className="text-gray-300 text-center mb-6">
                Escalabilidad y acceso al mercado <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Entorno para hacer negocios <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Errores en gestión <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Acceso a capital
            </p>
            </div>
        </section>    
        <section className="flex flex-col justify-center items-center h-32 mb-16">
            <h2 className="text-center text-2xl md:text-3xl font-extralight mb-5" style={{ fontFamily: 'Moonhouse, sans-serif', color: '#DADDE8' }}>
                Conectando <span style={{ color: '#00e1d4' }}>Emprendedores</span> Apasionados con Oportunidades
            </h2>
            <p className="text-center text-lg md:text-xl mt-4 mb-8" style={{ fontFamily: 'Poppins, sans-serif', color: '#DADDE8' }}>
                Tu tarea es contar la historia detrás de tu sonrisa,<br/>
                RiBuzz <span style={{ color: '#00e1d4' }}>conecta y crea para ti</span>
            </p>
        </section>
                
        <div className="mb-10 mt-6">
            <h1 className="text-center text-4xl md:text-6xl  font-semibold " style={{ fontFamily: 'Poppins, sans-serif', color: '#DADDE8' }}>
                Plataforma <span style={{ color: '#00e1d4' }}>integral</span>
            </h1>
        </div>
        
      {/* Segunda Sección */}
        <section className=" grid-cols-3 gap-4 mb-12 font-extralight hidden md:grid" style={{ fontFamily: 'Moonhouse, sans-serif', color: '#DADDE8' }}>
            <div className="bg-transparent p-6 rounded-lg flex flex-col items-center">
                <p className="text-[#00e1d4] text-center font-bold mb-4">Marketplace:</p>
                <p className="text-gray-300 text-center mb-4">Escalar ventas</p>
                <p className="text-gray-300 text-center mb-4">Unir emprendedor con clientes.</p>
            </div>
            <div className="bg-transparent p-6 rounded-lg flex flex-col items-center">
                <div className="w-24 h-24 flex items-center justify-center border-4 border-white rounded-full">
                    <FaHome className="text-6xl text-gray-100" />
                </div>
            </div>
            <div className="bg-transparent p-6 rounded-lg flex flex-col items-center">
                <p className="text-[#00e1d4] text-center font-bold mb-4 font-Moonhouse">Mentorías y asesorías:</p>
                <p className="text-gray-300 text-center font-Moonhouse">Errores de gestión</p>
            </div>
            <div className="bg-transparent p-6 rounded-lg flex flex-col items-center">
                <div className="w-24 h-24 flex items-center justify-center border-4 border-white rounded-full">
                    <PiCalendarStarFill className="text-6xl text-gray-100" />
                </div>
            </div>
            <div className="relative bg-transparent p-6 rounded-lg flex flex-col items-center">
                {/* Flechas */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full z-10">
                    <FaArrowUp className="text-white text-4xl" />
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full z-10">
                    <FaArrowDown className="text-white text-4xl" />
                </div>
                <div className="absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 z-10">
                    <FaArrowLeft className="text-white text-4xl" />
                </div>
                <div className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2 z-10">
                    <FaArrowRight className="text-white text-4xl" />
                </div>
                {/* Imagen */}
                <img src="/5.png" alt="Imagen descriptiva" className="w-29 h-28 flex items-center justify-center border-4 border-transparent rounded-full z-20 " />
            </div>
            <div className="bg-transparent p-6 rounded-lg flex flex-col items-center">
                <div className="w-24 h-24 flex items-center justify-center border-4 border-white rounded-full">
                    <GiPencil className="text-6xl text-gray-100" />
                </div>
            </div>
            <div className="bg-transparent p-6 rounded-lg flex flex-col items-center">
                <p className="text-[#00e1d4] text-center font-bold mb-4 font-Moonhouse">Eventos</p>
                <p className="text-gray-300 text-center font-Moonhouse">Fomentar entorno de negocios y networking</p>
            </div>
            <div className="bg-transparent p-6 rounded-lg flex flex-col items-center">
                <div className="w-24 h-24 flex items-center justify-center border-4 border-white rounded-full">
                    <FaPeopleGroup className="text-6xl text-gray-100" />
                </div>
            </div>
            <div className="bg-transparent p-6 rounded-lg flex flex-col items-center">
                <p className="text-[#00e1d4] text-center font-bold mb-4 font-Moonhouse">Red de alto valor:</p>
                <p className="text-gray-300 text-center font-Moonhouse">Fomentar alianzas, inversiones y oportunidades</p>
            </div>
        </section>
      {/* Tercera Sección */}
      <section className="flex flex-col items-center justify-center bg-transparent py-6">
            <div className="flex space-x-6 mb-4">
                <BsBuildings className="text-8xl text-white" />
                <GiSandsOfTime className="text-8xl text-white" />
                <GiReceiveMoney className="text-8xl text-white" />
            </div>
            <p className="text-center text-[#DADDE8] text-lg font-light" style={{ fontFamily: 'Moonhouse, sans-serif' }}>
                Empresa - <span style={{ color: '#00e1d4' }}>Ahorrar</span> tiempo y costes
            </p>
            <p className="text-center text-[#DADDE8] text-lg font-light" style={{ fontFamily: 'Moonhouse, sans-serif' }}>
                Soluciones - <span style={{ color: '#C87DAB' }}>Confiables y de calidad</span>
            </p>
    </section>


    <section className="text-center bg-transparent py-12 mb-6">
        {/* Título */}
        <h2 className="text-3xl font-light text-[#DADDE8] mb-12" style={{ fontFamily: 'Moonhouse, sans-serif' }}>
            Modelo de <span style={{ color: '#00e1d4' }}>Comisión</span> B2B
        </h2>
        
        {/* Contenido con flechas e imagen */}
        <div className="flex flex-col md:flex-row items-center justify-center space-x-6 mb-12">
            <div className="flex items-center">
                <p className="text-[#DADDE8] font-light text-lg" style={{ fontFamily: 'Moonhouse, sans-serif' }}>Emprendimiento</p>
                <FaArrowRight className="text-4xl text-[#DADDE8] ml-4" />
            </div>
            <img src="/5.png" alt="Marca" className="w-29 h-28 flex items-center justify-center border-4 border-transparent rounded-full z-20 "/>
            <div className="flex items-center">
                <FaArrowRight className="text-4xl text-[#DADDE8] mr-4" />
                <p className="text-[#DADDE8] font-light text-lg" style={{ fontFamily: 'Moonhouse, sans-serif' }}>Cliente final</p>
            </div>
        </div>
        
        {/* Párrafo */}
        <p className="text-[#DADDE8] text-lg font-light" style={{ fontFamily: 'Moonhouse, sans-serif' }}>
            Modelo Transacción B2C -&gt; Eventos, mentorías, asesorías
            <br />
            Suscripción -&gt; Acceso especial y anticipado a eventos y oportunidades
        </p>
    </section>

    <NewsletterSection/>

   

    </div>
  );
};

export default HomeContainer;
