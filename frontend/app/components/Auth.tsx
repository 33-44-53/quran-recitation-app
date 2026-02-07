'use client'

import { useState } from 'react'
import { Book, Mail, Lock, User, ArrowLeft } from 'lucide-react'
import axios from 'axios'
import { API_URL } from '../config/api'

interface AuthProps {
  onLogin: (token: string, userId: number, name: string) => void
  onBack?: () => void
}

export default function Auth({ onLogin, onBack }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLogin ? '/login' : '/signup'
      const data = isLogin ? { email, password } : { email, password, name }
      
      const response = await axios.post(`${API_URL}${endpoint}`, data)
      
      localStorage.setItem('token', response.data.access_token)
      localStorage.setItem('userId', response.data.user_id.toString())
      localStorage.setItem('userName', response.data.name)
      
      onLogin(response.data.access_token, response.data.user_id, response.data.name)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-islamic-green/10 to-islamic-dark/5 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-islamic-green mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back</span>
          </button>
        )}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-islamic-green p-4 rounded-full">
              <Book className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-islamic-dark dark:text-white mb-2">Qur'an Recitation</h1>
          <p className="text-gray-600 dark:text-gray-300">Your Ramadan Companion</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md transition-colors font-medium ${
                isLogin ? 'bg-white dark:bg-gray-700 shadow-sm text-islamic-dark dark:text-white' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md transition-colors font-medium ${
                !isLogin ? 'bg-white dark:bg-gray-700 shadow-sm text-islamic-dark dark:text-white' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-islamic-green focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-800"
                    placeholder="Your name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-islamic-green focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-800"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-islamic-green focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-800"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-islamic-green text-white py-3 rounded-lg font-semibold hover:bg-islamic-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}