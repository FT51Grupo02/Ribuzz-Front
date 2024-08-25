'use client'
import React from 'react';

const NewsletterSection = () => {
    return (
        <section 
            className="bg-transparent p-8 border-t border-gray-600 mx-auto" 
            style={{ 
                borderTopLeftRadius: '5rem', 
                borderTopRightRadius: '0.5rem', 
                borderBottomLeftRadius: '0.5rem', 
                borderBottomRightRadius: '5rem',
                fontFamily: 'Poppins, sans-serif' 
            }}
        >
            <div className="max-w-sm mx-auto text-center"> 
                <p className="text-[#DADDE8] text-lg mb-5"> 
                    Suscríbete a nuestro canal de información para obtener las últimas noticias de Ribuzz
                </p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                    <input 
                        type="email" 
                        placeholder="Tu correo electrónico" 
                        className="p-2 rounded-l-lg border-none outline-none w-full md:w-auto" 
                    />
                    <button 
                        className="p-3 md:p-4 text-sm md:text-base text-white font-light rounded-full bg-gradient-to-r from-[#C87DAB] to-[#C12886] shadow-md hover:shadow-lg transition-shadow"
                    >
                        Suscribirse
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;

