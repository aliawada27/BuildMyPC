'use client'

import React from 'react'

interface OptionButtonProps {
  children: React.ReactNode
  isSelected: boolean
  onClick: () => void
  icon?: string
  description?: string
  variant?: 'default' | 'card' | 'minimal'
  disabled?: boolean
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  children,
  isSelected,
  onClick,
  icon,
  description,
  variant = 'default',
  disabled = false
}) => {
  const baseClasses = `
    transition-all duration-300 ease-out cursor-pointer
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `

  const variantClasses = {
    default: `
      ${baseClasses}
      p-4 rounded-xl border-2 text-left
      ${isSelected 
        ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-lg transform scale-105' 
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      }
    `,
    card: `
      ${baseClasses}
      p-6 rounded-2xl border-2 text-center
      ${isSelected 
        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-900 shadow-xl transform scale-105' 
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg hover:transform hover:scale-102'
      }
    `,
    minimal: `
      ${baseClasses}
      p-3 rounded-lg
      ${isSelected 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }
    `
  }

  return (
    <div 
      className={variantClasses[variant]}
      onClick={disabled ? undefined : onClick}
    >
      {variant === 'card' && (
        <div className="flex flex-col items-center space-y-3">
          {icon && (
            <div className={`
              text-3xl p-3 rounded-xl transition-colors duration-300
              ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}
            `}>
              {icon}
            </div>
          )}
          <div className="space-y-1">
            <div className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
              {children}
            </div>
            {description && (
              <div className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                {description}
              </div>
            )}
          </div>
        </div>
      )}

      {variant === 'default' && (
        <div className="flex items-center space-x-3">
          {icon && (
            <div className={`
              text-2xl p-2 rounded-lg transition-colors duration-300
              ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}
            `}>
              {icon}
            </div>
          )}
          <div className="flex-1">
            <div className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
              {children}
            </div>
            {description && (
              <div className={`text-sm mt-1 ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                {description}
              </div>
            )}
          </div>
          {isSelected && (
            <div className="text-blue-600 text-xl">✓</div>
          )}
        </div>
      )}

      {variant === 'minimal' && (
        <div className="font-medium text-center">
          {children}
        </div>
      )}
    </div>
  )
} 