'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Shipping: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
    validationSchema: Yup.object({
      address: Yup.string()
        .required('La dirección es obligatoria'),
      city: Yup.string()
        .required('La ciudad es obligatoria'),
      postalCode: Yup.string()
        .required('El código postal es obligatorio'),
      country: Yup.string()
        .required('El país es obligatorio'),
    }),
    onSubmit: (values) => {
      console.log('Shipping Information:', values);
      // Aquí puedes manejar el envío de datos o pasarlos al componente de checkout
    },
  });

  return (
    <div className="bg-transparent p-6 rounded-lg shadow-lg border border-transparent">
      <h2 className="text-2xl font-bold mb-4 border-b border-gray-600 pb-2">Dirección de Envío</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium">Dirección</label>
          <input
            id="address"
            name="address"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
            className="w-full p-2 mt-1 bg-gray-800 text-white rounded-lg"
          />
          {formik.touched.address && formik.errors.address ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.address}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium">Ciudad</label>
          <input
            id="city"
            name="city"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.city}
            className="w-full p-2 mt-1 bg-gray-800 text-white rounded-lg"
          />
          {formik.touched.city && formik.errors.city ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.city}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium">Código Postal</label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.postalCode}
            className="w-full p-2 mt-1 bg-gray-800 text-white rounded-lg"
          />
          {formik.touched.postalCode && formik.errors.postalCode ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.postalCode}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium">País</label>
          <input
            id="country"
            name="country"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.country}
            className="w-full p-2 mt-1 bg-gray-800 text-white rounded-lg"
          />
          {formik.touched.country && formik.errors.country ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.country}</div>
          ) : null}
        </div>

        <button type="submit" className="w-full py-2 mt-4 bg-gradient-to-r from-[#C87DAB] to-[#C12886] text-white font-bold rounded-full">
          Confirmar Dirección
        </button>
      </form>
    </div>
  );
};

export default Shipping;
