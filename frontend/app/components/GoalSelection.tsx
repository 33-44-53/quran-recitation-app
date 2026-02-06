'use client'

import { useState } from 'react'
import { Book, Calendar, Target } from 'lucide-react'
import axios from 'axios'

interface GoalSelectionProps {
  token: string
  onGoalSet: () => void
  onFreeReading?: () => void
}

export default function GoalSelection({ token, onGoalSet, onFreeReading }: GoalSelectionProps) {
  const [selectedGoal, setSelectedGoal] = useState(1)
  const [loading, setLoading] = useState(false)

  const goals = [
    { value: 1, label: '1 Time', description: '1 Juz per day', days: '30 days', color: 'bg-green-500' },
    { value: 2, label: '2 Times', description: '2 Juz per day', days: '15 days per completion', color: 'bg-blue-500' },
    { value: 3, label: '3 Times', description: '3 Juz per day', days: '10 days per completion', color: 'bg-purple-500' },
    { value: 5, label: '5 Times', description: '5 Juz per day', days: '6 days per completion', color: 'bg-orange-500' },
  ]

  const handleStartJourney = async () => {
    setLoading(true)
    try {
      await axios.post(
        'http://localhost:8000/set-goal',
        {
          ramadan_goal: selectedGoal,
          ramadan_start_date: new Date().toISOString()
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      onGoalSet()
    } catch (error) {
      console.error('Error setting goal:', error)
      alert('Failed to set goal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 dark:bg-gray-900">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-islamic-green p-4 rounded-full">
              <Book className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-islamic-dark dark:text-white mb-4">
            Set Your Ramadan Goal
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            How many times do you want to complete the Qur'an?
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {goals.map((goal) => (
              <button
                key={goal.value}
                onClick={() => setSelectedGoal(goal.value)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedGoal === goal.value
                    ? 'border-islamic-green bg-islamic-green/10 scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-islamic-green/50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-4 h-4 rounded-full ${goal.color} mt-1`} />
                  <div className="text-left flex-1">
                    <div className="font-bold text-xl mb-1 dark:text-white">{goal.label}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">{goal.description}</div>
                    <div className="text-gray-500 dark:text-gray-500 text-xs mt-1">{goal.days}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Target className="w-8 h-8 text-islamic-green mx-auto mb-2" />
                <div className="font-semibold text-lg dark:text-white">{selectedGoal}x</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completions</div>
              </div>
              <div>
                <Calendar className="w-8 h-8 text-islamic-green mx-auto mb-2" />
                <div className="font-semibold text-lg dark:text-white">{selectedGoal} Juz</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Per Day</div>
              </div>
              <div>
                <Book className="w-8 h-8 text-islamic-green mx-auto mb-2" />
                <div className="font-semibold text-lg dark:text-white">{30 * selectedGoal}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Juz</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartJourney}
            disabled={loading}
            className="w-full bg-islamic-green text-white py-4 rounded-xl font-semibold text-lg hover:bg-islamic-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Setting Goal...' : 'Begin Ramadan Journey'}
          </button>

          {/* Read Without Goal Button */}
          {onFreeReading && (
            <button
              onClick={onFreeReading}
              className="w-full mt-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Read Without Goal
            </button>
          )}
        </div>
      </div>
    </div>
  )
}