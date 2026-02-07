'use client'

import { useState, useEffect } from 'react'
import { Book, Calendar, TrendingUp, LogOut, Heart, CheckCircle, Target, Clock, Edit2, BookOpen } from 'lucide-react'
import axios from 'axios'
import { API_URL } from '../config/api'

interface DashboardProps {
  token: string
  userName: string
  onStartReading: (juzNumber: number) => void
  onLogout: () => void
  onFreeReading?: () => void
}

export default function Dashboard({ token, userName, onStartReading, onLogout, onFreeReading }: DashboardProps) {
  const [dailyPlan, setDailyPlan] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [motivation, setMotivation] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showEditPlan, setShowEditPlan] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    ramadan_goal: 1,
    ramadan_start_date: ''
  })

  useEffect(() => {
    fetchData()
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` }
      const [userResponse, planResponse, statsResponse, motivationResponse] = await Promise.all([
        axios.get(`${API_URL}/me`, { headers }),
        axios.get(`${API_URL}/daily-plan`, { headers }),
        axios.get(`${API_URL}/stats`, { headers }),
        axios.get(`${API_URL}/motivation`)
      ])

      setUserData(userResponse.data)
      setDailyPlan(planResponse.data)
      setStats(statsResponse.data)
      setMotivation(motivationResponse.data.message)
      
      // Set edit form values
      if (userResponse.data.ramadan_start_date) {
        setEditForm({
          ramadan_goal: userResponse.data.ramadan_goal || 1,
          ramadan_start_date: userResponse.data.ramadan_start_date.split('T')[0]
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleJuzCompletion = async (juzNumber: number, dayNumber: number, completed: boolean) => {
    try {
      await axios.post(
        `${API_URL}/progress`,
        {
          juz_number: juzNumber,
          day_number: dayNumber,
          completed: !completed
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      fetchData()
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const updatePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post(
        `${API_URL}/set-goal`,
        {
          ramadan_goal: editForm.ramadan_goal,
          ramadan_start_date: editForm.ramadan_start_date
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      setShowEditPlan(false)
      fetchData()
    } catch (error) {
      console.error('Error updating plan:', error)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Calculate Hijri date
  const getHijriDate = () => {
    const today = new Date()
    
    // Using a more accurate calculation
    // Reference date: 1 Muharram 1445 AH = July 19, 2023 CE
    const refGregorian = new Date(2023, 6, 19) // July 19, 2023
    const refHijriDay = 1
    const refHijriMonth = 0 // Muharram
    const refHijriYear = 1445
    
    // Calculate days difference
    const diffTime = today.getTime() - refGregorian.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) - 2 // Subtract 2 for accuracy
    
    // Hijri year length varies between 354 and 355 days
    let hijriDays = diffDays + refHijriDay
    let hijriYear = refHijriYear
    let hijriMonth = refHijriMonth
    
    // Hijri month lengths (approximate)
    const hijriMonthLengths = [29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30]
    const hijriMonths = [
      'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani',
      'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
      'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'
    ]
    
    // Calculate Hijri year
    while (hijriDays > hijriMonthLengths[hijriMonth % 12]) {
      hijriDays -= hijriMonthLengths[hijriMonth % 12]
      hijriMonth++
      if (hijriMonth >= 12) {
        hijriMonth = 0
        hijriYear++
      }
    }
    
    return `${hijriDays} ${hijriMonths[hijriMonth]} ${hijriYear} AH`
  }

  const getRamadanDay = () => {
    if (!userData?.ramadan_start_date) return 1
    const startDate = new Date(userData.ramadan_start_date)
    const today = new Date()
    const diffTime = today.getTime() - startDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
    return Math.max(1, Math.min(30, diffDays))
  }

  const todaysPlan = dailyPlan.find(plan => plan.is_today)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-islamic-green"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-islamic-green/5 to-islamic-dark/5 dark:from-gray-900 dark:to-gray-800">
      {/* Real-time Clock Header */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-islamic-green">
              <Clock className="w-6 h-6" />
              <span className="text-2xl font-bold font-mono">{formatTime(currentTime)}</span>
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">{formatDate(currentTime)}</span>
              <span className="mx-2">•</span>
              <span className="font-medium text-islamic-green" dir="ltr">{getHijriDate()}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-islamic-green/10 dark:bg-islamic-green/20 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">Ramadan Day </span>
              <span className="text-xl font-bold text-islamic-green">{getRamadanDay()}/30</span>
            </div>
            
            <button
              onClick={() => setShowEditPlan(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Edit Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Plan Modal */}
      {showEditPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Edit Your Plan</h2>
            <form onSubmit={updatePlan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Daily Goal (Juz per day)</label>
                <select
                  value={editForm.ramadan_goal}
                  onChange={(e) => setEditForm({...editForm, ramadan_goal: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value={1}>1 Juz - Complete in 30 days</option>
                  <option value={2}>2 Juz - Complete in 15 days</option>
                  <option value={3}>3 Juz - Complete in 10 days</option>
                  <option value={5}>5 Juz - Complete in 6 days</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Ramadan Start Date</label>
                <input
                  type="date"
                  value={editForm.ramadan_start_date}
                  onChange={(e) => setEditForm({...editForm, ramadan_start_date: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-islamic-green text-white py-2 rounded-lg hover:bg-islamic-dark transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditPlan(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-islamic-dark dark:text-white">As-salamu alaykum, {userName}</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Day {todaysPlan?.day || getRamadanDay()} of Ramadan • {userData?.ramadan_goal || 1} juz daily
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {onFreeReading && (
              <button
                onClick={onFreeReading}
                className="flex items-center space-x-2 px-4 py-2 bg-islamic-green text-white rounded-lg hover:bg-islamic-dark transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>Free Reading</span>
              </button>
            )}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-islamic-green transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full Reading</p>
                  <p className="text-3xl font-bold text-islamic-green">
                    {stats.quran_completions.toFixed(1)}x
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Complete readings</p>
                </div>
                <Book className="w-10 h-10 text-islamic-green" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.completion_percentage}%
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-blue-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Today's Progress</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.today_percentage}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stats.today_completed}/{stats.today_required} Juz
                  </p>
                </div>
                <Target className="w-10 h-10 text-purple-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Days Left</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {stats.days_remaining}
                  </p>
                </div>
                <Calendar className="w-10 h-10 text-orange-600" />
              </div>
            </div>
          </div>
        )}

        {todaysPlan && (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Today's Reading Plan</h2>
            <div className="space-y-3">
              {todaysPlan.required_juz.map((juzNumber: number) => {
                const isCompleted = todaysPlan.completed_juz.includes(juzNumber)
                return (
                  <div
                    key={juzNumber}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                      isCompleted ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                      }`}>
                        {juzNumber}
                      </div>
                      <div>
                        <div className="font-semibold text-lg dark:text-white">Juz {juzNumber}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">≈ 20 pages</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onStartReading(juzNumber)}
                        className="px-4 py-2 bg-islamic-green text-white rounded-lg hover:bg-islamic-dark transition-colors"
                      >
                        Read
                      </button>
                      <button
                        onClick={() => toggleJuzCompletion(juzNumber, todaysPlan.day, isCompleted)}
                        className={`p-2 rounded-lg ${
                          isCompleted ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
                        }`}
                      >
                        <CheckCircle className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-red-500" />
            <p className="text-lg italic text-gray-700 dark:text-gray-300">{motivation}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Ramadan Calendar</h2>
          <div className="grid grid-cols-7 gap-2">
            {dailyPlan.map((day) => {
              const completionRate = day.required_juz.length > 0 
                ? (day.completed_juz.length / day.required_juz.length) * 100 
                : 0
              
              return (
                <div
                  key={day.day}
                  className={`p-3 rounded-lg text-center border-2 ${
                    day.is_today
                      ? 'border-islamic-green bg-green-50'
                      : day.is_future
                      ? 'border-gray-200 bg-gray-100 opacity-60'
                      : completionRate === 100
                      ? 'border-green-500 bg-green-100'
                      : completionRate > 0
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className={`font-bold ${day.is_today ? 'text-islamic-green' : 'text-gray-800'}`}>{day.day}</div>
                  <div className={`text-xs mt-1 font-medium ${day.is_today ? 'text-islamic-dark' : 'text-gray-700'}`}>
                    {day.completed_juz.length}/{day.required_juz.length}
                  </div>
                  <div className={`text-xs font-semibold ${completionRate === 100 ? 'text-green-600' : completionRate > 0 ? 'text-yellow-600' : 'text-red-400'}`}>{Math.round(completionRate)}%</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
