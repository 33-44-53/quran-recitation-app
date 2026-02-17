'use client'

import { useState } from 'react'
import { BookOpen, Heart, Star, Moon, Sun, Book, MessageCircle, Linkedin, Instagram, HelpCircle, X } from 'lucide-react'

interface LandingPageProps {
  onSignUp: () => void
  onSignIn: () => void
  onFreeReading: () => void
}

export default function LandingPage({ onSignUp, onSignIn, onFreeReading }: LandingPageProps) {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div 
      className="min-h-screen relative bg-black"
    >
      {/* Dark overlay - removed since using solid black bg */}
      
      {/* Top Right Buttons */}
      <div className="absolute top-6 right-6 flex items-center space-x-4 z-20">
        <button
          onClick={() => setShowHelp(true)}
          className="px-6 py-2.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-full font-medium hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Help</span>
        </button>
        <button
          onClick={onSignIn}
          className="px-6 py-2.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-full font-medium hover:bg-white/20 transition-all duration-300"
        >
          Sign In
        </button>
        <button
          onClick={onSignUp}
          className="px-6 py-2.5 bg-islamic-green text-white rounded-full font-medium hover:bg-islamic-dark transition-all duration-300 shadow-lg"
        >
          Sign Up
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        
        {/* Islamic Decorative Elements */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-islamic-green" />
          </div>
          {/* Decorative stars */}
          <Star className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          <Star className="w-4 h-4 text-yellow-400 absolute -bottom-1 -left-2 animate-pulse delay-100" />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
          <span className="text-islamic-green">Tilawa</span>
        </h1>
        
        {/* Arabic Title */}
        <p className="arabic-text text-4xl md:text-5xl mb-6 text-white/90">
          تِلاْوَة
        </p>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-white/90 mb-4 font-light max-w-2xl">
          Your Journey Through the Quran
        </p>
        
        {/* Subtitle */}
        <p className="text-lg text-white/70 mb-12 max-w-xl">
          Track your daily reading, set goals, and deepen your connection with the Holy Quran
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="w-12 h-12 mx-auto bg-islamic-green/20 rounded-xl flex items-center justify-center mb-4">
              <Sun className="w-6 h-6 text-islamic-green" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Daily Progress</h3>
            <p className="text-white/60 text-sm">Track your daily reading and maintain consistency</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="w-12 h-12 mx-auto bg-islamic-green/20 rounded-xl flex items-center justify-center mb-4">
              <Moon className="w-6 h-6 text-islamic-green" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Set Goals</h3>
            <p className="text-white/60 text-sm">Plan your Ramadan or yearly Quran completion</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="w-12 h-12 mx-auto bg-islamic-green/20 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-islamic-green" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Deepen Connection</h3>
            <p className="text-white/60 text-sm">Reflect and connect with the words of Allah</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button
            onClick={onSignUp}
            className="px-8 py-4 bg-islamic-green text-white text-lg rounded-full font-medium hover:bg-islamic-dark transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Begin Your Journey
          </button>
          
          {/* Free Reading Button - No Login Required */}
          <button
            onClick={onFreeReading}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white text-lg rounded-full font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Book className="w-5 h-5" />
            <span>Read Quran Now</span>
          </button>
        </div>

        {/* Bottom Text */}
        <p className="mt-8 text-white/50 text-sm">
          "Indeed, those who recite the Book of Allah..." (Quran 35:29)
        </p>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-black/80 border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-islamic-green" />
              <span className="text-white font-semibold">Tilawa</span>
            </div>
            
            {/* Copyright */}
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Tilawa by Umer Software. Your Journey Through the Quran.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a href="https://t.me/umem2034" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-islamic-green transition-colors" title="Telegram">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/umer.salahadin" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-islamic-green transition-colors" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/umer-selahadin-77b83b318/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-islamic-green transition-colors" title="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Decorative bottom pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-islamic-green to-transparent"></div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="sticky top-0 bg-islamic-green text-white p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-6 h-6" />
                <h2 className="text-2xl font-bold">User Guide</h2>
              </div>
              <button onClick={() => setShowHelp(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-88px)] p-6 space-y-6">
              <section>
                <h3 className="text-xl font-bold text-islamic-green mb-3">🚀 Getting Started</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p className="font-semibold">Step 1: Create Your Account</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Click "Sign Up" button</li>
                    <li>Enter your name, email, and password</li>
                    <li>Click "Create Account"</li>
                  </ol>
                  <p className="font-semibold mt-4">Step 2: Set Your Ramadan Goal</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>1 Juz/day</strong> → Complete in 30 days (Beginner)</li>
                    <li><strong>2 Juz/day</strong> → Complete in 15 days (Moderate)</li>
                    <li><strong>3 Juz/day</strong> → Complete in 10 days (Advanced)</li>
                    <li><strong>5 Juz/day</strong> → Complete in 6 days (Expert)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-islamic-green mb-3">📊 Dashboard Overview</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Statistics Cards:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Full Reading - Total Quran completions</li>
                    <li>Overall Progress - Completion percentage</li>
                    <li>Today's Progress - Current day status</li>
                    <li>Days Remaining - Countdown to end</li>
                  </ul>
                  <p className="mt-3"><strong>Today's Plan:</strong> Shows Juz assigned for today with Read and checkmark buttons</p>
                  <p className="mt-3"><strong>All Ramadan Days:</strong> Expandable calendar showing all 30 days. Click any day to view and complete its Juz assignments</p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-islamic-green mb-3">📖 Reading the Quran</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>From Dashboard:</strong> Click "Read" button on any Juz</p>
                  <p><strong>Free Reading Mode:</strong> Click "Free Reading" to browse by:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Juz (1-30)</li>
                    <li>Surah (1-114)</li>
                    <li>Page (1-604)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-islamic-green mb-3">✅ Tracking Progress</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Mark as Complete:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Click checkmark (✓) next to any Juz</li>
                    <li>Click "Mark as Read" while reading</li>
                    <li>Expand any day in calendar to mark specific Juz</li>
                  </ul>
                  <p className="mt-3"><strong>Catch Up:</strong> Click on past days in the calendar to complete missed readings</p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-islamic-green mb-3">💡 Pro Tips</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Check dashboard daily for motivation</li>
                    <li>Use the expandable calendar to plan ahead</li>
                    <li>Complete missed days anytime - no pressure!</li>
                    <li>Toggle dark mode for comfortable night reading</li>
                    <li>Add to home screen on mobile for quick access</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-islamic-green mb-3">🤝 Need Help?</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p>Contact us:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Telegram: @umem2034</li>
                    <li>Instagram: @umer.salahadin</li>
                    <li>LinkedIn: Umer Selahadin</li>
                  </ul>
                </div>
              </section>

              <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-islamic-green font-semibold text-lg">May Allah Accept Your Recitation! 🤲</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Ramadan Mubarak!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
