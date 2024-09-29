import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import CssBaseline from '@mui/material/CssBaseline';
import './globals.css'
import DrawerLayout from '@/lib/common/components/DrawerLayout'
import StoreProvider from './StoreProvider'
import theme from "@/lib/common/themes";


const roboto = Roboto({ subsets: ['latin'], weight:['500', '700'] })

export const metadata: Metadata = {
  title: 'Barkin App',
  description: 'Gerenciamento de estacionamento',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={roboto.className}>
        <StoreProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <InitColorSchemeScript />
              <DrawerLayout>
                {children}
              </DrawerLayout>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </StoreProvider>
        <Analytics />
        </body>
    </html>
  )
}
