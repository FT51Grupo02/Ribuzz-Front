import React from 'react';

const NotFoundPage = () => {
  return (
    <section
      className="flex items-center h-screen p-16 bg-cover bg-center w-full"
      style={{ backgroundImage: 'url("https://img.freepik.com/foto-gratis/render-3d-fondo-tecnologia-moderna-particulas-que-fluyen_1048-12683.jpg?t=st=1724265832~exp=1724269432~hmac=33df7ab39128986e02e2ca8233ee7f558bb3e37856157e3085e5d817d66cd0e6&w=900")' }}
    >
      <div className="container flex flex-col items-center">
        <div className="flex flex-col gap-6 max-w-md text-center">
          <h2 className="font-extrabold text-9xl text-gray-100 text-shadow-1">
            <span className="sr-only drop-shadow-lg">Error</span> 404
          </h2>
          <p className="text-2xl md:text-3xl text-gray-100 drop-shadow-lg">No se encontró la página</p>
          <a
            href="/"
            className="px-8 py-4 text-xl font-semibold rounded bg-black text-gray-50 hover:text-white hover:filter hover:invert transition duration-300"
          >
            <span className="transition duration-300 hover:scale-110 inline-block">
              Vuelve al inicio
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;
