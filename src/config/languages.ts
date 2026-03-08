import type { Language } from '../types'

export const RTL_LANGS: string[] = [
  'Arabic MSA',
  'Arabic',
  'Darija (Arabic script)',
  'ar',
  'he',
  'fa',
  'ur',
]

export const LANGUAGES: Language[] = [
  { code: 'Arabic MSA', name: 'Arabic MSA', rtl: true },
  { code: 'Darija (Arabic script)', name: 'Darija (Arabic)', rtl: true },
  { code: 'Darija (Latin script)', name: 'Darija (Latin)' },
  { code: 'English', name: 'English' },
  { code: 'Old English', name: 'Old English' },
  { code: 'Gen-Z Slang', name: 'Gen-Z Slang' },
  { code: 'Gen-Alpha Slang', name: 'Gen-Alpha Slang' },
  { code: 'French', name: 'French' },
  { code: 'Russian', name: 'Russian' },
  { code: 'Chinese', name: 'Chinese' },
  { code: 'Japanese Hiragana', name: 'Japanese Hiragana' },
]

export const DEFAULT_LANGUAGE = LANGUAGES[0]

export const getLangDir = (lang: Language): 'rtl' | 'ltr' => {
  return lang.rtl ? 'rtl' : 'ltr'
}
