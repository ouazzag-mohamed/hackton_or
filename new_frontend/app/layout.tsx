import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import ChatbotWidget from '@/components/chatbot-widget'

export const metadata: Metadata = {
  title: 'IRCHAD - Orientation Program',
  description: 'Created by Inalgora Team',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <ChatbotWidget />
      </body>
    </html>
  )
}
