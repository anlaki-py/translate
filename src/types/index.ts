export interface Language {
  code: string
  name: string
  rtl?: boolean
}

export interface HistoryEntry {
  input: string
  output: string
  lang: Language
}

export interface TranslationRequest {
  model: string
  messages: Array<{
    role: string
    content: string
  }>
  temperature: number
  max_tokens: number
}

export interface TranslationResponse {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

export interface AIProviderConfig {
  id: string
  name: string
  apiUrl: string
  modelId: string
  apiKey: string
  isDefault?: boolean
}

export interface Settings {
  providers: AIProviderConfig[]
  languages: Language[]
  selectedProviderId: string
  selectedLanguageCode: string
}

export const DEFAULT_SETTINGS: Settings = {
  providers: [],
  languages: [],
  selectedProviderId: '',
  selectedLanguageCode: '',
}
