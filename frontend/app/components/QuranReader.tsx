'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import axios from 'axios'
import { API_URL } from '../config/api'

// Complete list of 114 Surahs with Arabic names
const SURAH_NAMES: Record<number, string> = {
  1: 'الفاتحة', 2: 'البقرة', 3: 'آل عمران', 4: 'النساء', 5: 'المائدة', 6: 'الأنعام', 7: 'الأعراف', 8: 'الأنفال', 9: 'التوبة', 10: 'يونس',
  11: 'هود', 12: 'يوسف', 13: 'الرعد', 14: 'إبراهيم', 15: 'الحجر', 16: 'النحل', 17: 'الإسراء', 18: 'الكهف', 19: 'مريم', 20: 'طه',
  21: 'الأنبياء', 22: 'الحج', 23: 'المؤمنون', 24: 'النور', 25: 'الفرقان', 26: 'الشعراء', 27: 'النمل', 28: 'القصص', 29: 'العنكبوت', 30: 'الروم',
  31: 'لقمان', 32: 'السجدة', 33: 'الأحزاب', 34: 'سبأ', 35: 'فاطر', 36: 'يس', 37: 'الصافات', 38: 'ص', 39: 'الزمر', 40: 'غافر',
  41: 'فصلت', 42: 'الشورى', 43: 'الزخرف', 44: 'الدخان', 45: 'الجاثية', 46: 'الأحقاف', 47: 'محمد', 48: 'الفتح', 49: 'الحجرات', 50: 'ق',
  51: 'الذاريات', 52: 'الطور', 53: 'النجم', 54: 'القمر', 55: 'الرحمن', 56: 'الواقعة', 57: 'الحديد', 58: 'المجادلة', 59: 'الحشر', 60: 'الممتحنة',
  61: 'الصف', 62: 'الجمعة', 63: 'المنافقون', 64: 'التغابن', 65: 'الطلاق', 66: 'التحريم', 67: 'الملك', 68: 'القلم', 69: 'الحاقة', 70: 'المعارج',
  71: 'نوح', 72: 'الجن', 73: 'المزمل', 74: 'المدثر', 75: 'القيامة', 76: 'الإنسان', 77: 'المرسلات', 78: 'النبأ', 79: 'النازعات', 80: 'عبس',
  81: 'التكوير', 82: 'الانفطار', 83: 'المطففين', 84: 'الانشقاق', 85: 'البروج', 86: 'الطارق', 87: 'الأعلى', 88: 'الغاشية', 89: 'الفجر', 90: 'البلد',
  91: 'الشمس', 92: 'الليل', 93: 'الضحى', 94: 'الشرح', 95: 'التين', 96: 'العلق', 97: 'القدر', 98: 'البينة', 99: 'الزلزلة', 100: 'العاديات',
  101: 'القارعة', 102: 'التكاثر', 103: 'العصر', 104: 'الهمزة', 105: 'الفيل', 106: 'قريش', 107: 'الماعون', 108: 'الكوثر', 109: 'الكافرون', 110: 'النصر',
  111: 'المسد', 112: 'الإخلاص', 113: 'الفلق', 114: 'الناس'
}

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

  useEffect(() => {
    const savedPosition = localStorage.getItem(`quran_position_${currentJuz}`)
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition))
      }, 100)
    }
  }, [currentJuz, ayahs.length])

  useEffect(() => {
    const handleScroll = () => {
      if (viewMode === 'juz') {
        localStorage.setItem(`quran_position_${currentJuz}`, window.scrollY.toString())
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentJuz, viewMode])

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
        response = await axios.get(`${API_URL}/quran/juz/${currentJuz}`)
      } else if (viewMode === 'surah') {
        response = await axios.get(`${API_URL}/quran/surah/${currentSurah}`)
      } else {
        response = await axios.get(`${API_URL}/quran/page/${currentPage}`)
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
        `${API_URL}/progress`,
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
    const surah = ayah.surah || ayah.surahNumber || { number: ayah.surahNumber || 1, englishName: 'Surah', name: '' }
    const surahNumber = surah.number || ayah.surahNumber || 1
    
    if (!acc[surahNumber]) {
      acc[surahNumber] = {
        surah: surah,
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
    <div className="min-h-screen bg-gradient-to-br from-islamic-green/5 to-islamic-dark/5 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <ArrowLeft className="w-6 h-6 dark:text-white" />
              </button>
              <div>
                <h1 className="text-xl font-semibold dark:text-white">
                  {viewMode === 'juz' && `Juz ${currentJuz}`}
                  {viewMode === 'surah' && `Surah ${currentSurah}`}
                  {viewMode === 'page' && `Page ${currentPage}`}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{ayahs.length} Ayahs</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-islamic-green focus:border-transparent"
              >
                <option value="juz">By Juz</option>
                <option value="surah">By Surah</option>
                <option value="page">By Page</option>
              </select>

              {viewMode === 'juz' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      localStorage.setItem(`quran_position_${currentJuz}`, window.scrollY.toString())
                      const newJuz = Math.max(1, currentJuz - 1)
                      setCurrentJuz(newJuz)
                      onJuzChange?.(newJuz)
                    }}
                    disabled={currentJuz === 1}
                    className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                  <span className="px-3 py-1 bg-islamic-green text-white rounded">{currentJuz}</span>
                  <button
                    onClick={() => {
                      localStorage.setItem(`quran_position_${currentJuz}`, window.scrollY.toString())
                      const newJuz = Math.min(30, currentJuz + 1)
                      setCurrentJuz(newJuz)
                      onJuzChange?.(newJuz)
                    }}
                    disabled={currentJuz === 30}
                    className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
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
                    className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                  <span className="px-3 py-1 bg-islamic-green text-white rounded">{currentPage}</span>
                  <button
                    onClick={() => setCurrentPage(Math.min(604, currentPage + 1))}
                    disabled={currentPage === 604}
                    className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
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
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold dark:text-white">Select Surah</h2>
              <button onClick={() => setShowSurahList(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
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
                  className="p-3 text-left border dark:border-gray-700 rounded-lg hover:bg-islamic-green/10 hover:border-islamic-green transition-colors"
                >
                  <div className="font-semibold">
                    <span className="arabic-text dark:text-white" style={{fontSize: '1.25rem'}}>{SURAH_NAMES[num]}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Surah {num}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8" ref={contentRef}>
        {Object.values(groupedAyahs).map(({ surah, ayahs }) => (
          <div key={surah.number} className="mb-12">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-6 shadow-lg">
              <div className="text-center">
                <div className="inline-flex items-center space-x-4 bg-islamic-green/10 dark:bg-islamic-green/20 px-6 py-3 rounded-full">
                  <BookOpen className="w-5 h-5 text-islamic-green" />
                  <h2 className="text-xl font-semibold text-islamic-dark dark:text-white">
                    Surah {surah.englishName} ({surah.name})
                  </h2>
                  <span className="text-sm text-gray-600 dark:text-gray-400">#{surah.number}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg">
              {ayahs[0]?.numberInSurah === 1 && surah.number !== 1 && surah.number !== 9 && (
                <div className="text-center mb-6">
                  <div className="arabic-text text-xl leading-relaxed text-islamic-green" dir="rtl">
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                  </div>
                </div>
              )}
              <div className="arabic-text text-xl leading-relaxed text-right text-gray-900 dark:text-gray-100" dir="rtl">
                {ayahs.map((ayah: any, index: number) => {
                  const shouldSkipNumber = surah.number !== 1 && index === 0 && ayah.text.startsWith('بِسْمِ اللَّهِ')
                  const ayahText = shouldSkipNumber 
                    ? ayah.text.replace(/^بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\s*/, '')
                    : ayah.text
                  
                  if (!ayahText) return null
                  
                  return (
                    <span key={ayah.number}>
                      {ayahText}{' '}
                      <span className="text-islamic-green font-bold">
                        ﴿{ayah.numberInSurah}﴾
                      </span>{' '}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
