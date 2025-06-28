'use client'

import React from 'react'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  steps: Array<{
    id: string
    title: string
    icon: string
    completed: boolean
  }>
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps, 
  steps 
}) => {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="w-full mb-8">
      {/* Step indicators */}
      <div className="flex justify-between items-center mb-4">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className="flex flex-col items-center relative"
          >
            {/* Step circle */}
            <div 
              className={`
                w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium
                transition-all duration-300 ease-in-out
                ${index <= currentStep 
                  ? 'bg-blue-600 text-white shadow-lg scale-110' 
                  : 'bg-gray-200 text-gray-500'
                }
                ${index === currentStep ? 'ring-4 ring-blue-200' : ''}
              `}
            >
              {step.completed ? '✓' : step.icon}
            </div>
            
            {/* Step title */}
            <span 
              className={`
                text-xs font-medium mt-2 text-center max-w-20
                transition-colors duration-200
                ${index <= currentStep 
                  ? 'text-blue-600' 
                  : 'text-gray-500'
                }
              `}
            >
              {step.title}
            </span>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div 
                className={`
                  absolute top-6 left-12 w-full h-0.5 -z-10
                  transition-colors duration-500
                  ${index < currentStep 
                    ? 'bg-blue-600' 
                    : 'bg-gray-200'
                  }
                `}
                style={{ width: 'calc(100vw / 4 - 48px)' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Progress text */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm font-medium text-gray-600">
          Étape {currentStep + 1} sur {totalSteps}
        </span>
        <span className="text-sm font-medium text-blue-600">
          {Math.round(progressPercentage)}% complété
        </span>
      </div>
    </div>
  )
} 