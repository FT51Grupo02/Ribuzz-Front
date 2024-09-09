'use client'
import React from 'react';
import Image from 'next/image';
import CardAbout from '../Cards/cardsabout'

const Page3 = () => {
  return (
    <div className="relative w-full flex flex-col items-center justify-start overflow-hidden min-h-screen">
      <div className="relative w-full">
        <div className="absolute inset-0 z-[-1]">
          <Image
            src="https://res.cloudinary.com/devnzokpy/image/upload/v1725918381/10_cebn7l.webp"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            quality={100}
            priority
          />
        </div>
        <div className="flex justify-center mt-4 mb-6 z-10">
          <Image
            src="https://res.cloudinary.com/devnzokpy/image/upload/v1725918381/11_glr3g8.webp"
            alt="Logo RiBuzz"
            width={300}
            height={200}
            quality={100}
            className="object-contain"
          />
        </div>
        <div className="z-10 flex flex-col items-center justify-center">
          <CardAbout />
        </div>
        <div className="z-10 w-full flex justify-center rounded-xl my-10">
          <iframe
            width="1000"
            height="500"
            src="https://www.youtube.com/embed/anlXhocPwkk"
            title="YouTube"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Page3;
