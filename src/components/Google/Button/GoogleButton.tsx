'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

const GoogleLoginButton = () => {
  const router = useRouter();

  const handleGoogleLogin = () => {
    const googleAuthURL = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/google/callback&response_type=code&scope=openid email profile`;
    router.push(googleAuthURL);
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex items-center bg-[#303030] text-white p-3 rounded-lg text-base md:text-lg mt-4"
    >
      <FcGoogle className="w-6 h-6 md:w-7 md:h-7 mr-2 transition duration-300 hover:scale-110" />
      <span className="transition duration-300 hover:scale-110 inline-block text-lg">
       Google
      </span>
    </button>
  );
};

export default GoogleLoginButton;