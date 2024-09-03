'use client';

import { notFound } from 'next/navigation';
import Service from '@/components/ServiceDetail/Services';
import { Service as ServiceType } from '@/components/Cards/types';

interface Props {
  params: {
    serviceId: string;
  };
}

const fetchService = async (serviceId: string): Promise<ServiceType | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${serviceId}`, {
      cache: 'no-store',
      method: 'GET',
    });

    if (!response.ok) {
      console.error('Error fetching service:', response.statusText);
      return null;
    }

    const service: ServiceType = await response.json();
    return service;
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
};

const ServicePage = async ({ params }: Props) => {
  const { serviceId } = params;
  const service = await fetchService(serviceId);

  if (!service) {
    notFound();
    return null;
  }

  return (
    <div>
      <Service {...service} />
    </div>
  );
};

export default ServicePage;
