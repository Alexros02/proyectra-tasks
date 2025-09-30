import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AppWrapper from '@/components/AppWrapper'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Proyectra Tasks',
  description: 'Sistema de gestión de tareas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <AppWrapper>
            {children}
          </AppWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
