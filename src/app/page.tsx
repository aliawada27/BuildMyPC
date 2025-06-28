'use client'

import React, { useState } from 'react'
import { UserPreferences } from '@/types/pc-components'
import { ModernRecommendationEngine, ModernPCBuild } from '@/utils/modern-recommendation-engine'
import { ModernQuestionnaire } from '@/components/ModernQuestionnaire'
import { ModernComponentCard } from '@/components/ModernComponentCard'
import { useComponents } from '@/contexts/ComponentsContext'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSelector from '@/components/ui/LanguageSelector'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function Home() {
  const { components, loading, error } = useComponents()
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState<'landing' | 'questionnaire' | 'build'>('landing')
  const [generatedBuild, setGeneratedBuild] = useState<ModernPCBuild | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleStartBuilder = () => {
    setCurrentStep('questionnaire')
  }

  const handleQuestionnaireComplete = async (preferences: UserPreferences) => {
    setIsGenerating(true)
    
    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const engine = new ModernRecommendationEngine(components)
      const build = engine.generateBuild(preferences)
      
      setGeneratedBuild(build)
      setCurrentStep('build')
    } catch (error) {
      console.error('Erreur lors de la génération du build:', error)
      // Fallback ou message d'erreur
    } finally {
      setIsGenerating(false)
    }
  }

  const handleStartOver = () => {
    setCurrentStep('landing')
    setGeneratedBuild(null)
  }

  const handleExportBuild = () => {
    if (!generatedBuild) return
    
    // Create downloadable parts list
    const buildText = `
${generatedBuild.name}
Total Price: $${generatedBuild.totalPrice.toLocaleString()}
Estimated Power: ${generatedBuild.estimatedPower}W
Performance Score: ${generatedBuild.performanceScore}/100
Value Score: ${generatedBuild.valueScore}

Description: ${generatedBuild.description}

Components:
${generatedBuild.components.cpu ? `CPU: ${generatedBuild.components.cpu.brand} ${generatedBuild.components.cpu.model} - $${generatedBuild.components.cpu.price_usd}` : ''}
${generatedBuild.components.gpu ? `GPU: ${generatedBuild.components.gpu.brand} ${generatedBuild.components.gpu.model} - $${generatedBuild.components.gpu.price_usd}` : ''}
${generatedBuild.components.motherboard ? `Motherboard: ${generatedBuild.components.motherboard.brand} ${generatedBuild.components.motherboard.model} - $${generatedBuild.components.motherboard.price_usd}` : ''}
${generatedBuild.components.memory?.[0] ? `Memory: ${generatedBuild.components.memory[0].brand} ${generatedBuild.components.memory[0].model} - $${generatedBuild.components.memory[0].price_usd}` : ''}
${generatedBuild.components.storage?.[0] ? `Storage: ${generatedBuild.components.storage[0].brand} ${generatedBuild.components.storage[0].model} - $${generatedBuild.components.storage[0].price_usd}` : ''}
${generatedBuild.components.powerSupply ? `PSU: ${generatedBuild.components.powerSupply.brand} ${generatedBuild.components.powerSupply.model} - $${generatedBuild.components.powerSupply.price_usd}` : ''}
${generatedBuild.components.case ? `Case: ${generatedBuild.components.case.brand} ${generatedBuild.components.case.model} - $${generatedBuild.components.case.price_usd}` : ''}
${generatedBuild.components.cooling ? `Cooling: ${generatedBuild.components.cooling.brand} ${generatedBuild.components.cooling.model} - $${generatedBuild.components.cooling.price_usd}` : ''}

Compatibility Status: ${generatedBuild.compatibility.isValid ? 'Compatible' : 'Issues Found'}
${generatedBuild.compatibility.errors.length > 0 ? `Errors: ${generatedBuild.compatibility.errors.join(', ')}` : ''}
${generatedBuild.compatibility.warnings.length > 0 ? `Warnings: ${generatedBuild.compatibility.warnings.join(', ')}` : ''}

Recommendations:
${generatedBuild.buildRecommendations.map(rec => `- ${rec}`).join('\n')}
    `.trim()

    const blob = new Blob([buildText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${generatedBuild.name.replace(/\s+/g, '_')}_parts_list.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Loading state
  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-secondary-900 mb-2">
            {t('loading.generating')}
          </h2>
          <p className="text-secondary-600">
            {t('loading.please_wait')}
          </p>
        </Card>
      </div>
    )
  }

  // Questionnaire step
  if (currentStep === 'questionnaire') {
    return <ModernQuestionnaire onComplete={handleQuestionnaireComplete} />
  }

  // Build results step
  if (currentStep === 'build' && generatedBuild) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Build Header */}
        <Card className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                {generatedBuild.name}
              </h1>
              <div className="flex items-center space-x-6 text-lg">
                <span className="text-secondary-600">
                  Total: <span className="font-bold text-primary-600">
                    ${generatedBuild.totalPrice.toLocaleString()}
                  </span>
                </span>
                <span className="text-secondary-600">
                  Power: <span className="font-medium">
                    {generatedBuild.estimatedPower}W
                  </span>
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={handleStartOver}>
                {t('build.startOver')}
              </Button>
              <Button onClick={handleExportBuild}>
                {t('build.exportBuild')}
              </Button>
            </div>
          </div>

          {/* Compatibility Status */}
          <div className={`p-4 rounded-lg border ${
            generatedBuild.compatibility.isValid 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h3 className={`font-medium ${
              generatedBuild.compatibility.isValid ? 'text-green-800' : 'text-red-800'
            }`}>
              {generatedBuild.compatibility.isValid ? t('build.compatibility.compatible') : t('build.compatibility.issues')}
            </h3>
            
            {generatedBuild.compatibility.warnings.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-orange-700 mb-1">{t('build.compatibility.warnings')}</h4>
                <ul className="text-sm text-orange-600 space-y-1">
                  {generatedBuild.compatibility.warnings.map((warning: string, index: number) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {generatedBuild.compatibility.errors.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-red-700 mb-1">{t('build.compatibility.errors')}</h4>
                <ul className="text-sm text-red-600 space-y-1">
                  {generatedBuild.compatibility.errors.map((error: string, index: number) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>

        {/* Components List */}
        <div className="space-y-4">
          {generatedBuild.components.cpu && (
            <ModernComponentCard 
              component={generatedBuild.components.cpu} 
              categoryName={t('build.components.cpu')} 
            />
          )}
          {generatedBuild.components.gpu && (
            <ModernComponentCard 
              component={generatedBuild.components.gpu} 
              categoryName={t('build.components.gpu')} 
            />
          )}
          {generatedBuild.components.motherboard && (
            <ModernComponentCard 
              component={generatedBuild.components.motherboard} 
              categoryName={t('build.components.motherboard')} 
            />
          )}
          {generatedBuild.components.memory?.[0] && (
            <ModernComponentCard 
              component={generatedBuild.components.memory[0]} 
              categoryName={t('build.components.memory')} 
            />
          )}
          {generatedBuild.components.storage?.[0] && (
            <ModernComponentCard 
              component={generatedBuild.components.storage[0]} 
              categoryName={t('build.components.storage')} 
            />
          )}
          {generatedBuild.components.powerSupply && (
            <ModernComponentCard 
              component={generatedBuild.components.powerSupply} 
              categoryName={t('build.components.powerSupply')} 
            />
          )}
          {generatedBuild.components.case && (
            <ModernComponentCard 
              component={generatedBuild.components.case} 
              categoryName={t('build.components.case')} 
            />
          )}
          {generatedBuild.components.cooling && (
            <ModernComponentCard 
              component={generatedBuild.components.cooling} 
              categoryName={t('build.components.cooling')} 
            />
          )}
        </div>

        {/* Build Summary */}
        <Card className="mt-8">
          <h3 className="text-xl font-bold text-secondary-900 mb-4">
            {t('build.summary.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-secondary-700 mb-2">{t('build.performanceScore')}</h4>
              <p className="text-secondary-900">
                {generatedBuild.performanceScore}/100
              </p>
            </div>
            <div>
              <h4 className="font-medium text-secondary-700 mb-2">{t('build.valueScore')}</h4>
              <p className="text-secondary-900">
                {generatedBuild.valueScore}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-secondary-700 mb-2">{t('build.estimatedPower')}</h4>
              <p className="text-secondary-900">
                {generatedBuild.estimatedPower}W
              </p>
            </div>
          </div>
          
          {/* Recommendations */}
          {generatedBuild.buildRecommendations.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-secondary-700 mb-3">{t('build.summary.recommendations')}</h4>
              <ul className="space-y-2">
                {generatedBuild.buildRecommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">💡</span>
                    <span className="text-secondary-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>
    )
  }

  // Landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">🖥️</div>
            <span className="text-2xl font-bold text-secondary-900">{t('nav.title')}</span>
          </div>
          <LanguageSelector />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-secondary-900 mb-6">
            {t('home.hero.title')}
            <span className="text-primary-600"> {t('home.hero.titleHighlight')}</span>
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
            {t('home.hero.subtitle')}
          </p>
          <Button 
            size="lg" 
            onClick={handleStartBuilder}
            className="text-xl px-12 py-4"
          >
            {t('home.hero.startButton')}
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2">
              {t('home.features.smart.title')}
            </h3>
            <p className="text-secondary-600">
              {t('home.features.smart.description')}
            </p>
          </Card>

          <Card className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2">
              {t('home.features.compatibility.title')}
            </h3>
            <p className="text-secondary-600">
              {t('home.features.compatibility.description')}
            </p>
          </Card>

          <Card className="text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2">
              {t('home.features.budget.title')}
            </h3>
            <p className="text-secondary-600">
              {t('home.features.budget.description')}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

 