import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        '870': '870px', // Responsive personalizado
      },
      dropShadow: {
        'custom-light': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'custom-dark': '0 4px 6px rgba(0, 0, 0, 0.7)',
      },
      fontFamily: {
        'poppins-regular': ['Poppins-Regular', 'sans-serif'],
        'poppins-bold': ['Poppins-Bold', 'sans-serif'],
        'poppins-italic': ['Poppins-Italic', 'sans-serif'],
        'poppins-bold-italic': ['Poppins-BoldItalic', 'sans-serif'],
        'poppins-extra-bold': ['Poppins-ExtraBold', 'sans-serif'],
        'poppins-extra-light': ['Poppins-ExtraLight', 'sans-serif'],
        'poppins-medium': ['Poppins-Medium', 'sans-serif'],
        'poppins-thin': ['Poppins-Thin', 'sans-serif'],
        'moonhouse': ['Moonhouse', 'sans-serif'],
      },
      maxWidth: {
        '4.5xl': '64rem', // max-w-4.5xl
        'screen-lg': '66rem', // max-w-screen-lg
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
};

export default config;
