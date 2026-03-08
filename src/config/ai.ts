import type { TranslationRequest, TranslationResponse, Language, AIProviderConfig } from '../types'

export const getSystemPrompt = (targetLang: Language): string => {
  return `Translate the following text into ${targetLang.code}. Output absolutely nothing except the raw translation—no titles, no quotes, no notes, no punctuation around it:\n\n`
}

export const createTranslationRequest = (
  provider: AIProviderConfig,
  text: string,
  targetLang: Language
): TranslationRequest => {
  return {
    model: provider.modelId,
    messages: [
      {
        role: 'user',
        content: getSystemPrompt(targetLang) + text,
      },
    ],
    temperature: 0.5,
    max_tokens: 1000,
  }
}

export const translate = async (
  provider: AIProviderConfig,
  text: string,
  targetLang: Language
): Promise<string> => {
  if (!text.trim()) return ''
  if (!provider.apiKey) {
    throw new Error('API key not configured')
  }

  const request = createTranslationRequest(provider, text, targetLang)

  const response = await fetch(provider.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API Error ${response.status}: ${errorText}`)
  }

  const data = (await response.json()) as TranslationResponse
  return data.choices?.[0]?.message?.content ?? ''
}
