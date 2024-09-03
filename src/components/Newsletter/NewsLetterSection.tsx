'use client'
import React from 'react';

const NewsletterSection = () => {
    return (
        <section 
            className="bg-black bg-opacity-80 border-opacity-80 p-8 border-t border-pink-600 mx-auto font-poppins" 
            style={{ 
                borderTopLeftRadius: '5rem', 
                borderTopRightRadius: '0.5rem', 
                borderBottomLeftRadius: '0.5rem', 
                borderBottomRightRadius: '5rem',
            }}
        >
            <div className="flex flex-col items-center mx-auto"> 
                <p className="text-[#DADDE8] text-base mb-5 text-center">
                    Suscríbete a nuestro canal de información para obtener las últimas noticias de Ribuzz
                </p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-2 w-full">
                    <div className="flex w-full md:w-auto">
                        <input 
                            type="email" 
                            placeholder="tucorreo@mail.com" 
                            className="p-2 rounded-l-lg outline-none bg-black border border-pink-400 border-opacity-50 w-full"
                        />
                        <button 
                            className="p-2 text-sm md:text-base text-white font-light rounded-r-lg bg-gradient-to-r from-[#C87DAB] to-[#C12886] shadow-md hover:shadow-lg transition-shadow w-full md:w-auto"
                        >
                            <span className="inline-block transition duration-300 hover:scale-110">
                                Suscribirse
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;
