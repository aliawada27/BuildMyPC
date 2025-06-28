'use client'

import React, { useState, useEffect } from 'react'
import { UserPreferences } from '@/types/pc-components'
import { getModernQuestionnaireSteps, getUsageOptions } from '@/data/modern-questionnaire'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { QuestionCard } from '@/components/ui/QuestionCard'
import { OptionButton } from '@/components/ui/OptionButton'
import { ModernSlider } from '@/components/ui/ModernSlider'
import { AnswerSummary } from '@/components/ui/AnswerSummary'
import { v4 as uuidv4 } from 'uuid'

interface ModernQuestionnaireProps {
  onComplete: (preferences: UserPreferences) => void
}

export const ModernQuestionnaire: React.FC<ModernQuestionnaireProps> = ({ onComplete }) => {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [showSummary, setShowSummary] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const modernQuestionnaireSteps = getModernQuestionnaireSteps(t)
  const usageOptions = getUsageOptions(t)
  
  const currentStepData = modernQuestionnaireSteps[currentStep]
  const currentQuestionData = currentStepData.questions[currentQuestion]
  const totalQuestions = modernQuestionnaireSteps.reduce((acc, step) => acc + step.questions.length, 0)
  const answeredQuestions = Object.keys(answers).length

  // Auto-save des réponses
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('pc-builder-answers', JSON.stringify(answers))
    }
  }, [answers])

  // Chargement des réponses sauvegardées
  useEffect(() => {
    const savedAnswers = localStorage.getItem('pc-builder-answers')
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers))
      } catch (error) {
        console.error('Erreur lors du chargement des réponses:', error)
      }
    }
  }, [])

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const isCurrentQuestionAnswered = () => {
    const answer = answers[currentQuestionData.id]
    if (!currentQuestionData.required) return true
    
    return answer !== undefined && 
           answer !== null && 
           answer !== '' && 
           !(Array.isArray(answer) && answer.length === 0)
  }

  const navigateQuestion = (direction: 'next' | 'prev') => {
    setIsTransitioning(true)
    
    setTimeout(() => {
      if (direction === 'next') {
        if (currentQuestion < currentStepData.questions.length - 1) {
          setCurrentQuestion(prev => prev + 1)
        } else if (currentStep < modernQuestionnaireSteps.length - 1) {
          setCurrentStep(prev => prev + 1)
          setCurrentQuestion(0)
        } else {
          handleComplete()
          return
        }
      } else {
        if (currentQuestion > 0) {
          setCurrentQuestion(prev => prev - 1)
        } else if (currentStep > 0) {
          setCurrentStep(prev => prev - 1)
          setCurrentQuestion(modernQuestionnaireSteps[currentStep - 1].questions.length - 1)
        }
      }
      
      setTimeout(() => setIsTransitioning(false), 50)
    }, 150)
  }

  const handleComplete = () => {
    const preferences: UserPreferences = {
      id: uuidv4(),
      primaryUse: (answers['primary-use'] || []).map((id: string) => 
        usageOptions.find(option => option.id === id)?.label || id
      ),
      budget: {
        min: Math.max(0, (answers['total-budget'] || 1000) - 200),
        max: answers['total-budget'] || 1000
      },
      performance: mapPerformanceLevel(answers['performance-level']),
      brands: {
        preferred: [
          answers['cpu-preference'],
          answers['gpu-preference']
        ].filter(Boolean).filter(brand => brand !== 'Aucune préférence'),
        avoid: []
      },
      priorities: {
        quietOperation: answers['quiet-operation'] || 5,
        energyEfficiency: answers['energy-efficiency'] || 5,
        futureProofing: answers['future-proofing'] || 5,
        aesthetics: 5
      },
      specialRequirements: [
        answers['size-constraint'],
        answers['additional-requirements']
      ].filter(Boolean)
    }
    
    localStorage.removeItem('pc-builder-answers')
    onComplete(preferences)
  }

  const mapPerformanceLevel = (level: string): 'budget' | 'balanced' | 'high-end' => {
    if (level?.includes('Économique')) return 'budget'
    if (level?.includes('Performant') || level?.includes('Extrême')) return 'high-end'
    return 'balanced'
  }

  const getProgressSteps = () => {
    return modernQuestionnaireSteps.map((step, index) => ({
      id: step.id,
      title: step.title.split(' ')[0],
      icon: step.icon,
      completed: index < currentStep || (index === currentStep && currentQuestion === step.questions.length - 1 && isCurrentQuestionAnswered())
    }))
  }

  const renderQuestionInput = () => {
    const question = currentQuestionData

    switch (question.type) {
      case 'checkbox':
        if (question.id === 'primary-use') {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usageOptions.map((option) => (
                <OptionButton
                  key={option.id}
                  isSelected={Array.isArray(answers[question.id]) && answers[question.id].includes(option.id)}
                  onClick={() => {
                    const currentAnswers = Array.isArray(answers[question.id]) ? answers[question.id] : []
                    if (currentAnswers.includes(option.id)) {
                      handleAnswer(question.id, currentAnswers.filter((id: string) => id !== option.id))
                    } else {
                      handleAnswer(question.id, [...currentAnswers, option.id])
                    }
                  }}
                  icon={option.icon}
                  description={option.description}
                  variant="card"
                >
                  {option.label}
                </OptionButton>
              ))}
            </div>
          )
        }
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options?.map((option) => (
              <OptionButton
                key={option}
                isSelected={Array.isArray(answers[question.id]) && answers[question.id].includes(option)}
                onClick={() => {
                  const currentAnswers = Array.isArray(answers[question.id]) ? answers[question.id] : []
                  if (currentAnswers.includes(option)) {
                    handleAnswer(question.id, currentAnswers.filter((a: string) => a !== option))
                  } else {
                    handleAnswer(question.id, [...currentAnswers, option])
                  }
                }}
                variant="default"
              >
                {option}
              </OptionButton>
            ))}
          </div>
        )

      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <OptionButton
                key={option}
                isSelected={answers[question.id] === option}
                onClick={() => handleAnswer(question.id, option)}
                variant="default"
              >
                {option}
              </OptionButton>
            ))}
          </div>
        )

      case 'range':
        const formatValue = (value: number) => {
          if (question.id === 'total-budget') {
            return `${t('common.currency')}${value.toLocaleString()}`
          }
          if (question.id.includes('operation') || question.id.includes('efficiency') || question.id.includes('proofing')) {
            const labels = [
              t('options.importance.1'),
              t('options.importance.3'),
              t('options.importance.5'),
              t('options.importance.7'),
              t('options.importance.9')
            ]
            return `${value}/10 - ${labels[Math.floor((value - 1) / 2)] || t('options.importance.10')}`
          }
          return value.toString()
        }

        const getSliderColor = (): 'blue' | 'green' | 'purple' | 'orange' => {
          if (question.id === 'total-budget') return 'green'
          if (question.id.includes('quiet')) return 'purple'
          if (question.id.includes('energy')) return 'green'
          if (question.id.includes('future')) return 'orange'
          return 'blue'
        }

        return (
          <div className="max-w-2xl">
            <ModernSlider
              value={answers[question.id] || question.min || 1}
              onChange={(value) => handleAnswer(question.id, value)}
              min={question.min || 1}
              max={question.max || 10}
              step={question.step || 1}
              label=""
              formatValue={formatValue}
              color={getSliderColor()}
            />
          </div>
        )

      case 'text':
        return (
          <div className="max-w-2xl">
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder={t('questions.requirements.additionalRequirements')}
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200 resize-none"
            />
          </div>
        )

      default:
        return null
    }
  }

  const canGoBack = currentStep > 0 || currentQuestion > 0
  const isLastQuestion = currentStep === modernQuestionnaireSteps.length - 1 && 
                        currentQuestion === currentStepData.questions.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('questionnaire.title')}
            </h1>
            <p className="text-gray-600">
              {t('questionnaire.subtitle', { 
                current: answeredQuestions, 
                total: totalQuestions, 
                time: currentStepData.estimatedTime 
              })}
            </p>
          </div>
          
          <Button
            variant="secondary"
            onClick={() => setShowSummary(!showSummary)}
            className="flex items-center"
          >
            ✨ {showSummary ? t('questionnaire.hideSummary') : t('questionnaire.showSummary')}
          </Button>
        </div>

        {/* Barre de progression */}
        <ProgressBar
          currentStep={currentStep}
          totalSteps={modernQuestionnaireSteps.length}
          steps={getProgressSteps()}
        />

        {/* Question */}
        <QuestionCard
          title={currentQuestionData.question}
          description={`Étape ${currentStep + 1} : ${currentStepData.title}`}
          icon={currentStepData.icon}
          isActive={!isTransitioning}
          className="mb-8"
        >
          {renderQuestionInput()}
        </QuestionCard>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="secondary"
            onClick={() => navigateQuestion('prev')}
            disabled={!canGoBack}
            className="flex items-center"
          >
            ← {t('common.previous')}
          </Button>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {isCurrentQuestionAnswered() ? t('questionnaire.answered') : t('questionnaire.pending')}
            </div>

            <Button
              onClick={() => navigateQuestion('next')}
              disabled={!isCurrentQuestionAnswered()}
              className="flex items-center px-8"
            >
              {isLastQuestion ? t('questionnaire.generatePC') : `${t('common.next')} →`}
            </Button>
          </div>
        </div>

        {/* Aide contextuelle */}
        {currentQuestionData.id === 'primary-use' && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-blue-800 text-sm">
              💡 <strong>{t('questionnaire.tip.title')}</strong> {t('questionnaire.tip.usage')}
            </p>
          </div>
        )}
      </div>

      {/* Résumé des réponses */}
      <AnswerSummary answers={answers} isVisible={showSummary} />
    </div>
  )
} 