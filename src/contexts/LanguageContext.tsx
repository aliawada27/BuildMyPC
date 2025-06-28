'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Language = 'fr' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: React.ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('fr')
  const [translations, setTranslations] = useState<Record<string, any>>({})

  useEffect(() => {
    // Charger la langue sauvegardée ou détecter la langue du navigateur
    const savedLanguage = localStorage.getItem('preferred-language') as Language
    const browserLanguage = navigator.language.startsWith('fr') ? 'fr' : 'en'
    const initialLanguage = savedLanguage || browserLanguage
    
    setLanguageState(initialLanguage)
    loadTranslations(initialLanguage)
  }, [])

  const loadTranslations = async (lang: Language) => {
    try {
      const translationModule = await import(`../locales/${lang}.json`)
      setTranslations(translationModule.default)
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error)
      // Fallback vers le français
      if (lang !== 'fr') {
        const fallbackModule = await import(`../locales/fr.json`)
        setTranslations(fallbackModule.default)
      }
    }
  }

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('preferred-language', lang)
    loadTranslations(lang)
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let value = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.warn(`Translation key not found: ${key}`)
        return key // Retourner la clé si traduction non trouvée
      }
    }

    let translation = typeof value === 'string' ? value : key

    // Remplacer les paramètres {{param}}
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(
          new RegExp(`{{${paramKey}}}`, 'g'),
          String(paramValue)
        )
      })
    }

    return translation
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
} 