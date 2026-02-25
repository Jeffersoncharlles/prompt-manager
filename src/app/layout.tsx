import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Prompt Manager',
    default: 'Prompt Manager',
  },
  description: 'Gerenciador de prompts para IA',
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '700'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-neutral-900 text-white antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
