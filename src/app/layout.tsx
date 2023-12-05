import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import DrawerLayout from './components/DrawerLayout'

const roboto = Roboto({ subsets: ['latin'], weight:['500', '700'] })

export const metadata: Metadata = {
  title: 'Barkin App',
  description: 'Gerenciamento de estacionamento',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={roboto.className}>
        <DrawerLayout>
          {children}
        </DrawerLayout>
        </body>
    </html>
  )
}
