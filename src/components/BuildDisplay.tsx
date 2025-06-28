'use client'

import React from 'react'
import { PCBuild, PCComponent } from '@/types/pc-components'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Cpu, 
  HardDrive, 
  Monitor, 
  Zap, 
  ShoppingCart, 
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Download
} from 'lucide-react'

interface BuildDisplayProps {
  build: PCBuild
  onSave?: () => void
  onShare?: () => void
  onExport?: () => void
}

export const BuildDisplay: React.FC<BuildDisplayProps> = ({ 
  build, 
  onSave, 
  onShare, 
  onExport 
}) => {
  const componentIcons: Record<string, React.ElementType> = {
    cpu: Cpu,
    gpu: Monitor,
    motherboard: HardDrive,
    memory: HardDrive,
    storage: HardDrive,
    'power-supply': Zap,
    cooling: Cpu,
    case: HardDrive
  }

  const formatPrice = (price: number) => `$${price.toLocaleString()}`

  const renderComponent = (component: PCComponent | undefined, categoryName: string) => {
    if (!component) return null

    const Icon = componentIcons[component.category] || HardDrive

    return (
      <Card key={component.id} className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Icon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-secondary-900">{categoryName}</h3>
                <span className="font-bold text-primary-600">
                  {formatPrice(component.price)}
                </span>
              </div>
              <p className="text-lg font-medium text-secondary-700 mb-1">
                {component.name}
              </p>
              <p className="text-sm text-secondary-500 mb-3">
                {component.brand}
              </p>
              
              {/* Key Specs */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {Object.entries(component.specs).slice(0, 4).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="text-secondary-500 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="ml-1 text-secondary-700 font-medium">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-green-700 mb-1">Pros:</h4>
                  <ul className="text-xs text-green-600 space-y-1">
                    {component.pros.slice(0, 2).map((pro, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-1">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-orange-700 mb-1">Cons:</h4>
                  <ul className="text-xs text-orange-600 space-y-1">
                    {component.cons.slice(0, 2).map((con, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-orange-500 mr-1">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Vendor Links */}
              <div className="flex flex-wrap gap-2">
                {component.vendorLinks.slice(0, 3).map((vendor, index) => (
                  <a
                    key={index}
                    href={vendor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      vendor.inStock 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800'
                    } transition-colors`}
                  >
                    {vendor.vendor} - {formatPrice(vendor.price)}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Build Header */}
      <Card className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              {build.name}
            </h1>
            <div className="flex items-center space-x-6 text-lg">
              <span className="text-secondary-600">
                Total: <span className="font-bold text-primary-600">
                  {formatPrice(build.totalPrice)}
                </span>
              </span>
              <span className="text-secondary-600">
                Power: <span className="font-medium">
                  {build.estimatedPower}W
                </span>
              </span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {onSave && (
              <Button variant="secondary" onClick={onSave}>
                Save Build
              </Button>
            )}
            {onShare && (
              <Button variant="secondary" onClick={onShare}>
                Share
              </Button>
            )}
            {onExport && (
              <Button onClick={onExport} className="flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export List
              </Button>
            )}
          </div>
        </div>

        {/* Compatibility Status */}
        <div className={`p-4 rounded-lg border ${
          build.compatibility.isValid 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center mb-2">
            {build.compatibility.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            )}
            <h3 className={`font-medium ${
              build.compatibility.isValid ? 'text-green-800' : 'text-red-800'
            }`}>
              {build.compatibility.isValid ? 'Build Compatible' : 'Compatibility Issues'}
            </h3>
          </div>
          
          {build.compatibility.warnings.length > 0 && (
            <div className="mb-2">
              <h4 className="text-sm font-medium text-orange-700 mb-1">Warnings:</h4>
              <ul className="text-sm text-orange-600 space-y-1">
                {build.compatibility.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}
          
          {build.compatibility.errors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-1">Errors:</h4>
              <ul className="text-sm text-red-600 space-y-1">
                {build.compatibility.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* Components List */}
      <div className="space-y-4">
        {renderComponent(build.components.cpu, 'Processor (CPU)')}
        {renderComponent(build.components.gpu, 'Graphics Card (GPU)')}
        {renderComponent(build.components.motherboard, 'Motherboard')}
        {build.components.memory?.map((mem, index) => 
          renderComponent(mem, `Memory (RAM) ${index + 1}`)
        )}
        {build.components.storage?.map((storage, index) => 
          renderComponent(storage, `Storage ${index + 1}`)
        )}
        {renderComponent(build.components.powerSupply, 'Power Supply (PSU)')}
        {renderComponent(build.components.cooling, 'CPU Cooling')}
        {renderComponent(build.components.case, 'Case')}
      </div>

      {/* Build Summary */}
      <Card className="mt-8">
        <h3 className="text-xl font-bold text-secondary-900 mb-4">
          Build Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-secondary-700 mb-2">Performance Level</h4>
            <p className="text-secondary-900 capitalize">
              {build.userPreferences.performance}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-secondary-700 mb-2">Primary Use</h4>
            <p className="text-secondary-900">
              {build.userPreferences.primaryUse.join(', ')}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-secondary-700 mb-2">Budget Range</h4>
            <p className="text-secondary-900">
              {formatPrice(build.userPreferences.budget.min)} - {formatPrice(build.userPreferences.budget.max)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
} 