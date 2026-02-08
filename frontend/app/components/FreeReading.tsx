'use client'

import { useState, useEffect } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, Search, Play, Home } from 'lucide-react'
import { API_URL } from '../config/api'

interface FreeReadingProps {
  onBack: () => void
}

export default function FreeReading({ onBack }: FreeReadingProps) {
  const [searchMode, setSearchMode] = useState<'juz' | 'surah' | 'page'>('juz')
  const [juzNumber, setJuzNumber] = useState(1)
  const [surahNumber, setSurahNumber] = useState(1)
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(false)
  const [currentData, setCurrentData] = useState<any>(null)
  const [ayahs, setAyahs] = useState<any[]>([])

  // Fetch initial data on mount
  useEffect(() => {
    if (searchMode === 'juz') {
      fetchByJuz(1)
    } else if (searchMode === 'surah') {
      fetchBySurah(1)
    } else if (searchMode === 'page') {
      fetchByPage(1)
    }
  }, [])

  // Surah names in Arabic and English
  const surahNames = [
    { number: 1, name: 'الفاتحة', englishName: 'Al-Fatihah', englishNameTranslation: 'The Opening' },
    { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', englishNameTranslation: 'The Cow' },
    { number: 3, name: 'آل عمران', englishName: 'Al-Imran', englishNameTranslation: 'The Family of Imran' },
    { number: 4, name: 'النساء', englishName: 'An-Nisa', englishNameTranslation: 'The Women' },
    { number: 5, name: 'المائدة', englishName: 'Al-Maidah', englishNameTranslation: 'The Table Spread' },
    { number: 6, name: 'الأنعام', englishName: 'Al-Anam', englishNameTranslation: 'The Cattle' },
    { number: 7, name: 'الأعراف', englishName: 'Al-Araf', englishNameTranslation: 'The Heights' },
    { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', englishNameTranslation: 'The Spoils of War' },
    { number: 9, name: 'التوبة', englishName: 'At-Tawbah', englishNameTranslation: 'The Repentance' },
    { number: 10, name: 'يونس', englishName: 'Yunus', englishNameTranslation: 'Jonah' },
    { number: 11, name: 'هود', englishName: 'Hud', englishNameTranslation: 'Hud' },
    { number: 12, name: 'يوسف', englishName: 'Yusuf', englishNameTranslation: 'Joseph' },
    { number: 13, name: 'الرعد', englishName: 'Ar-Rad', englishNameTranslation: 'The Thunder' },
    { number: 14, name: 'ابراهيم', englishName: 'Ibrahim', englishNameTranslation: 'Abraham' },
    { number: 15, name: 'الحجر', englishName: 'Al-Hijr', englishNameTranslation: 'The Rocky Tract' },
    { number: 16, name: 'النحل', englishName: 'An-Nahl', englishNameTranslation: 'The Bee' },
    { number: 17, name: 'الإسراء', englishName: 'Al-Isra', englishNameTranslation: 'The Night Journey' },
    { number: 18, name: 'الكهف', englishName: 'Al-Kahf', englishNameTranslation: 'The Cave' },
    { number: 19, name: 'مريم', englishName: 'Maryam', englishNameTranslation: 'Mary' },
    { number: 20, name: 'طه', englishName: 'Ta-Ha', englishNameTranslation: 'Ta-Ha' },
    { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiya', englishNameTranslation: 'The Prophets' },
    { number: 22, name: 'الحج', englishName: 'Al-Hajj', englishNameTranslation: 'The Pilgrimage' },
    { number: 23, name: 'المؤمنون', englishName: 'Al-Muminun', englishNameTranslation: 'The Believers' },
    { number: 24, name: 'النور', englishName: 'An-Nur', englishNameTranslation: 'The Light' },
    { number: 25, name: 'الفرقان', englishName: 'Al-Furqan', englishNameTranslation: 'The Criterion' },
    { number: 26, name: 'الشعراء', englishName: 'Ash-Shuara', englishNameTranslation: 'The Poets' },
    { number: 27, name: 'النمل', englishName: 'An-Naml', englishNameTranslation: 'The Ant' },
    { number: 28, name: 'القصص', englishName: 'Al-Qasas', englishNameTranslation: 'The Stories' },
    { number: 29, name: 'العنكبوت', englishName: 'Al-Ankabut', englishNameTranslation: 'The Spider' },
    { number: 30, name: 'الروم', englishName: 'Ar-Rum', englishNameTranslation: 'The Romans' },
    { number: 31, name: 'لقمان', englishName: 'Luqman', englishNameTranslation: 'Luqman' },
    { number: 32, name: 'السجدة', englishName: 'As-Sajda', englishNameTranslation: 'The Prostration' },
    { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', englishNameTranslation: 'The Combined Forces' },
    { number: 34, name: 'سبأ', englishName: 'Saba', englishNameTranslation: 'Sheba' },
    { number: 35, name: 'فاطر', englishName: 'Fatir', englishNameTranslation: 'The Originator' },
    { number: 36, name: 'يس', englishName: 'Ya-Sin', englishNameTranslation: 'Ya-Sin' },
    { number: 37, name: 'الصافات', englishName: 'As-Saffat', englishNameTranslation: 'Those who set the Ranks' },
    { number: 38, name: 'ص', englishName: 'Sad', englishNameTranslation: 'Sad' },
    { number: 39, name: 'الزمر', englishName: 'Az-Zumar', englishNameTranslation: 'The Groups' },
    { number: 40, name: 'غافر', englishName: 'Ghafir', englishNameTranslation: 'The Forgiver' },
    { number: 41, name: 'فصلت', englishName: 'Fussilat', englishNameTranslation: 'Explained in Detail' },
    { number: 42, name: 'الشورى', englishName: 'Ash-Shura', englishNameTranslation: 'The Consultation' },
    { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', englishNameTranslation: 'The Ornaments of Gold' },
    { number: 44, name: 'الدخان', englishName: 'Ad-Dukhan', englishNameTranslation: 'The Smoke' },
    { number: 45, name: 'الجاثية', englishName: 'Al-Jathiya', englishNameTranslation: 'The Crouching' },
    { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', englishNameTranslation: 'The Wind-Curved Sand Dunes' },
    { number: 47, name: 'محمد', englishName: 'Muhammad', englishNameTranslation: 'Muhammad' },
    { number: 48, name: 'الفتح', englishName: 'Al-Fath', englishNameTranslation: 'The Victory' },
    { number: 49, name: 'الحجرات', englishName: 'Al-Hujurat', englishNameTranslation: 'The Rooms' },
    { number: 50, name: 'ق', englishName: 'Qaf', englishNameTranslation: 'Qaf' },
    { number: 51, name: 'الذاريات', englishName: 'Az-Zariyat', englishNameTranslation: 'The Winnowing Winds' },
    { number: 52, name: 'الطور', englishName: 'At-Tur', englishNameTranslation: 'The Mount' },
    { number: 53, name: 'النجم', englishName: 'An-Najm', englishNameTranslation: 'The Star' },
    { number: 54, name: 'القمر', englishName: 'Al-Qamar', englishNameTranslation: 'The Moon' },
    { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', englishNameTranslation: 'The Most Merciful' },
    { number: 56, name: 'الواقعة', englishName: 'Al-Waqia', englishNameTranslation: 'The Inevitable' },
    { number: 57, name: 'الحديد', englishName: 'Al-Hadid', englishNameTranslation: 'The Iron' },
    { number: 58, name: 'المجادلة', englishName: 'Al-Mujadila', englishNameTranslation: 'The Pleading Woman' },
    { number: 59, name: 'الحشر', englishName: 'Al-Hashr', englishNameTranslation: 'The Exile' },
    { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahina', englishNameTranslation: 'The Tested' },
    { number: 61, name: 'الصف', englishName: 'As-Saff', englishNameTranslation: 'The Ranks' },
    { number: 62, name: 'الجمعة', englishName: 'Al-Jumua', englishNameTranslation: 'The Congregation' },
    { number: 63, name: 'المنافقون', englishName: 'Al-Munafiqun', englishNameTranslation: 'The Hypocrites' },
    { number: 64, name: 'التغابن', englishName: 'At-Taghabun', englishNameTranslation: 'The Mutual Disillusion' },
    { number: 65, name: 'الطلاق', englishName: 'At-Talaq', englishNameTranslation: 'The Divorce' },
    { number: 66, name: 'التحريم', englishName: 'At-Tahrim', englishNameTranslation: 'The Prohibition' },
    { number: 67, name: 'الملك', englishName: 'Al-Mulk', englishNameTranslation: 'The Sovereignty' },
    { number: 68, name: 'القلم', englishName: 'Al-Qalam', englishNameTranslation: 'The Pen' },
    { number: 69, name: 'الحاقة', englishName: 'Al-Haqqah', englishNameTranslation: 'The Reality' },
    { number: 70, name: 'المعارج', englishName: 'Al-Maarij', englishNameTranslation: 'The Ascending Stairways' },
    { number: 71, name: 'نوح', englishName: 'Nuh', englishNameTranslation: 'Noah' },
    { number: 72, name: 'الجن', englishName: 'Al-Jinn', englishNameTranslation: 'The Jinn' },
    { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', englishNameTranslation: 'The Enshrouded One' },
    { number: 74, name: 'المدثر', englishName: 'Al-Muddaththir', englishNameTranslation: 'The Cloaked One' },
    { number: 75, name: 'القيامة', englishName: 'Al-Qiyamah', englishNameTranslation: 'The Resurrection' },
    { number: 76, name: 'الإنسان', englishName: 'Al-Insan', englishNameTranslation: 'Man' },
    { number: 77, name: 'المرسلات', englishName: 'Al-Mursalat', englishNameTranslation: 'The Emissaries' },
    { number: 78, name: 'النبأ', englishName: 'An-Naba', englishNameTranslation: 'The Tidings' },
    { number: 79, name: 'النازعات', englishName: 'An-Naziat', englishNameTranslation: 'Those who drag forth' },
    { number: 80, name: 'عبس', englishName: 'Abasa', englishNameTranslation: 'He Frowned' },
    { number: 81, name: 'التكوير', englishName: 'At-Takwir', englishNameTranslation: 'The Overthrowing' },
    { number: 82, name: 'الانفطار', englishName: 'Al-Infitar', englishNameTranslation: 'The Cleaving' },
    { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', englishNameTranslation: 'The Defrauders' },
    { number: 84, name: 'الانشقاق', englishName: 'Al-Inshiqaq', englishNameTranslation: 'The Sundering' },
    { number: 85, name: 'البروج', englishName: 'Al-Buruj', englishNameTranslation: 'The Constellations' },
    { number: 86, name: 'الطارق', englishName: 'At-Tariq', englishNameTranslation: 'The Night Visitor' },
    { number: 87, name: 'الأعلى', englishName: 'Al-Ala', englishNameTranslation: 'The Most High' },
    { number: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah', englishNameTranslation: 'The Overwhelming' },
    { number: 89, name: 'الفجر', englishName: 'Al-Fajr', englishNameTranslation: 'The Dawn' },
    { number: 90, name: 'البلد', englishName: 'Al-Balad', englishNameTranslation: 'The City' },
    { number: 91, name: 'الشمس', englishName: 'Ash-Shams', englishNameTranslation: 'The Sun' },
    { number: 92, name: 'الليل', englishName: 'Al-Layl', englishNameTranslation: 'The Night' },
    { number: 93, name: 'الضحى', englishName: 'Ad-Duha', englishNameTranslation: 'The Morning Hours' },
    { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', englishNameTranslation: 'The Relief' },
    { number: 95, name: 'التين', englishName: 'At-Tin', englishNameTranslation: 'The Fig' },
    { number: 96, name: 'العلق', englishName: 'Al-Alaq', englishNameTranslation: 'The Clot' },
    { number: 97, name: 'القدر', englishName: 'Al-Qadr', englishNameTranslation: 'The Night of Decree' },
    { number: 98, name: 'البينة', englishName: 'Al-Bayyina', englishNameTranslation: 'The Clear Proof' },
    { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzala', englishNameTranslation: 'The Earthquake' },
    { number: 100, name: 'العاديات', englishName: 'Al-Adiyat', englishNameTranslation: 'The Courser' },
    { number: 101, name: 'القارعة', englishName: 'Al-Qaria', englishNameTranslation: 'The Calamity' },
    { number: 102, name: 'التكاثر', englishName: 'At-Takathur', englishNameTranslation: 'The Rivalry in Worldly Increase' },
    { number: 103, name: 'العصر', englishName: 'Al-Asr', englishNameTranslation: 'The Time' },
    { number: 104, name: 'الهمزة', englishName: 'Al-Humaza', englishNameTranslation: 'The Gossipmonger' },
    { number: 105, name: 'الفيل', englishName: 'Al-Fil', englishNameTranslation: 'The Elephant' },
    { number: 106, name: 'قريش', englishName: 'Quraysh', englishNameTranslation: 'Quraysh' },
    { number: 107, name: 'الماعون', englishName: 'Al-Maun', englishNameTranslation: 'The Small Kindnesses' },
    { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', englishNameTranslation: 'The Abundance' },
    { number: 109, name: 'الكافرون', englishName: 'Al-Kafirun', englishNameTranslation: 'The Disbelievers' },
    { number: 110, name: 'النصر', englishName: 'An-Nasr', englishNameTranslation: 'The Victory' },
    { number: 111, name: 'المسد', englishName: 'Al-Masad', englishNameTranslation: 'The Palm Fiber' },
    { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', englishNameTranslation: 'The Sincerity' },
    { number: 113, name: 'الفلق', englishName: 'Al-Falaq', englishNameTranslation: 'The Daybreak' },
    { number: 114, name: 'الناس', englishName: 'An-Nas', englishNameTranslation: 'Mankind' },
  ]

  const fetchByJuz = async (juz: number) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/quran/juz/${juz}`)
      const data = await response.json()
      // API returns: { code, status, data: { number, juz, ayahs: [...] } }
      setCurrentData(data.data)
      setAyahs(data.data?.ayahs || [])
      setJuzNumber(juz)
    } catch (error) {
      console.error('Error fetching juz:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBySurah = async (surah: number) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/quran/surah/${surah}`)
      const data = await response.json()
      // API returns: { code, status, data: { number, name, englishName, ayahs: [...] } }
      setCurrentData(data.data)
      setAyahs(data.data?.ayahs || [])
      setSurahNumber(surah)
      setSearchMode('surah')
    } catch (error) {
      console.error('Error fetching surah:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchByPage = async (page: number) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/quran/page/${page}`)
      const data = await response.json()
      // API returns: { code, status, data: { number, ayahs: [...] } }
      setCurrentData(data.data)
      setAyahs(data.data?.ayahs || [])
      setPageNumber(page)
    } catch (error) {
      console.error('Error fetching page:', error)
    } finally {
      setLoading(false)
    }
  }

  const navigateJuz = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && juzNumber > 1) {
      fetchByJuz(juzNumber - 1)
    } else if (direction === 'next' && juzNumber < 30) {
      fetchByJuz(juzNumber + 1)
    }
  }

  const navigatePage = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && pageNumber > 1) {
      fetchByPage(pageNumber - 1)
    } else if (direction === 'next' && pageNumber < 604) {
      fetchByPage(pageNumber + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10 border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-islamic-green dark:hover:text-islamic-green"
            >
              <Home className="w-5 h-5 mr-2" />
              <span>Back</span>
            </button>
            <h1 className="text-xl font-bold text-islamic-dark dark:text-white">Free Reading</h1>
            <div className="w-20"></div>
          </div>

          {/* Search Mode Tabs */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setSearchMode('juz')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                searchMode === 'juz'
                  ? 'bg-islamic-green text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              By Juz
            </button>
            <button
              onClick={() => setSearchMode('surah')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                searchMode === 'surah'
                  ? 'bg-islamic-green text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              By Surah
            </button>
            <button
              onClick={() => setSearchMode('page')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                searchMode === 'page'
                  ? 'bg-islamic-green text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              By Page
            </button>
          </div>

          {/* Search Controls */}
          {searchMode === 'juz' && (
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => navigateJuz('prev')}
                disabled={juzNumber === 1}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-800 dark:text-gray-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-400">Juz</span>
                <input
                  type="number"
                  value={juzNumber}
                  onChange={(e) => setJuzNumber(parseInt(e.target.value) || 1)}
                  min="1"
                  max="30"
                  className="w-16 text-center px-2 py-1 border dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                />
              </div>
              <button
                onClick={() => navigateJuz('next')}
                disabled={juzNumber === 30}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-800 dark:text-gray-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => fetchByJuz(juzNumber)}
                className="px-4 py-2 bg-islamic-green text-white rounded-lg hover:bg-islamic-dark"
              >
                Go
              </button>
            </div>
          )}

          {searchMode === 'surah' && (
            <div className="flex items-center space-x-2">
              <select
                value={surahNumber}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  setSurahNumber(val)
                  fetchBySurah(val)
                }}
                className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              >
                {surahNames.map((surah) => (
                  <option key={surah.number} value={surah.number}>
                    {surah.number}. {surah.name} - {surah.englishName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {searchMode === 'page' && (
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => {
                  if (pageNumber > 1) {
                    setPageNumber(pageNumber - 1)
                    fetchByPage(pageNumber - 1)
                  }
                }}
                disabled={pageNumber === 1}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-800 dark:text-gray-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-400">Page</span>
                <span className="text-lg font-medium text-gray-900 dark:text-white">{pageNumber}</span>
              </div>
              <button
                onClick={() => {
                  if (pageNumber < 604) {
                    setPageNumber(pageNumber + 1)
                    fetchByPage(pageNumber + 1)
                  }
                }}
                disabled={pageNumber === 604}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-800 dark:text-gray-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-islamic-green"></div>
          </div>
        ) : ayahs.length > 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
            {/* Surah Info (if viewing by surah) */}
            {currentData?.name && (
              <div className="text-center mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-3xl font-bold text-islamic-dark dark:text-white mb-2">
                  {currentData.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{currentData.englishName}</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">{currentData.englishNameTranslation}</p>
              </div>
            )}

            {/* Juz Info */}
            {currentData?.juz && (
              <div className="text-center mb-6">
                <span className="inline-block px-4 py-1 bg-islamic-green/10 text-islamic-green rounded-full text-sm font-medium">
                  Juz {currentData.juz}
                </span>
              </div>
            )}

            {ayahs[0]?.numberInSurah === 1 && currentData?.number !== 1 && currentData?.number !== 9 && (
              <div className="text-center mb-6">
                <div className="arabic-text text-2xl leading-loose text-islamic-green" dir="rtl">
                  بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                </div>
              </div>
            )}

            <div className="arabic-text text-2xl leading-loose text-right text-gray-900 dark:text-gray-100" dir="rtl">
              {ayahs.map((ayah: any, index: number) => {
                let ayahText = ayah.text || ''
                ayahText = ayahText.replace(/[﴾۞]\d*[﴿۝]/g, '').replace(/[\s]+$/, '')
                
                if (currentData?.number !== 1 && index === 0 && /^بِسْمِ/.test(ayahText)) {
                  ayahText = ayahText.replace(/^بِسْمِ\s*ٱللَّهِ\s*ٱلرَّحْمَٰنِ\s*ٱلرَّحِيمِ\s*/u, '').trim()
                }
                
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
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Select a Juz, Surah, or Page to start reading</p>
          </div>
        )}
      </div>
    </div>
  )
}
