import React from 'react';

import { type Metadata } from 'next';

import { NextThemeProvider } from '@/providers';

import { ReactHotToaster } from '@/components/ui/toast';
import { TooltipProvider } from '@/components/ui/tooltip';

// import { Console } from '@/components/console';
// import { Favicon } from '@/components/favicon';
import { Fingerprint } from '@/components/fingerprint';

import { NICKNAME, SLOGAN, WEBSITE } from '@/constants';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: {
    template: `%s - ${WEBSITE}`,
    default: `${WEBSITE}的个人空间`,
  },
  description: `${SLOGAN}`,
  keywords: NICKNAME,
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html suppressHydrationWarning lang="zh-CN" className="scroll-smooth">
      <head>
        {/* <link rel="icon" href="/favicon.ico" /> */}
        {/* Google Search Console 验证 */}
        <meta
          name="google-site-verification"
          content="DTiRVawomypV2iRoz9UUw2P0wAxnPs-kffJl6MNevdM"
        />
      </head>
      <body className="debug-screens scroll-smooth overflow-x-clip">
        {/* debug-screens  */}
        <NextThemeProvider attribute="class">
          <TooltipProvider>
            {children}

            <ReactHotToaster />

            {/* <Console /> */}

            {/* <Favicon /> */}
            {/* <Analysis /> */}

            <Fingerprint />
          </TooltipProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
