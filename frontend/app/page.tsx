'use client'

import { useState, useEffect } from 'react'
import Auth from './components/Auth'
import LandingPage from './components/LandingPage'
import GoalSelection from './components/GoalSelection'
import Dashboard from './components/Dashboard'
import QuranReader from './components/QuranReader'
import FreeReading from './components/FreeReading'
import ThemeToggle from './components/ThemeToggle'
import { Home as HomeIcon, BookOpen, Play } from 'lucide-react'
import { API_URL } from './config/api'

export default function Home() {
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'setup' | 'dashboard' | 'reader' | 'freereading'>('landing')
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [userName, setUserName] = useState<string>('')
  const [selectedJuz, setSelectedJuz] = useState<number>(1)
  const [lastReadJuz, setLastReadJuz] = useState<number>(1)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUserId = localStorage.getItem('userId')
    const savedUserName = localStorage.getItem('userName')
    const savedLastRead = localStorage.getItem('lastReadJuz')
    
    if (savedToken && savedUserId) {
      setToken(savedToken)
      setUserId(parseInt(savedUserId))
      setUserName(savedUserName || '')
      if (savedLastRead) {
        setLastReadJuz(parseInt(savedLastRead))
      }
      checkUserGoal(savedToken)
    }
  }, [])

  const checkUserGoal = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
      const data = await response.json()
      
      if (data.ramadan_goal && data.ramadan_start_date) {
        setCurrentView('dashboard')
      } else {
        setCurrentView('setup')
      }
    } catch (error) {
      console.error('Error checking user goal:', error)
      setCurrentView('setup')
    }
  }

  const handleLogin = (authToken: string, id: number, name: string) => {
    setToken(authToken)
    setUserId(id)
    setUserName(name)
    checkUserGoal(authToken)
  }

  const handleGoalSet = () => {
    setCurrentView('dashboard')
  }

  const handleFreeReading = () => {
    setCurrentView('freereading')
  }

  const handleBackFromFreeReading = () => {
    setCurrentView('dashboard')
  }

  const handleStartReading = (juzNumber: number) => {
    setSelectedJuz(juzNumber)
    localStorage.setItem('lastReadJuz', juzNumber.toString())
    setLastReadJuz(juzNumber)
    setCurrentView('reader')
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
  }

  const handleJuzChange = (juzNumber: number) => {
    setSelectedJuz(juzNumber)
    localStorage.setItem('lastReadJuz', juzNumber.toString())
    setLastReadJuz(juzNumber)
  }

  const handleLogout = () => {
    localStorage.clear()
    setToken(null)
    setUserId(null)
    setUserName('')
    setCurrentView('landing')
  }

  const handleSignUp = () => {
    setCurrentView('auth')
  }

  const handleSignIn = () => {
    setCurrentView('auth')
  }

  const handleBackToLanding = () => {
    setCurrentView('landing')
  }

  const handleContinueReading = () => {
    const saved = localStorage.getItem('lastReadJuz')
    const juz = saved ? parseInt(saved) : lastReadJuz
    setSelectedJuz(juz)
    setCurrentView('reader')
  }

  // Floating navigation bar for reader mode
  const renderNavigationBar = () => {
    if (currentView === 'reader') {
      return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 rounded-full shadow-lg px-6 py-3 flex items-center space-x-4 z-50 border border-islamic-green/20 dark:border-islamic-green/40">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center space-x-2 text-islamic-green hover:text-islamic-dark transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            <span className="font-medium">Progress</span>
          </button>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
          <button
            onClick={handleContinueReading}
            className="flex items-center space-x-2 text-islamic-green hover:text-islamic-dark transition-colors"
          >
            <Play className="w-5 h-5" />
            <span className="font-medium">Continue: Juz {lastReadJuz}</span>
          </button>
        </div>
      )
    }
    return null
  }

  // Dashboard with Continue Reading button
  const renderDashboardWithContinue = () => {
    return (
      <>
        <Dashboard 
          token={token!}
          userName={userName}
          onStartReading={handleStartReading}
          onLogout={handleLogout}
          onFreeReading={handleFreeReading}
        />
        {/* Continue Reading Floating Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={handleContinueReading}
            className="flex items-center space-x-2 bg-islamic-green text-white px-6 py-3 rounded-full shadow-lg hover:bg-islamic-dark transition-colors"
          >
            <Play className="w-5 h-5" />
            <span className="font-medium">Continue Reading</span>
            <span className="bg-white/20 px-2 py-1 rounded text-sm">Juz {lastReadJuz}</span>
          </button>
        </div>
      </>
    )
  }

  if (currentView === 'landing') {
    return (
      <>
        <ThemeToggle />
        <LandingPage onSignUp={handleSignUp} onSignIn={handleSignIn} onFreeReading={handleFreeReading} />
      </>
    )
  }

  if (currentView === 'auth') {
    return (
      <>
        <ThemeToggle />
        <Auth onLogin={handleLogin} onBack={handleBackToLanding} />
      </>
    )
  }

  if (currentView === 'setup') {
    return (
      <>
        <ThemeToggle />
        <GoalSelection token={token!} onGoalSet={handleGoalSet} onFreeReading={handleFreeReading} />
      </>
    )
  }

  if (currentView === 'freereading') {
    return (
      <>
        <ThemeToggle />
        <FreeReading onBack={handleBackFromFreeReading} />
      </>
    )
  }

  if (currentView === 'reader') {
    return (
      <>
        <ThemeToggle />
        <QuranReader 
          juzNumber={selectedJuz} 
          token={token!} 
          onBack={handleBackToDashboard}
          onJuzChange={handleJuzChange}
        />
        {renderNavigationBar()}
      </>
    )
  }

  return (
    <>
      <ThemeToggle />
      {renderDashboardWithContinue()}
    </>
  )
}
