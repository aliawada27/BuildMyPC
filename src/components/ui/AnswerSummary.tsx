'use client'

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface AnswerSummaryProps {
  answers: Record<string, any>
  isVisible: boolean
}

export const AnswerSummary: React.FC<AnswerSummaryProps> = ({ answers, isVisible }) => {
  const { t } = useLanguage()
  
  if (!isVisible) return null

  const answeredCount = Object.keys(answers).length

  const formatAnswer = (key: string, value: any): string => {
    if (key === 'total-budget') {
      return `${t('common.currency')}${value?.toLocaleString() || '0'}`
    }
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    return String(value)
  }

  const getAnswerIcon = (key: string): string => {
    if (key.includes('budget')) return '💰'
    if (key.includes('use')) return '🎯'
    if (key.includes('performance')) return '⚡'
    if (key.includes('cpu') || key.includes('gpu')) return '🔧'
    if (key.includes('quiet')) return '🔇'
    if (key.includes('energy')) return '⚡'
    if (key.includes('future')) return '🔮'
    if (key.includes('size')) return '📏'
    return '📝'
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('questionnaire.summary.title')}
        </h3>
        <div className="text-sm text-gray-500">
          {answeredCount > 0 ? (
            t('questionnaire.summary.responses', { count: answeredCount })
          ) : (
            t('questionnaire.summary.noResponses')
          )}
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {Object.entries(answers).map(([key, value]) => (
          <div key={key} className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg">
            <span className="text-lg">{getAnswerIcon(key)}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
              <div className="text-sm text-gray-600">
                {formatAnswer(key, value)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {t('questionnaire.summary.autoSaved')}
        </p>
      </div>
    </div>
  )
} 