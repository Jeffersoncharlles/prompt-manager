import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar, { SidebarComponent } from '@/components/sidebar-componet'

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
        <section className="flex h-screen">
          <main className="relative flex-1 overflow-auto min-w-0">
            <SidebarComponent />
            <div className="p-4 sm:p-6 md:p-8 max-w-full md:max-w-3xl mx-auto h-full">
              {children}
            </div>
          </main>
        </section>
      </body>
    </html>
  )
}
