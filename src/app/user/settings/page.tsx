import Datepicker from '@/components/Datepicker/Datepicker';
import React from 'react';

const Settings = () => {
  return (
    <div className='bg-black min-h-screen p-8 flex flex-col items-center'>
      <div className='text-white text-2xl mb-4 text-center'>
        Mi calendario
      </div>
        <Datepicker />
    </div>
  );
};

export default Settings;
