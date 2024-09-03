'use client'

import { notFound } from 'next/navigation';
import Event from '@/components/EventDetail/Events'; 
import { Event as EventType, Review } from '@/components/Cards/types';

interface Props {
  params: {
    eventId: string;
  };
}

const fetchEvent = async (eventId: string): Promise<EventType | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, {
      cache: 'no-store',
      method: 'GET',
    });

    if (!response.ok) {
      console.error('Error fetching event:', response.statusText);
      return null;
    }

    const data = await response.json();

    const event: EventType = {
      ...data,
      reviews: typeof data.reviews === 'string' ? JSON.parse(data.reviews) : data.reviews,
      date: data.date || '',
      time: data.time || '',
      stock: data.stock || 0,
    };

    return event;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

const EventPage = async ({ params }: Props) => {
  const { eventId } = params;
  const event = await fetchEvent(eventId);

  if (!event) {
    notFound();
    return null;
  }

  return (
    <div>
      <Event {...event} />
    </div>
  );
};

export default EventPage;
