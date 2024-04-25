'use client';

import { useLayoutEffect, useMemo, useState } from 'react';

import { useTheme } from 'next-themes';

import { loadAll } from '@tsparticles/all';
import { type IOptions, type RecursivePartial } from '@tsparticles/engine';
import Particles, { initParticlesEngine } from '@tsparticles/react';

export default function ParticlesBackground() {
  const [init, setInit] = useState(false);
  const { resolvedTheme } = useTheme();

  // this should be run only once per application lifetime
  useLayoutEffect(() => {
    void initParticlesEngine(async (engine) => {
      await loadAll(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: RecursivePartial<IOptions> = useMemo(() => {
    let color: string;
    let links: string;

    if (!init) {
      color = '';
      links = '';
    } else {
      if (resolvedTheme === 'light') {
        color = '#fff';
        links = '#000';
      } else if (resolvedTheme === 'dark') {
        color = '#000';
        links = '#fff';
      } else {
        color = '';
        links = '';
      }
    }

    return {
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: false,
            mode: 'push',
          },
          onHover: {
            enable: true,
            mode: 'repulse',
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 120,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: color,
        },
        links: {
          color: links,
          distance: 150,
          enable: true,
          opacity: 0.7,
          width: 1,
        },
        move: {
          enable: true,
          random: false,
          speed: 2,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 40,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    };
  }, [init, resolvedTheme]);

  if (init) {
    return (
      <Particles
        id="tsparticles"
        className="z-[-1] fixed"
        options={options}
      ></Particles>
    );
  }

  return (
    <Particles
      id="tsparticles"
      className="z-[-1] fixed"
      options={options}
    ></Particles>
  );
}
