import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Tilawa - Your Journey Through the Quran',
  description: 'Track your daily reading, set goals, and deepen your connection with the Holy Quran',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-islamic-green/10 to-islamic-dark/5">
          {children}
        </div>
      </body>
    </html>
  )
}