import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ComponentsProvider } from '@/contexts/ComponentsContext'
import { LanguageProvider } from '@/contexts/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PC Builder - Configurateur PC Intelligent',
  description: 'Créez votre PC sur mesure avec notre configurateur intelligent',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <LanguageProvider>
          <ComponentsProvider>
            {children}
          </ComponentsProvider>
        </LanguageProvider>
      </body>
    </html>
  )
} 