'use client';

import React from 'react';
import { TypeAnimation } from 'react-type-animation';

export const TypeIntro = () => {
  return (
    <TypeAnimation
      className="text-2xl md:text-4xl tracking-widest"
      sequence={[
        100,
        'A Web <Developer />.',
        1000,
        '一名热爱前端的人儿~',
        1000,
      ]}
      speed={5}
      repeat={Infinity}
    />
  );
};
