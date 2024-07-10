import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import DrawerLayout from '@/lib/common/components/DrawerLayout'
import StoreProvider from './StoreProvider'

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
    <html lang="pt-BR">
      <body className={roboto.className}>
        <StoreProvider>
          <DrawerLayout>
            {children}
          </DrawerLayout>
        </StoreProvider>
        <Analytics />
        </body>
    </html>
  )
}
