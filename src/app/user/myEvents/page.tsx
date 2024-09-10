import EventsCalendar from '@/components/SideBar/EventsCalendar'
import React from 'react'
import Image from 'next/image'

const MyEvents = () => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 z-[-1]">
        <div className="relative w-full h-full">
          <Image
            src="https://res.cloudinary.com/devnzokpy/image/upload/v1725918381/16_hebffn.webp"
            alt="Background"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>
      </div>
      <div className="relative flex-1 bg-black bg-opacity-50 text-white">
        <EventsCalendar />
      </div>
    </div>
  )
}

export default MyEvents
