'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-20 right-6 z-[9999] p-3 rounded-full bg-white dark:bg-gray-900 shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-gray-300 dark:border-gray-600"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-6 h-6 text-gray-800" />
      ) : (
        <Sun className="w-6 h-6 text-yellow-400" />
      )}
    </button>
  )
}