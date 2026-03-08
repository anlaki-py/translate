import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Edit2, Check, Globe, Bot, Save } from 'lucide-react'
import { Modal, IconButton } from './ui'
import type { AIProviderConfig, Language } from '../types'

interface SettingsModalProps {
  show: boolean
  onClose: () => void
  onProviderChange: (provider: AIProviderConfig) => void
  onLanguageChange: () => void
}

type Tab = 'providers' | 'languages'

interface ProviderFormData {
  name: string
  apiUrl: string
  modelId: string
  apiKey: string
}

const emptyProviderForm: ProviderFormData = {
  name: '',
  apiUrl: '',
  modelId: '',
  apiKey: '',
}

export default function SettingsModal({ show, onClose, onProviderChange, onLanguageChange }: SettingsModalProps) {
  const [tab, setTab] = useState<Tab>('providers')
  const [providers, setProviders] = useState<AIProviderConfig[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [selectedProviderId, setSelectedProviderId] = useState('')
  
  const [editingProvider, setEditingProvider] = useState<AIProviderConfig | null>(null)
  const [providerForm, setProviderForm] = useState<ProviderFormData>(emptyProviderForm)
  const [showProviderForm, setShowProviderForm] = useState(false)
  
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null)
  const [languageForm, setLanguageForm] = useState<Language>({ code: '', name: '', rtl: false })
  const [showLanguageForm, setShowLanguageForm] = useState(false)

  useEffect(() => {
    if (show) {
      loadSettings()
    }
  }, [show])

  const loadSettings = () => {
    const stored = localStorage.getItem('translator-settings')
    if (stored) {
      const settings = JSON.parse(stored)
      setProviders(settings.providers || [])
      setLanguages(settings.languages || [])
      setSelectedProviderId(settings.selectedProviderId || '')
    }
  }

  const saveToStorage = (newProviders: AIProviderConfig[], newLanguages: Language[]) => {
    const stored = localStorage.getItem('translator-settings')
    const current = stored ? JSON.parse(stored) : {}
    const updated = { 
      ...current, 
      providers: newProviders, 
      languages: newLanguages,
      selectedProviderId: selectedProviderId || newProviders[0]?.id
    }
    localStorage.setItem('translator-settings', JSON.stringify(updated))
  }

  const handleSaveProvider = () => {
    let newProviders: AIProviderConfig[]
    if (editingProvider) {
      newProviders = providers.map(p => p.id === editingProvider.id ? { ...providerForm, id: editingProvider.id } : p)
    } else {
      const newProvider: AIProviderConfig = {
        ...providerForm,
        id: `custom-${Date.now()}`,
      }
      newProviders = [...providers, newProvider]
    }
    setProviders(newProviders)
    saveToStorage(newProviders, languages)
    setShowProviderForm(false)
    setEditingProvider(null)
    setProviderForm(emptyProviderForm)
  }

  const handleDeleteProvider = (id: string) => {
    const newProviders = providers.filter(p => p.id !== id)
    setProviders(newProviders)
    saveToStorage(newProviders, languages)
    if (selectedProviderId === id && newProviders.length > 0) {
      handleSelectProvider(newProviders[0].id)
    }
  }

  const handleSelectProvider = (id: string) => {
    setSelectedProviderId(id)
    const stored = localStorage.getItem('translator-settings')
    const current = stored ? JSON.parse(stored) : {}
    localStorage.setItem('translator-settings', JSON.stringify({ ...current, selectedProviderId: id }))
    const provider = providers.find(p => p.id === id)
    if (provider) {
      onProviderChange(provider)
    }
  }

  const handleSaveLanguage = () => {
    let newLanguages: Language[]
    if (editingLanguage) {
      newLanguages = languages.map(l => l.code === editingLanguage.code ? languageForm : l)
    } else {
      newLanguages = [...languages, languageForm]
    }
    setLanguages(newLanguages)
    saveToStorage(providers, newLanguages)
    setShowLanguageForm(false)
    setEditingLanguage(null)
    setLanguageForm({ code: '', name: '', rtl: false })
    onLanguageChange()
  }

  const handleDeleteLanguage = (code: string) => {
    const newLanguages = languages.filter(l => l.code !== code)
    setLanguages(newLanguages)
    saveToStorage(providers, newLanguages)
    onLanguageChange()
  }

  const startEditProvider = (provider: AIProviderConfig) => {
    setEditingProvider(provider)
    setProviderForm({
      name: provider.name,
      apiUrl: provider.apiUrl,
      modelId: provider.modelId,
      apiKey: provider.apiKey,
    })
    setShowProviderForm(true)
  }

  const startEditLanguage = (language: Language) => {
    setEditingLanguage(language)
    setLanguageForm({ ...language, rtl: language.rtl ?? false })
    setShowLanguageForm(true)
  }

  return (
    <Modal show={show} onClose={onClose} width="w-[90%] max-w-[400px]" maxHeight="max-h-[80vh]">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex gap-4">
          <button
            onClick={() => setTab('providers')}
            className={`flex items-center gap-2 text-[14px] font-sans font-semibold transition-colors ${tab === 'providers' ? 'text-accent' : 'text-textSecondary'}`}
          >
            <Bot size={16} />
            Models
          </button>
          <button
            onClick={() => setTab('languages')}
            className={`flex items-center gap-2 text-[14px] font-sans font-semibold transition-colors ${tab === 'languages' ? 'text-accent' : 'text-textSecondary'}`}
          >
            <Globe size={16} />
            Languages
          </button>
        </div>
        <IconButton icon={<X size={20} />} onClick={onClose} size="sm" enableHaptic={false} />
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {tab === 'providers' && (
          <div className="space-y-2">
            {providers.map(provider => (
              <div key={provider.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex-1" onClick={() => handleSelectProvider(provider.id)}>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-sans text-white">{provider.name}</span>
                    {selectedProviderId === provider.id && <Check size={14} className="text-accent" />}
                  </div>
                  <div className="text-[12px] text-textSecondary font-sans">{provider.modelId}</div>
                </div>
                <div className="flex gap-1">
                  <IconButton icon={<Edit2 size={14} />} onClick={() => startEditProvider(provider)} size="sm" />
                  {!provider.isDefault && (
                    <IconButton icon={<Trash2 size={14} />} onClick={() => handleDeleteProvider(provider.id)} size="sm" />
                  )}
                </div>
              </div>
            ))}

            {showProviderForm ? (
              <div className="p-3 rounded-xl bg-white/5 space-y-3">
                <input
                  type="text"
                  placeholder="Name (e.g., My Provider)"
                  value={providerForm.name}
                  onChange={e => setProviderForm({ ...providerForm, name: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-[14px] text-white placeholder-textSecondary/50"
                />
                <input
                  type="text"
                  placeholder="API URL"
                  value={providerForm.apiUrl}
                  onChange={e => setProviderForm({ ...providerForm, apiUrl: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-[14px] text-white placeholder-textSecondary/50"
                />
                <input
                  type="text"
                  placeholder="Model ID"
                  value={providerForm.modelId}
                  onChange={e => setProviderForm({ ...providerForm, modelId: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-[14px] text-white placeholder-textSecondary/50"
                />
                <input
                  type="text"
                  placeholder="API Key"
                  value={providerForm.apiKey}
                  onChange={e => setProviderForm({ ...providerForm, apiKey: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-[14px] text-white placeholder-textSecondary/50"
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveProvider} className="flex-1 flex items-center justify-center gap-2 bg-accent text-white py-2 rounded-lg text-[14px] font-sans font-semibold">
                    <Save size={14} /> Save
                  </button>
                  <button onClick={() => { setShowProviderForm(false); setEditingProvider(null); setProviderForm(emptyProviderForm) }} className="px-4 py-2 text-textSecondary">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setShowProviderForm(true); setEditingProvider(null); setProviderForm(emptyProviderForm) }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/20 text-textSecondary hover:text-white hover:border-white/40 transition-colors"
              >
                <Plus size={16} /> Add Provider
              </button>
            )}
          </div>
        )}

        {tab === 'languages' && (
          <div className="space-y-2">
            {languages.map(language => (
              <div key={language.code} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-sans text-white">{language.name}</span>
                  {language.rtl && <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent font-sans">RTL</span>}
                </div>
                <div className="flex gap-1">
                  <IconButton icon={<Edit2 size={14} />} onClick={() => startEditLanguage(language)} size="sm" />
                  <IconButton icon={<Trash2 size={14} />} onClick={() => handleDeleteLanguage(language.code)} size="sm" />
                </div>
              </div>
            ))}

          {showLanguageForm ? (
            <div className="p-3 rounded-xl bg-white/5 space-y-3">
              <input
                type="text"
                placeholder="Code (e.g., Spanish)"
                value={languageForm.code}
                onChange={e => setLanguageForm({ ...languageForm, code: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-[14px] text-white placeholder-textSecondary/50"
              />
              <input
                type="text"
                placeholder="Name (e.g., Spanish)"
                value={languageForm.name}
                onChange={e => setLanguageForm({ ...languageForm, name: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-[14px] text-white placeholder-textSecondary/50"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={languageForm.rtl ?? false}
                  onChange={e => setLanguageForm({ ...languageForm, rtl: e.target.checked })}
                  className="w-4 h-4 rounded accent-accent"
                />
                <span className="text-[14px] text-white font-sans">Right-to-left (RTL)</span>
              </label>
              <div className="flex gap-2">
                <button onClick={handleSaveLanguage} className="flex-1 flex items-center justify-center gap-2 bg-accent text-white py-2 rounded-lg text-[14px] font-sans font-semibold">
                  <Save size={14} /> Save
                </button>
                <button onClick={() => { setShowLanguageForm(false); setEditingLanguage(null); setLanguageForm({ code: '', name: '', rtl: false }) }} className="px-4 py-2 text-textSecondary">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setShowLanguageForm(true); setEditingLanguage(null); setLanguageForm({ code: '', name: '', rtl: false }) }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/20 text-textSecondary hover:text-white hover:border-white/40 transition-colors"
            >
              <Plus size={16} /> Add Language
            </button>
          )}
          </div>
        )}
      </div>
    </Modal>
  )
}
