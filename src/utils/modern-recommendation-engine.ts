import { UserPreferences } from '@/types/pc-components'
import { PCComponent } from '@/contexts/ComponentsContext'
import { SmartBuildGenerator, SmartBuild } from '@/services/SmartBuildGenerator'

export interface ModernPCBuild {
  id: string
  name: string
  description: string
  components: {
    cpu?: PCComponent
    gpu?: PCComponent
    motherboard?: PCComponent
    memory?: PCComponent[]
    storage?: PCComponent[]
    powerSupply?: PCComponent
    case?: PCComponent
    cooling?: PCComponent
  }
  totalPrice: number
  estimatedPower: number
  compatibility: {
    isValid: boolean
    errors: string[]
    warnings: string[]
    suggestions: string[]
  }
  performanceScore: number
  valueScore: number
  buildRecommendations: string[]
}

export class ModernRecommendationEngine {
  private components: PCComponent[]

  constructor(components: PCComponent[]) {
    this.components = components
  }

  generateBuild(preferences: UserPreferences): ModernPCBuild {
    const generator = new SmartBuildGenerator(this.components)
    
    // Générer le build principal
    const smartBuild = generator.generateBuild(preferences)
    
    if (!smartBuild) {
      return this.createEmptyBuild(preferences)
    }

    return this.convertToModernBuild(smartBuild, preferences)
  }

  generateMultipleBuilds(preferences: UserPreferences, count: number = 3): ModernPCBuild[] {
    const builds: ModernPCBuild[] = []
    const generator = new SmartBuildGenerator(this.components)

    // Build équilibré (recommandé)
    const balancedBuild = generator.generateBuild(preferences, {
      prioritizePerformance: false,
      prioritizeValue: true
    })
    if (balancedBuild) {
      builds.push(this.convertToModernBuild(balancedBuild, preferences))
    }

    // Build performance
    if (preferences.budget.max > 1000) {
      const performanceBuild = generator.generateBuild(preferences, {
        budget: {
          min: preferences.budget.min,
          max: preferences.budget.max * 1.1 // 10% de dépassement
        },
        prioritizePerformance: true,
        prioritizeValue: false
      })
      if (performanceBuild) {
        builds.push(this.convertToModernBuild(performanceBuild, preferences))
      }
    }

    // Build économique
    const budgetBuild = generator.generateBuild(preferences, {
      budget: {
        min: preferences.budget.min,
        max: preferences.budget.max * 0.8 // 20% en dessous
      },
      prioritizeValue: true,
      prioritizePerformance: false
    })
    if (budgetBuild) {
      builds.push(this.convertToModernBuild(budgetBuild, preferences))
    }

    return builds.slice(0, count)
  }

  private convertToModernBuild(smartBuild: SmartBuild, preferences: UserPreferences): ModernPCBuild {
    const components = smartBuild.components

    return {
      id: smartBuild.id,
      name: smartBuild.name,
      description: smartBuild.description,
      components: {
        cpu: components.cpu,
        gpu: components.gpu,
        motherboard: components.motherboard,
        memory: components.ram ? [components.ram] : [],
        storage: components.storage || [],
        powerSupply: components.psu,
        case: components.case,
        cooling: components.cooling
      },
      totalPrice: smartBuild.totalPrice,
      estimatedPower: smartBuild.estimatedPower,
      compatibility: {
        isValid: smartBuild.compatibility.isCompatible,
        errors: smartBuild.compatibility.errors,
        warnings: smartBuild.compatibility.warnings,
        suggestions: smartBuild.compatibility.suggestions
      },
      performanceScore: smartBuild.performanceScore,
      valueScore: smartBuild.valueScore,
      buildRecommendations: this.generateRecommendations(smartBuild, preferences)
    }
  }

  private generateRecommendations(build: SmartBuild, preferences: UserPreferences): string[] {
    const recommendations: string[] = []

    // Recommandations basées sur l'usage
    if (preferences.primaryUse.includes('Gaming AAA') && build.components.gpu?.performance_tier === 'budget') {
      recommendations.push('Pour les jeux AAA récents, considérez une carte graphique plus puissante')
    }

    if (preferences.primaryUse.includes('Montage Vidéo') && !build.components.ram) {
      recommendations.push('32GB de RAM recommandé pour le montage vidéo professionnel')
    }

    if (preferences.primaryUse.includes('Streaming') && !build.components.gpu) {
      recommendations.push('Une carte graphique dédiée améliorerait les performances de streaming')
    }

    // Recommandations basées sur le budget
    const budgetUsed = (build.totalPrice / preferences.budget.max) * 100
    if (budgetUsed < 80) {
      recommendations.push(`Budget utilisé à ${Math.round(budgetUsed)}% - possibilité d'améliorer les performances`)
    }

    // Recommandations de compatibilité
    if (build.compatibility.warnings.length > 0) {
      recommendations.push('Vérifiez les avertissements de compatibilité avant l\'achat')
    }

    // Recommandations futures
    if (preferences.priorities.futureProofing >= 7) {
      recommendations.push('Configuration évolutive - vous pourrez facilement upgrader plus tard')
    }

    return recommendations.slice(0, 3) // Limiter à 3 recommandations
  }

  private createEmptyBuild(preferences: UserPreferences): ModernPCBuild {
    return {
      id: 'empty-build',
      name: 'Configuration Indisponible',
      description: 'Aucune configuration trouvée dans votre budget avec les composants disponibles',
      components: {},
      totalPrice: 0,
      estimatedPower: 0,
      compatibility: {
        isValid: false,
        errors: ['Aucune configuration possible dans le budget spécifié'],
        warnings: [],
        suggestions: [
          'Augmentez votre budget',
          'Réduisez vos exigences de performance',
          'Considérez des marques alternatives'
        ]
      },
      performanceScore: 0,
      valueScore: 0,
      buildRecommendations: [
        'Augmentez votre budget pour plus d\'options',
        'Consultez notre guide des prix des composants',
        'Contactez notre support pour des conseils personnalisés'
      ]
    }
  }

  // Méthodes utilitaires pour analyses avancées
  getComponentAlternatives(component: PCComponent, budget: number): PCComponent[] {
    return this.components
      .filter(c => 
        c.category === component.category &&
        c.id !== component.id &&
        c.price_usd <= budget
      )
      .sort((a, b) => {
        // Trier par rapport qualité/prix
        const tierOrder = ['budget', 'mid', 'high', 'enthusiast']
        const aTier = tierOrder.indexOf(a.performance_tier)
        const bTier = tierOrder.indexOf(b.performance_tier)
        if (aTier !== bTier) return bTier - aTier
        return a.price_usd - b.price_usd
      })
      .slice(0, 5)
  }

  analyzeBudgetOptimization(preferences: UserPreferences): {
    currentBudget: number
    recommendedBudget: number
    budgetBreakdown: Record<string, number>
    optimizationTips: string[]
  } {
    const currentBudget = preferences.budget.max
    
    // Analyser les prix moyens par catégorie selon le niveau de performance
    const performanceTier = preferences.performance
    const avgPrices = this.calculateAveragePrices(performanceTier)
    
    const recommendedBudget = Object.values(avgPrices).reduce((sum, price) => sum + price, 0)
    
    return {
      currentBudget,
      recommendedBudget: Math.round(recommendedBudget),
      budgetBreakdown: avgPrices,
      optimizationTips: this.getBudgetOptimizationTips(currentBudget, recommendedBudget)
    }
  }

  private calculateAveragePrices(performanceLevel: string): Record<string, number> {
    const categories = ['CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'PSU', 'Case']
    const prices: Record<string, number> = {}

    categories.forEach(category => {
      const components = this.components.filter(c => c.category === category)
      if (components.length > 0) {
        const avgPrice = components.reduce((sum, c) => sum + c.price_usd, 0) / components.length
        prices[category] = Math.round(avgPrice)
      }
    })

    return prices
  }

  private getBudgetOptimizationTips(current: number, recommended: number): string[] {
    const tips: string[] = []
    
    if (current < recommended * 0.8) {
      tips.push('Budget insuffisant pour le niveau de performance souhaité')
      tips.push('Considérez des composants d\'occasion ou reconditionnés')
    } else if (current > recommended * 1.3) {
      tips.push('Budget généreux - possibilité d\'upgrader significativement')
      tips.push('Investissez dans des composants haut de gamme pour la longévité')
    } else {
      tips.push('Budget approprié pour vos besoins')
      tips.push('Équilibre optimal entre performance et prix')
    }

    return tips
  }
} 