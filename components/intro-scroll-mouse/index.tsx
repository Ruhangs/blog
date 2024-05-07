import React from 'react';

export const IntroScrollMouse = () => {
  return (
    <div className="w-[15px] h-[20px] md:w-[20px] md:h-[28px] rounded-full border-2 border-primary/30 relative grid justify-center pt-2">
      <div className="w-[2px] h-[3px] md:h-[5px] bg-primary/30  rounded-full animate-intro-scroll"></div>
    </div>
  );
};
