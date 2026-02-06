'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import axios from 'axios'

interface QuranReaderProps {
  juzNumber: number
  token: string
  onBack: () => void
  onJuzChange?: (juzNumber: number) => void
}

export default function QuranReader({ juzNumber, token, onBack, onJuzChange }: QuranReaderProps) {
  const [viewMode, setViewMode] = useState<'juz' | 'surah' | 'page'>('juz')
  const [currentJuz, setCurrentJuz] = useState(juzNumber)
  const [currentSurah, setCurrentSurah] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [ayahs, setAyahs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showSurahList, setShowSurahList] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Load saved position when Juz changes
  useEffect(() => {
    const savedPosition = localStorage.getItem(`quran_position_${currentJuz}`)
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition))
      }, 100)
    }
  }, [currentJuz, ayahs.length])

  // Save scroll position when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (viewMode === 'juz') {
        localStorage.setItem(`quran_position_${currentJuz}`, window.scrollY.toString())
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentJuz, viewMode])

  // Also save position when leaving the reader
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (viewMode === 'juz') {
        localStorage.setItem(`quran_position_${currentJuz}`, window.scrollY.toString())
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [currentJuz, viewMode])

  useEffect(() => {
    fetchContent()
  }, [viewMode, currentJuz, currentSurah, currentPage])

  const fetchContent = async () => {
    setLoading(true)
    try {
      let response
      if (viewMode === 'juz') {
        response = await axios.get(`http://localhost:8000/quran/juz/${currentJuz}`)
      } else if (viewMode === 'surah') {
        response = await axios.get(`http://localhost:8000/quran/surah/${currentSurah}`)
      } else {
        response = await axios.get(`http://localhost:8000/quran/page/${currentPage}`)
      }
      setAyahs(response.data.data.ayahs || [])
    } catch (error) {
      console.error('Error fetching Quran:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async () => {
    try {
      await axios.post(
        'http://localhost:8000/progress',
        {
          juz_number: viewMode === 'juz' ? currentJuz : null,
          surah_number: viewMode === 'surah' ? currentSurah : null,
          page_number: viewMode === 'page' ? currentPage : null,
          day_number: 1,
          completed: true
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      alert('Marked as read!')
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const groupedAyahs = ayahs.reduce((acc, ayah) => {
    const surahNumber = ayah.surah.number
    if (!acc[surahNumber]) {
      acc[surahNumber] = {
        surah: ayah.surah,
        ayahs: []
      }
    }
    acc[surahNumber].ayahs.push(ayah)
    return acc
  }, {} as Record<number, { surah: any, ayahs: any[] }>)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-islamic-green"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-green/5 to-islamic-dark/5">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-semibold">
                  {viewMode === 'juz' && `Juz ${currentJuz}`}
                  {viewMode === 'surah' && `Surah ${currentSurah}`}
                  {viewMode === 'page' && `Page ${currentPage}`}
                </h1>
                <p className="text-sm text-gray-600">{ayahs.length} Ayahs</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="juz">By Juz</option>
                <option value="surah">By Surah</option>
                <option value="page">By Page</option>
              </select>

              {viewMode === 'juz' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      // Save position before leaving
                      localStorage.setItem(`quran_position_${currentJuz}`, window.scrollY.toString())
                      const newJuz = Math.max(1, currentJuz - 1)
                      setCurrentJuz(newJuz)
                      onJuzChange?.(newJuz)
                    }}
                    disabled={currentJuz === 1}
                    className="p-2 bg-gray-100 rounded disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-3 py-1 bg-islamic-green text-white rounded">{currentJuz}</span>
                  <button
                    onClick={() => {
                      // Save position before leaving
                      localStorage.setItem(`quran_position_${currentJuz}`, window.scrollY.toString())
                      const newJuz = Math.min(30, currentJuz + 1)
                      setCurrentJuz(newJuz)
                      onJuzChange?.(newJuz)
                    }}
                    disabled={currentJuz === 30}
                    className="p-2 bg-gray-100 rounded disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {viewMode === 'surah' && (
                <button
                  onClick={() => setShowSurahList(!showSurahList)}
                  className="px-3 py-2 bg-islamic-green text-white rounded-lg"
                >
                  Select Surah
                </button>
              )}

              {viewMode === 'page' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-gray-100 rounded disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-3 py-1 bg-islamic-green text-white rounded">{currentPage}</span>
                  <button
                    onClick={() => setCurrentPage(Math.min(604, currentPage + 1))}
                    disabled={currentPage === 604}
                    className="p-2 bg-gray-100 rounded disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              <button
                onClick={markAsRead}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Mark as Read</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSurahList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Select Surah</h2>
              <button onClick={() => setShowSurahList(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 114 }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setCurrentSurah(num)
                    setShowSurahList(false)
                  }}
                  className="p-3 text-left border rounded-lg hover:bg-islamic-green/10 hover:border-islamic-green transition-colors"
                >
                  <div className="font-semibold">Surah {num}</div>
                  <div className="text-sm text-gray-600">Click to read</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8" ref={contentRef}>
        {Object.values(groupedAyahs).map(({ surah, ayahs }) => (
          <div key={surah.number} className="mb-12">
            <div className="bg-white rounded-xl p-6 mb-6 shadow-lg">
              <div className="text-center">
                <div className="inline-flex items-center space-x-4 bg-islamic-green/10 px-6 py-3 rounded-full">
                  <BookOpen className="w-5 h-5 text-islamic-green" />
                  <h2 className="text-xl font-semibold text-islamic-dark">
                    Surah {surah.englishName} ({surah.name})
                  </h2>
                  <span className="text-sm text-gray-600">#{surah.number}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="space-y-8">
                {ayahs.map((ayah: any) => (
                  <div key={ayah.number} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="arabic-text text-3xl leading-loose mb-4 text-right" dir="rtl">
                      {ayah.text}
                      <span className="inline-block mr-3 text-islamic-green font-bold">
                        ﴿{ayah.numberInSurah}﴾
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>Ayah {ayah.numberInSurah}</span>
                        <span>•</span>
                        <span>Juz {ayah.juz}</span>
                        {ayah.page && (
                          <>
                            <span>•</span>
                            <span>Page {ayah.page}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
