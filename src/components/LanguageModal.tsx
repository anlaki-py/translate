import { memo } from 'react'
import { Check } from 'lucide-react'
import { Modal } from './ui'
import type { Language } from '../types'

interface LanguageModalProps {
  languages: Language[]
  selectedLang: Language
  show: boolean
  onSelect: (lang: Language) => void
  onClose: () => void
}

function LanguageModal({ languages, selectedLang, show, onSelect, onClose }: LanguageModalProps) {
  return (
    <Modal show={show} onClose={onClose}>
      <div className="p-4 text-center font-sans font-semibold text-[13px] text-textSecondary uppercase tracking-widest border-b border-white/5">
        Select Language
      </div>

      <div className="flex-1 overflow-y-auto p-2 font-sans">
        {languages.map((lang) => {
          const active = selectedLang.code === lang.code
          return (
            <div
              key={lang.code}
              onClick={() => onSelect(lang)}
              className={`p-3.5 px-4 mb-1 rounded-xl text-[16px] flex justify-between items-center cursor-pointer transition-colors active:bg-white/10 ${
                active ? 'bg-accent/15 text-accent font-semibold' : 'text-white'
              }`}
            >
              <span>{lang.name}</span>
              {active && <Check size={18} className="text-accent" />}
            </div>
          )
        })}
      </div>
    </Modal>
  )
}

export default memo(LanguageModal)
