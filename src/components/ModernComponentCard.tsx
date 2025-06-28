'use client'

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { PCComponent } from '@/contexts/ComponentsContext'
import { Card } from '@/components/ui/Card'

interface ModernComponentCardProps {
  component: PCComponent
  categoryName: string
  showDetails?: boolean
  className?: string
}

export const ModernComponentCard: React.FC<ModernComponentCardProps> = ({ 
  component, 
  categoryName,
  showDetails = true,
  className = ''
}) => {
  const { t } = useLanguage()

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'CPU': '🔧',
      'GPU': '🖥️',
      'Motherboard': '🔌',
      'RAM': '💾',
      'Storage': '💿',
      'PSU': '⚡',
      'Case': '📦',
      'Cooling': '🌀'
    }
    return icons[category] || '🔩'
  }

  const getPerformanceTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      'budget': 'bg-green-100 text-green-800',
      'mid': 'bg-blue-100 text-blue-800',
      'high': 'bg-purple-100 text-purple-800',
      'enthusiast': 'bg-orange-100 text-orange-800'
    }
    return colors[tier] || 'bg-gray-100 text-gray-800'
  }

  const formatPrice = (price: number) => {
    return `${t('common.currency')}${price.toLocaleString()}`
  }

  const getKeySpecs = (component: PCComponent) => {
    const specs: Array<{ label: string; value: string }> = []

    switch (component.category) {
      case 'CPU':
        if (component.cores) specs.push({ label: 'Cores', value: `${component.cores}` })
        if (component.boost_clock) specs.push({ label: 'Boost', value: component.boost_clock })
        if (component.tdp) specs.push({ label: 'TDP', value: component.tdp })
        if (component.socket) specs.push({ label: 'Socket', value: component.socket })
        break
        
      case 'GPU':
        if (component.vram) specs.push({ label: 'VRAM', value: component.vram })
        if (component.tdp) specs.push({ label: 'TDP', value: component.tdp })
        if (component.ray_tracing) specs.push({ label: 'Ray Tracing', value: 'Yes' })
        break
        
      case 'Motherboard':
        if (component.socket) specs.push({ label: 'Socket', value: component.socket })
        if (component.form_factor) specs.push({ label: 'Form Factor', value: component.form_factor })
        if (component.memory_type) specs.push({ label: 'Memory', value: component.memory_type })
        if (component.max_memory) specs.push({ label: 'Max RAM', value: component.max_memory })
        break
        
      case 'RAM':
        if (component.capacity) specs.push({ label: 'Capacity', value: component.capacity })
        if (component.speed) specs.push({ label: 'Speed', value: component.speed })
        if (component.memory_type) specs.push({ label: 'Type', value: component.memory_type })
        break
        
      case 'Storage':
        if (component.capacity) specs.push({ label: 'Capacity', value: component.capacity })
        if (component.type) specs.push({ label: 'Type', value: component.type })
        if (component.interface) specs.push({ label: 'Interface', value: component.interface })
        if (component.read_speed) specs.push({ label: 'Read Speed', value: component.read_speed })
        break
        
      case 'PSU':
        if (component.wattage) specs.push({ label: 'Wattage', value: component.wattage })
        if (component.efficiency) specs.push({ label: 'Efficiency', value: component.efficiency })
        if (component.modular !== undefined) specs.push({ label: 'Modular', value: component.modular ? 'Yes' : 'No' })
        break
        
      case 'Case':
        if (component.form_factor) specs.push({ label: 'Form Factor', value: component.form_factor })
        if (component.size) specs.push({ label: 'Size', value: component.size })
        break
        
      case 'Cooling':
        if (component.type) specs.push({ label: 'Type', value: component.type })
        if (component.tdp_rating) specs.push({ label: 'TDP Rating', value: component.tdp_rating })
        break
    }

    return specs.slice(0, 4)
  }

  const keySpecs = getKeySpecs(component)

  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="p-3 bg-blue-100 rounded-xl">
          <div className="text-2xl">
            {getCategoryIcon(component.category)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">{categoryName}</h3>
              <p className="text-xl font-semibold text-gray-800">
                {component.brand} {component.model}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {formatPrice(component.price_usd)}
              </div>
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getPerformanceTierColor(component.performance_tier)}`}>
                {component.performance_tier.charAt(0).toUpperCase() + component.performance_tier.slice(1)}
              </div>
            </div>
          </div>

          {/* Key Specs */}
          {showDetails && keySpecs.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {keySpecs.map((spec, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {spec.label}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 mt-1">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Special Features */}
          {showDetails && (
            <div className="flex flex-wrap gap-2">
              {component.category === 'GPU' && component.ray_tracing && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✨ Ray Tracing
                </span>
              )}
              {component.category === 'PSU' && component.modular && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  🔌 Modular
                </span>
              )}
              {component.category === 'Storage' && component.interface === 'NVMe' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  ⚡ NVMe
                </span>
              )}
              {component.category === 'Cooling' && component.type === 'Liquid' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                  💧 Liquid Cooling
                </span>
              )}
              {component.price_usd === 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  🎁 Included
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
} 