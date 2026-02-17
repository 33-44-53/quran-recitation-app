import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './context/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Tilawa - Your Journey Through the Quran',
  description: 'Track your Quran reading progress during Ramadan. Set daily goals, track Juz completion, and deepen your connection with the Holy Quran.',
  keywords: 'Quran, Tilawa, Ramadan, Islamic app, Quran reading, Juz tracker, Quran progress, Muslim app, Quran recitation',
  authors: [{ name: 'Umer Software' }],
  openGraph: {
    title: 'Tilawa - Your Journey Through the Quran',
    description: 'Track your Quran reading progress during Ramadan',
    url: 'https://tilawa.vercel.app',
    siteName: 'Tilawa',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tilawa - Your Journey Through the Quran',
    description: 'Track your Quran reading progress during Ramadan',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}