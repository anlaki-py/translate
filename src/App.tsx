import { useState, useEffect, useRef } from 'react'
import { Undo2, Redo2, X, Copy, Settings } from 'lucide-react'
import Typewriter from './components/Typewriter'
import ThinkingState from './components/ThinkingState'
import LanguageModal from './components/LanguageModal'
import SettingsModal from './components/SettingsModal'
import { IconButton } from './components/ui'
import { getLangDir } from './config'
import { translate } from './config/ai'
import { getActiveLanguages, getActiveLanguage, getActiveProvider } from './utils/storage'
import type { Language, HistoryEntry, AIProviderConfig } from './types'

const RTL_REGEX = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/

const getDir = (text: string): 'rtl' | 'ltr' => RTL_REGEX.test(text) ? 'rtl' : 'ltr'

export default function App() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [selectedLang, setSelectedLang] = useState<Language>(getActiveLanguage())
  const [languages, setLanguages] = useState<Language[]>(getActiveLanguages())
  const [activeProvider, setActiveProvider] = useState<AIProviderConfig>(getActiveProvider())
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const inputSectionRef = useRef<HTMLDivElement>(null)
  const outputSectionRef = useRef<HTMLDivElement>(null)
  const inputTextAreaRef = useRef<HTMLTextAreaElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const dragStartY = useRef(0)
  const startHeights = useRef({ input: 0, output: 0 })
  const containerHeightRef = useRef(0)
  const hasSnappedRef = useRef(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const performTranslation = async (text: string, targetLang: Language) => {
    if (!text.trim()) {
      setOutput('')
      return
    }

    setIsLoading(true)
    try {
      const result = await translate(activeProvider, text, targetLang)
      setOutput(result)
      setHistory((prev) => {
        const next = prev.slice(0, historyIndex + 1)
        next.push({ input: text, output: result, lang: targetLang })
        return next
      })
      setHistoryIndex((i) => i + 1)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error(err)
      setOutput(`Error: ${message}`)
    } finally {
      setIsLoading(false)
      navigator.vibrate?.(10)
    }
  }

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    if (!input.trim()) {
      setOutput('')
      return
    }

    const cur = history[historyIndex]
    if (cur?.input === input && cur?.output === output && cur?.lang.code === selectedLang.code) return

    debounceTimer.current = setTimeout(() => {
      performTranslation(input, selectedLang)
    }, 800)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [input, selectedLang, activeProvider])

  const goBack = () => {
    if (historyIndex <= 0) return
    const entry = history[historyIndex - 1]
    setHistoryIndex(historyIndex - 1)
    setInput(entry.input)
    setOutput(entry.output)
    setSelectedLang(entry.lang)
  }

  const goForward = () => {
    if (historyIndex >= history.length - 1) return
    const entry = history[historyIndex + 1]
    setHistoryIndex(historyIndex + 1)
    setInput(entry.input)
    setOutput(entry.output)
    setSelectedLang(entry.lang)
  }

  const onTouchStartResize = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY
    const inRect = inputSectionRef.current?.getBoundingClientRect()
    const outRect = outputSectionRef.current?.getBoundingClientRect()
    startHeights.current = { input: inRect?.height ?? 0, output: outRect?.height ?? 0 }
    containerHeightRef.current = mainContentRef.current?.getBoundingClientRect().height ?? 0
    hasSnappedRef.current = false
  }

  const onTouchMoveResize = (e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - dragStartY.current
    const newInputH = Math.max(100, startHeights.current.input + deltaY)
    const newOutputH = Math.max(120, startHeights.current.output - deltaY)
    const midPoint = containerHeightRef.current / 2

    if (Math.abs(newInputH - midPoint) < 25) {
      if (!hasSnappedRef.current) {
        navigator.vibrate?.(15)
        hasSnappedRef.current = true
      }
      if (inputSectionRef.current) inputSectionRef.current.style.flex = '0 0 50%'
      if (outputSectionRef.current) outputSectionRef.current.style.flex = '0 0 50%'
    } else {
      hasSnappedRef.current = false
      if (inputSectionRef.current) inputSectionRef.current.style.flex = `0 0 ${newInputH}px`
      if (outputSectionRef.current) outputSectionRef.current.style.flex = `0 0 ${newOutputH}px`
    }
  }

  const handleSelectLang = (lang: Language) => {
    setSelectedLang(lang)
    setShowModal(false)
  }

  const handleProviderChange = (provider: AIProviderConfig) => {
    setActiveProvider(provider)
  }

  const handleLanguageChange = () => {
    const newLanguages = getActiveLanguages()
    const newActiveLang = getActiveLanguage()
    setLanguages(newLanguages)
    setSelectedLang(newActiveLang)
  }

  return (
    <div className="flex flex-col h-screen max-h-[100dvh] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] relative overflow-hidden font-mono text-white">

      <div
        ref={mainContentRef}
      className={`glass-edge flex-1 flex flex-col rounded-[32px] overflow-hidden transition-all duration-300 mx-0 my-3 relative z-10 ${
        showModal || showSettings ? 'opacity-50 scale-95 pointer-events-none' : ''
      }`}
        style={{
          maskImage: 'radial-gradient(white, black)',
          WebkitMaskImage: '-webkit-radial-gradient(white, black)',
        }}
      >

        <div
          ref={inputSectionRef}
          className="flex-1 min-h-[100px] bg-input relative transition-colors focus-within:bg-[#222224]"
        >
          <textarea
            ref={inputTextAreaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text…"
            className="w-full h-full bg-transparent border-none outline-none text-[21px] p-6 pb-[100px] resize-none text-white placeholder-textSecondary/60 mask-input font-mono leading-relaxed"
            style={{
              direction: getDir(input),
              textAlign: getDir(input) === 'rtl' ? 'right' : 'left',
            }}
          />

          <div className="absolute left-6 right-6 bottom-5 flex justify-between items-center z-10 pointer-events-none">
            <div className="flex gap-3 pointer-events-auto">
              <IconButton icon={<Undo2 />} onClick={goBack} />
              <IconButton icon={<Redo2 />} onClick={goForward} />
            </div>

            <div className="flex gap-3 pointer-events-auto">
              <IconButton 
                icon={<X />} 
                onClick={() => { setInput(''); setOutput(''); inputTextAreaRef.current?.focus() }} 
              />
              <IconButton 
                icon={<Copy />} 
                onClick={() => navigator.clipboard.writeText(input)} 
              />
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-white/5 relative z-20 flex-shrink-0">
          <div
            className="absolute -top-4 -bottom-4 left-0 right-0 z-30 flex items-center justify-center cursor-row-resize active:scale-y-110"
            onTouchStart={onTouchStartResize}
            onTouchMove={onTouchMoveResize}
          >
            <div className="w-10 h-1 bg-[#3a3a3c] rounded-full shadow-sm transition-all active:bg-accent active:w-12 active:h-[5px]" />
          </div>
        </div>

        <div
          ref={outputSectionRef}
          className="flex-1 min-h-[100px] bg-output relative transition-colors font-sans"
        >
          <div
            className="w-full h-full p-6 pt-6 pb-[100px] text-[22px] leading-relaxed overflow-y-auto whitespace-pre-wrap break-words mask-output"
            style={{
              direction: getLangDir(selectedLang),
              textAlign: getLangDir(selectedLang) === 'rtl' ? 'right' : 'left',
            }}
            onDoubleClick={() => { if (output && !isLoading) { setInput(output) } }}
          >
            {isLoading ? <ThinkingState /> : <Typewriter text={output} />}
          </div>
        </div>

        <div className="absolute bottom-5 left-0 right-0 h-[54px] flex items-center justify-center z-50 pointer-events-none">
          <button
            onClick={() => setShowModal(true)}
            className="pointer-events-auto relative glass-edge h-[54px] px-8 rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-transform z-10 min-w-[180px]"
          >
            <span className="text-[16px] font-sans font-semibold tracking-wide text-white">
              {selectedLang.name}
            </span>
          </button>

          <div className="absolute left-6 flex gap-3 pointer-events-auto">
            <IconButton 
              icon={<Settings />} 
              onClick={() => setShowSettings(true)} 
              floating 
            />
          </div>

          <IconButton 
            icon={<Copy />} 
            onClick={async () => { if (output) await navigator.clipboard.writeText(output) }} 
            floating 
            className="absolute right-6 pointer-events-auto"
          />
        </div>

      </div>

      <LanguageModal
        languages={languages}
        selectedLang={selectedLang}
        show={showModal}
        onSelect={handleSelectLang}
        onClose={() => setShowModal(false)}
      />

      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        onProviderChange={handleProviderChange}
        onLanguageChange={handleLanguageChange}
      />

    </div>
  )
}
