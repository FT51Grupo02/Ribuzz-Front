import React from 'react';
import Page1 from '@/components/About/page1';
import Page3 from '@/components/About/page3';
import Page2 from '@/components/About/page2';

const About: React.FC = () => {
  return (
    <div className='font-poppins'>
    <Page1/>
    <Page2/>
    <Page3/>
    </div>
  );
}

export default About;
