import type { Settings, Language, AIProviderConfig } from '../types'

const STORAGE_KEY = 'translator-settings'

const DEFAULT_PROVIDERS: AIProviderConfig[] = [
  {
    id: 'vercel',
    name: 'Vercel AI Gateway',
    apiUrl: 'https://ai-gateway.vercel.sh/v1/chat/completions',
    modelId: 'meituan/longcat-flash-chat',
    apiKey: import.meta.env.VITE_AI_GATEWAY_API_KEY ?? '',
    isDefault: true,
  },
]

const DEFAULT_LANGUAGES: Language[] = [
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

function getStoredSettings(): Settings | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored) as Settings
  } catch {
    return null
  }
}

function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function getSettings(): Settings {
  const stored = getStoredSettings()
  if (stored) return stored

  const defaultSettings: Settings = {
    providers: DEFAULT_PROVIDERS,
    languages: DEFAULT_LANGUAGES,
    selectedProviderId: DEFAULT_PROVIDERS[0].id,
    selectedLanguageCode: DEFAULT_LANGUAGES[0].code,
  }
  saveSettings(defaultSettings)
  return defaultSettings
}

export function saveProviders(providers: AIProviderConfig[]): void {
  const current = getSettings()
  saveSettings({ ...current, providers })
}

export function saveLanguages(languages: Language[]): void {
  const current = getSettings()
  saveSettings({ ...current, languages })
}

export function saveSelectedProvider(providerId: string): void {
  const current = getSettings()
  saveSettings({ ...current, selectedProviderId: providerId })
}

export function saveSelectedLanguage(languageCode: string): void {
  const current = getSettings()
  saveSettings({ ...current, selectedLanguageCode: languageCode })
}

export function getActiveProvider(): AIProviderConfig {
  const settings = getSettings()
  return settings.providers.find(p => p.id === settings.selectedProviderId) 
    ?? settings.providers[0]
}

export function getActiveLanguages(): Language[] {
  const settings = getSettings()
  return settings.languages.length > 0 ? settings.languages : DEFAULT_LANGUAGES
}

export function getActiveLanguage(): Language {
  const settings = getSettings()
  const languages = getActiveLanguages()
  return languages.find(l => l.code === settings.selectedLanguageCode) ?? languages[0]
}

export { DEFAULT_PROVIDERS, DEFAULT_LANGUAGES }
