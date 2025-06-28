'use client'

import React from 'react'

interface QuestionCardProps {
  children: React.ReactNode
  title: string
  description: string
  icon: string
  isActive?: boolean
  className?: string
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  children,
  title,
  description,
  icon,
  isActive = true,
  className = ''
}) => {
  return (
    <div 
      className={`
        bg-white rounded-2xl shadow-xl border border-gray-100
        transition-all duration-500 ease-out
        ${isActive 
          ? 'opacity-100 transform translate-y-0 scale-100' 
          : 'opacity-0 transform translate-y-8 scale-95'
        }
        ${className}
      `}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl p-8 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="text-4xl bg-white rounded-xl p-3 shadow-md">
            {icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {children}
      </div>
    </div>
  )
} 