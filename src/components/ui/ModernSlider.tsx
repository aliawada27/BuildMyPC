'use client'

import React, { useState, useRef, useEffect } from 'react'

interface ModernSliderProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  label: string
  description?: string
  formatValue?: (value: number) => string
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

export const ModernSlider: React.FC<ModernSliderProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  label,
  description,
  formatValue = (val) => val.toString(),
  color = 'blue'
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const sliderRef = useRef<HTMLInputElement>(null)

  const percentage = ((value - min) / (max - min)) * 100

  const colorClasses = {
    blue: {
      track: 'bg-blue-600',
      trackBg: 'bg-blue-100',
      thumb: 'bg-blue-600 border-blue-600',
      tooltip: 'bg-blue-600'
    },
    green: {
      track: 'bg-green-600',
      trackBg: 'bg-green-100',
      thumb: 'bg-green-600 border-green-600',
      tooltip: 'bg-green-600'
    },
    purple: {
      track: 'bg-purple-600',
      trackBg: 'bg-purple-100',
      thumb: 'bg-purple-600 border-purple-600',
      tooltip: 'bg-purple-600'
    },
    orange: {
      track: 'bg-orange-600',
      trackBg: 'bg-orange-100',
      thumb: 'bg-orange-600 border-orange-600',
      tooltip: 'bg-orange-600'
    }
  }

  const colors = colorClasses[color]

  return (
    <div className="w-full space-y-4">
      {/* Label and value */}
      <div className="flex justify-between items-center">
        <div>
          <label className="block text-lg font-semibold text-gray-900">
            {label}
          </label>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        <div className="text-right">
          <span className={`text-xl font-bold ${colors.track.replace('bg-', 'text-')}`}>
            {formatValue(value)}
          </span>
        </div>
      </div>

      {/* Slider container */}
      <div 
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => !isDragging && setShowTooltip(false)}
      >
        {/* Track background */}
        <div className={`w-full h-2 rounded-full ${colors.trackBg}`} />
        
        {/* Track fill */}
        <div 
          className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-200 ${colors.track}`}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Slider input */}
        <input
          ref={sliderRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => {
            setIsDragging(false)
            setShowTooltip(false)
          }}
          className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
        />
        
        {/* Custom thumb */}
        <div 
          className={`
            absolute top-1/2 w-6 h-6 rounded-full border-4 bg-white shadow-lg
            transform -translate-y-1/2 -translate-x-1/2 transition-all duration-200
            ${colors.thumb}
            ${isDragging || showTooltip ? 'scale-125 shadow-xl' : 'scale-100'}
          `}
          style={{ left: `${percentage}%` }}
        />
        
        {/* Tooltip */}
        {(showTooltip || isDragging) && (
          <div 
            className={`
              absolute bottom-8 px-3 py-1 rounded-lg text-white text-sm font-medium
              transform -translate-x-1/2 transition-all duration-200
              ${colors.tooltip}
              ${isDragging ? 'scale-110' : 'scale-100'}
            `}
            style={{ left: `${percentage}%` }}
          >
            {formatValue(value)}
            <div 
              className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${colors.tooltip}`}
            />
          </div>
        )}
      </div>

      {/* Range indicators */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  )
} 