import React from 'react';
import { images } from '../../assets/images/images';

const MainLanding = () => {
  return (
    <>
      <div className="max-sm:hidden col-span-6 bgimage flex justify-center h-lvh items-center">
        <img src={images.whatsapp} alt="WhatsApp logo" />
        
      </div>
      
    </>
  );
};

export default MainLanding;
