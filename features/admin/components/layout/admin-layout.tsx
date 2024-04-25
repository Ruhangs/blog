'use client';

import React from 'react';

import { SessionProvider } from 'next-auth/react';

import { Sidenav } from '../sidenav';

export const AdminLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <SessionProvider>
      <div className="flex h-screen bg-white dark:bg-black">
        <Sidenav />
        <section className="flex-1 bg-background overflow-clip">
          {children}
        </section>
      </div>
    </SessionProvider>
  );
};
