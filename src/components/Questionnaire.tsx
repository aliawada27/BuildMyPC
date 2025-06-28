'use client'

import React, { useState } from 'react'
import { QuestionnaireStep, Question, UserPreferences } from '@/types/pc-components'
import { questionnaireSteps } from '@/data/questionnaire'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

interface QuestionnaireProps {
  onComplete: (preferences: UserPreferences) => void
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNext = () => {
    if (currentStep < questionnaireSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Convert answers to UserPreferences format
      const preferences: UserPreferences = {
        id: uuidv4(),
        primaryUse: answers['primary-use'] || [],
        budget: {
          min: Math.max(0, (answers['total-budget'] || 1000) - 200),
          max: answers['total-budget'] || 1000
        },
        performance: mapPerformanceLevel(answers['performance-level']),
        brands: {
          preferred: [
            answers['cpu-preference'],
            answers['gpu-preference']
          ].filter(Boolean).filter(brand => brand !== 'No preference'),
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
      
      onComplete(preferences)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const isStepComplete = () => {
    const step = questionnaireSteps[currentStep]
    return step.questions.filter(q => q.required).every(question => {
      const answer = answers[question.id]
      return answer !== undefined && answer !== null && answer !== ''
    })
  }

  const mapPerformanceLevel = (level: string): 'budget' | 'balanced' | 'high-end' => {
    if (level?.includes('Budget')) return 'budget'
    if (level?.includes('High-end') || level?.includes('Extreme')) return 'high-end'
    return 'balanced'
  }

  const currentStepData = questionnaireSteps[currentStep]

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-secondary-600">
            Step {currentStep + 1} of {questionnaireSteps.length}
          </span>
          <span className="text-sm font-medium text-secondary-600">
            {Math.round(((currentStep + 1) / questionnaireSteps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-secondary-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questionnaireSteps.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-secondary-600">
            {currentStepData.description}
          </p>
        </div>

        <div className="space-y-6">
          {currentStepData.questions.map((question, index) => (
            <QuestionComponent
              key={question.id}
              question={question}
              answer={answers[question.id]}
              onAnswer={(answer) => handleAnswer(question.id, answer)}
            />
          ))}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!isStepComplete()}
          className="flex items-center"
        >
          {currentStep === questionnaireSteps.length - 1 ? 'Generate Build' : 'Next'}
          {currentStep < questionnaireSteps.length - 1 && (
            <ChevronRight className="w-4 h-4 ml-2" />
          )}
        </Button>
      </div>
    </div>
  )
}

interface QuestionComponentProps {
  question: Question
  answer: any
  onAnswer: (answer: any) => void
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({ question, answer, onAnswer }) => {
  const renderInput = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answer === option}
                  onChange={(e) => onAnswer(e.target.value)}
                  className="mr-3 w-4 h-4 text-primary-600"
                />
                <span className="text-secondary-900">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={Array.isArray(answer) && answer.includes(option)}
                  onChange={(e) => {
                    const currentAnswers = Array.isArray(answer) ? answer : []
                    if (e.target.checked) {
                      onAnswer([...currentAnswers, option])
                    } else {
                      onAnswer(currentAnswers.filter((a: string) => a !== option))
                    }
                  }}
                  className="mr-3 w-4 h-4 text-primary-600"
                />
                <span className="text-secondary-900">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'range':
        return (
          <div className="space-y-4">
            <input
              type="range"
              min={question.min}
              max={question.max}
              step={question.step}
              value={answer || question.min}
              onChange={(e) => onAnswer(Number(e.target.value))}
              className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-secondary-600">
              <span>${question.min?.toLocaleString()}</span>
              <span className="font-medium text-primary-600">
                Current: ${Number(answer || question.min).toLocaleString()}
              </span>
              <span>${question.max?.toLocaleString()}</span>
            </div>
          </div>
        )

      case 'text':
        return (
          <textarea
            value={answer || ''}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder="Enter your response..."
            className="input-field w-full h-24 resize-none"
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-lg font-medium text-secondary-900">
        {question.question}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
    </div>
  )
} 