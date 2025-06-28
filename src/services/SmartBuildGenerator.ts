import { PCComponent } from '@/contexts/ComponentsContext'
import { UserPreferences } from '@/types/pc-components'
import { CompatibilityChecker, PCBuildComponents, CompatibilityResult } from './CompatibilityChecker'

export interface SmartBuild {
  id: string
  name: string
  components: PCBuildComponents
  totalPrice: number
  estimatedPower: number
  compatibility: CompatibilityResult
  performanceScore: number
  valueScore: number
  description: string
}

export interface BuildGenerationOptions {
  budget: {
    min: number
    max: number
    flexibility?: number // pourcentage de dépassement autorisé
  }
  prioritizeCompatibility: boolean
  prioritizePerformance: boolean
  prioritizeValue: boolean
  includeCooling: boolean
  includeCase: boolean
}

export class SmartBuildGenerator {
  private components: PCComponent[]

  constructor(components: PCComponent[]) {
    this.components = components
  }

  generateBuild(preferences: UserPreferences, options?: Partial<BuildGenerationOptions>): SmartBuild | null {
    const defaultOptions: BuildGenerationOptions = {
      budget: preferences.budget,
      prioritizeCompatibility: true,
      prioritizePerformance: preferences.performance === 'high-end',
      prioritizeValue: preferences.performance === 'budget',
      includeCooling: true,
      includeCase: true,
      ...options
    }

    // Étape 1: Analyser les besoins utilisateur
    const performanceTier = this.mapPerformanceLevel(preferences.performance)
    const budgetPerComponent = this.calculateBudgetAllocation(defaultOptions.budget, performanceTier)

    try {
      // Étape 2: Sélectionner les composants principaux
      const cpu = this.selectCPU(preferences, budgetPerComponent, performanceTier)
      if (!cpu) throw new Error('Aucun CPU trouvé dans le budget')

      const motherboard = this.selectMotherboard(cpu, budgetPerComponent, performanceTier)
      if (!motherboard) throw new Error('Aucune carte mère compatible trouvée')

      const ram = this.selectRAM(motherboard, budgetPerComponent, performanceTier, preferences)
      if (!ram) throw new Error('Aucune RAM compatible trouvée')

      const gpu = this.selectGPU(preferences, budgetPerComponent, performanceTier)
      
      const storage = this.selectStorage(budgetPerComponent, performanceTier)
      if (!storage || storage.length === 0) throw new Error('Aucun stockage trouvé')

      const psu = this.selectPSU(cpu, gpu, budgetPerComponent)
      if (!psu) throw new Error('Aucune alimentation adaptée trouvée')

      const pcCase = defaultOptions.includeCase ? 
        this.selectCase(motherboard, budgetPerComponent) : undefined

      const cooling = defaultOptions.includeCooling ? 
        this.selectCooling(cpu, motherboard, budgetPerComponent) : undefined

      // Étape 3: Construire et valider
      const buildComponents: PCBuildComponents = {
        cpu,
        motherboard,
        ram,
        gpu,
        storage,
        psu,
        case: pcCase,
        cooling
      }

      // Étape 4: Vérification compatibilité
      const compatibility = CompatibilityChecker.checkBuildCompatibility(buildComponents)
      
      // Si incompatible et priorité compatibilité, réessayer
      if (!compatibility.isCompatible && defaultOptions.prioritizeCompatibility) {
        return this.fallbackBuild(preferences, defaultOptions, compatibility)
      }

      // Étape 5: Calculer les scores
      const totalPrice = CompatibilityChecker.calculateTotalPrice(buildComponents)
      const estimatedPower = CompatibilityChecker.calculateEstimatedPower(buildComponents)
      const performanceScore = this.calculatePerformanceScore(buildComponents)
      const valueScore = this.calculateValueScore(buildComponents, totalPrice)

      return {
        id: `build-${Date.now()}`,
        name: this.generateBuildName(buildComponents, performanceTier),
        components: buildComponents,
        totalPrice,
        estimatedPower,
        compatibility,
        performanceScore,
        valueScore,
        description: this.generateBuildDescription(buildComponents, preferences)
      }

    } catch (error) {
      console.error('Erreur génération build:', error)
      return this.generateFallbackBuild(preferences, defaultOptions)
    }
  }

  private mapPerformanceLevel(level: 'budget' | 'balanced' | 'high-end'): 'budget' | 'mid' | 'high' | 'enthusiast' {
    switch (level) {
      case 'budget': return 'budget'
      case 'balanced': return 'mid'
      case 'high-end': return 'high'
      default: return 'mid'
    }
  }

  private calculateBudgetAllocation(budget: { min: number, max: number }, tier: string) {
    const totalBudget = budget.max
    
    // Allocation optimale par composant selon le niveau de performance
    const allocations = {
      budget: { cpu: 0.15, gpu: 0.25, motherboard: 0.08, ram: 0.10, storage: 0.10, psu: 0.08, case: 0.06, cooling: 0.05 },
      mid: { cpu: 0.18, gpu: 0.30, motherboard: 0.10, ram: 0.12, storage: 0.12, psu: 0.08, case: 0.06, cooling: 0.06 },
      high: { cpu: 0.20, gpu: 0.35, motherboard: 0.12, ram: 0.15, storage: 0.15, psu: 0.10, case: 0.08, cooling: 0.10 },
      enthusiast: { cpu: 0.22, gpu: 0.40, motherboard: 0.15, ram: 0.18, storage: 0.18, psu: 0.12, case: 0.10, cooling: 0.15 }
    }

    const allocation = allocations[tier as keyof typeof allocations] || allocations.mid

    return {
      cpu: totalBudget * allocation.cpu,
      gpu: totalBudget * allocation.gpu,
      motherboard: totalBudget * allocation.motherboard,
      ram: totalBudget * allocation.ram,
      storage: totalBudget * allocation.storage,
      psu: totalBudget * allocation.psu,
      case: totalBudget * allocation.case,
      cooling: totalBudget * allocation.cooling
    }
  }

  private selectCPU(preferences: UserPreferences, budget: any, tier: string): PCComponent | null {
    let cpus = this.components.filter(c => c.category === 'CPU')

    // Filtre par préférence de marque
    if (preferences.brands.preferred.length > 0) {
      const preferred = cpus.filter(c => preferences.brands.preferred.includes(c.brand))
      if (preferred.length > 0) cpus = preferred
    }

    // Filtre par budget
    cpus = cpus.filter(c => c.price_usd <= budget.cpu * 1.2) // 20% de flexibilité

    // Filtre par niveau de performance
    cpus = cpus.filter(c => {
      const tierOrder = ['budget', 'mid', 'high', 'enthusiast']
      const minTierIndex = Math.max(0, tierOrder.indexOf(tier) - 1)
      const maxTierIndex = Math.min(tierOrder.length - 1, tierOrder.indexOf(tier) + 1)
      const cpuTierIndex = tierOrder.indexOf(c.performance_tier)
      return cpuTierIndex >= minTierIndex && cpuTierIndex <= maxTierIndex
    })

    if (cpus.length === 0) return null

    // Trier par rapport qualité/prix
    cpus.sort((a, b) => {
      const scoreA = this.calculateCPUScore(a) / a.price_usd
      const scoreB = this.calculateCPUScore(b) / b.price_usd
      return scoreB - scoreA
    })

    return cpus[0]
  }

  private selectMotherboard(cpu: PCComponent, budget: any, tier: string): PCComponent | null {
    let motherboards = this.components.filter(c => 
      c.category === 'Motherboard' && 
      c.socket === cpu.socket &&
      c.price_usd <= budget.motherboard * 1.2
    )

    if (motherboards.length === 0) return null

    // Préférer la performance tier compatible
    const preferredTier = motherboards.filter(mb => mb.performance_tier === tier)
    if (preferredTier.length > 0) motherboards = preferredTier

    // Trier par rapport qualité/prix
    motherboards.sort((a, b) => b.price_usd - a.price_usd)
    
    return motherboards[0]
  }

  private selectRAM(motherboard: PCComponent, budget: any, tier: string, preferences: UserPreferences): PCComponent | null {
    let rams = this.components.filter(c => 
      c.category === 'RAM' && 
      c.memory_type === motherboard.memory_type &&
      c.price_usd <= budget.ram * 1.2
    )

    if (rams.length === 0) return null

    // Sélectionner la capacité appropriée selon l'usage
    const usageRequiresHighRAM = preferences.primaryUse.some(use => 
      ['Montage Vidéo', 'Modélisation 3D', 'IA & Machine Learning'].includes(use)
    )

    if (usageRequiresHighRAM) {
      const highCapacityRAM = rams.filter(r => parseInt(r.capacity?.replace('GB', '') || '0') >= 32)
      if (highCapacityRAM.length > 0) rams = highCapacityRAM
    }

    // Trier par capacité et vitesse
    rams.sort((a, b) => {
      const capacityA = parseInt(a.capacity?.replace('GB', '') || '0')
      const capacityB = parseInt(b.capacity?.replace('GB', '') || '0')
      const speedA = parseInt(a.speed?.replace('MHz', '') || '0')
      const speedB = parseInt(b.speed?.replace('MHz', '') || '0')
      
      if (capacityA !== capacityB) return capacityB - capacityA
      return speedB - speedA
    })

    return rams[0]
  }

  private selectGPU(preferences: UserPreferences, budget: any, tier: string): PCComponent | null {
    // Vérifier si un GPU est nécessaire
    const needsGPU = preferences.primaryUse.some(use => 
      ['Gaming AAA', 'Gaming Casual', 'Montage Vidéo', 'Modélisation 3D', 'IA & Machine Learning'].includes(use)
    )

    if (!needsGPU) return null

    let gpus = this.components.filter(c => c.category === 'GPU')

    // Filtre par préférence de marque
    if (preferences.brands.preferred.length > 0) {
      const preferred = gpus.filter(c => preferences.brands.preferred.includes(c.brand))
      if (preferred.length > 0) gpus = preferred
    }

    // Filtre par budget
    gpus = gpus.filter(c => c.price_usd <= budget.gpu * 1.2)

    if (gpus.length === 0) return null

    // Sélectionner selon l'usage
    if (preferences.primaryUse.includes('Gaming AAA')) {
      gpus = gpus.filter(g => g.performance_tier !== 'budget')
    }

    // Trier par performance
    gpus.sort((a, b) => {
      const tierOrder = ['budget', 'mid', 'high', 'enthusiast']
      const tierA = tierOrder.indexOf(a.performance_tier)
      const tierB = tierOrder.indexOf(b.performance_tier)
      if (tierA !== tierB) return tierB - tierA
      return b.price_usd - a.price_usd
    })

    return gpus[0]
  }

  private selectStorage(budget: any, tier: string): PCComponent[] {
    let storages = this.components.filter(c => 
      c.category === 'Storage' &&
      c.price_usd <= budget.storage * 1.2
    )

    if (storages.length === 0) return []

    // Préférer NVMe pour les performances
    const nvmeStorages = storages.filter(s => s.interface === 'NVMe')
    if (nvmeStorages.length > 0) {
      // Sélectionner la meilleure capacité dans le budget
      nvmeStorages.sort((a, b) => {
        const capacityA = parseInt(a.capacity?.replace(/[^\d]/g, '') || '0')
        const capacityB = parseInt(b.capacity?.replace(/[^\d]/g, '') || '0')
        return capacityB - capacityA
      })
      
      return [nvmeStorages[0]]
    }

    return [storages[0]]
  }

  private selectPSU(cpu: PCComponent, gpu: PCComponent | null, budget: any): PCComponent | null {
    // Calculer la puissance nécessaire
    const cpuPower = parseInt(cpu.tdp?.replace('W', '') || '65')
    const gpuPower = gpu ? parseInt(gpu.tdp?.replace('W', '') || '150') : 0
    const totalPower = cpuPower + gpuPower + 100 // Marge pour autres composants
    const recommendedPower = Math.ceil(totalPower * 1.3) // 30% de marge

    let psus = this.components.filter(c => 
      c.category === 'PSU' &&
      c.price_usd <= budget.psu * 1.2
    )

    // Filtrer par puissance suffisante
    psus = psus.filter(p => {
      const psuWattage = parseInt(p.wattage?.replace('W', '') || '0')
      return psuWattage >= recommendedPower
    })

    if (psus.length === 0) return null

    // Préférer l'efficacité et la modularité
    psus.sort((a, b) => {
      let scoreA = 0, scoreB = 0
      
      if (a.efficiency?.includes('Gold')) scoreA += 2
      else if (a.efficiency?.includes('Bronze')) scoreA += 1
      
      if (b.efficiency?.includes('Gold')) scoreB += 2
      else if (b.efficiency?.includes('Bronze')) scoreB += 1
      
      if (a.modular) scoreA += 1
      if (b.modular) scoreB += 1
      
      return scoreB - scoreA
    })

    return psus[0]
  }

  private selectCase(motherboard: PCComponent, budget: any): PCComponent | null {
    let cases = this.components.filter(c => 
      c.category === 'Case' &&
      c.price_usd <= budget.case * 1.2
    )

    // Filtrer par compatibilité format
    const caseFormFactors = ['Mini ITX', 'Micro ATX', 'ATX', 'E-ATX']
    const mbFormFactor = motherboard.form_factor
    const mbIndex = caseFormFactors.indexOf(mbFormFactor || '')

    cases = cases.filter(c => {
      const caseIndex = caseFormFactors.indexOf(c.form_factor || '')
      return caseIndex >= mbIndex
    })

    if (cases.length === 0) return null

    // Trier par rapport qualité/prix
    cases.sort((a, b) => a.price_usd - b.price_usd)
    
    return cases[0]
  }

  private selectCooling(cpu: PCComponent, motherboard: PCComponent, budget: any): PCComponent | null {
    const cpuTDP = parseInt(cpu.tdp?.replace('W', '') || '65')

    // Vérifier si refroidisseur inclus
    if (cpu.brand === 'AMD' && cpuTDP <= 65) {
      const stockCooler = this.components.find(c => 
        c.category === 'Cooling' && 
        c.price_usd === 0 &&
        c.included_with?.includes(motherboard.socket || '')
      )
      if (stockCooler) return stockCooler
    }

    let coolers = this.components.filter(c => 
      c.category === 'Cooling' &&
      c.price_usd <= budget.cooling * 1.2 &&
      c.price_usd > 0
    )

    // Filtrer par compatibilité socket
    coolers = coolers.filter(c => 
      !c.sockets || c.sockets.includes(motherboard.socket || '')
    )

    // Filtrer par TDP suffisant
    coolers = coolers.filter(c => {
      const coolerTDP = parseInt(c.tdp_rating?.replace('W', '') || '65')
      return coolerTDP >= cpuTDP
    })

    if (coolers.length === 0) return null

    // Préférer air cooling pour budget, liquid pour high-end
    if (cpuTDP > 100) {
      const liquidCoolers = coolers.filter(c => c.type === 'Liquid')
      if (liquidCoolers.length > 0) coolers = liquidCoolers
    }

    // Trier par TDP rating
    coolers.sort((a, b) => {
      const tdpA = parseInt(a.tdp_rating?.replace('W', '') || '65')
      const tdpB = parseInt(b.tdp_rating?.replace('W', '') || '65')
      return tdpB - tdpA
    })

    return coolers[0]
  }

  // Méthodes utilitaires
  private calculateCPUScore(cpu: PCComponent): number {
    const coreScore = (cpu.cores || 4) * 1.5
    const threadScore = (cpu.threads || 4) * 1.0
    const clockScore = parseFloat(cpu.boost_clock?.replace('GHz', '') || '3') * 2
    return coreScore + threadScore + clockScore
  }

  private calculatePerformanceScore(components: PCBuildComponents): number {
    let score = 0
    
    if (components.cpu) {
      score += this.calculateCPUScore(components.cpu) * 0.3
    }
    
    if (components.gpu) {
      const tierScores = { budget: 20, mid: 40, high: 70, enthusiast: 100 }
      score += tierScores[components.gpu.performance_tier] * 0.4
    }
    
    if (components.ram) {
      const capacity = parseInt(components.ram.capacity?.replace('GB', '') || '16')
      score += Math.min(capacity / 4, 16) * 0.2 // Max 16 points pour 64GB
    }
    
    if (components.storage) {
      const hasNVMe = components.storage.some(s => s.interface === 'NVMe')
      score += hasNVMe ? 10 : 5
    }

    return Math.round(score)
  }

  private calculateValueScore(components: PCBuildComponents, totalPrice: number): number {
    const performanceScore = this.calculatePerformanceScore(components)
    return Math.round((performanceScore / totalPrice) * 1000)
  }

  private generateBuildName(components: PCBuildComponents, tier: string): string {
    const cpuBrand = components.cpu?.brand || 'Custom'
    const gpuBrand = components.gpu?.brand || 'Integrated'
    const tierNames = {
      budget: 'Starter',
      mid: 'Gaming',
      high: 'Enthusiast',
      enthusiast: 'Ultimate'
    }
    
    return `${cpuBrand} ${tierNames[tier as keyof typeof tierNames]} Build`
  }

  private generateBuildDescription(components: PCBuildComponents, preferences: UserPreferences): string {
    const usages = preferences.primaryUse.join(', ')
    const performance = components.gpu ? 'avec GPU dédié' : 'avec graphiques intégrés'
    return `Configuration optimisée pour: ${usages}. Build ${performance} dans votre budget.`
  }

  private fallbackBuild(preferences: UserPreferences, options: BuildGenerationOptions, compatibility: CompatibilityResult): SmartBuild | null {
    // Implémenter une logique de fallback plus simple
    console.warn('Fallback build generation nécessaire', compatibility.errors)
    return this.generateFallbackBuild(preferences, options)
  }

  private generateFallbackBuild(preferences: UserPreferences, options: BuildGenerationOptions): SmartBuild | null {
    // Build minimal fonctionnel
    const budget = options.budget.max
    const cpu = this.components.find(c => c.category === 'CPU' && c.price_usd <= budget * 0.2)
    const motherboard = cpu ? this.components.find(c => c.category === 'Motherboard' && c.socket === cpu.socket) : null
    
    if (!cpu || !motherboard) return null

    const buildComponents: PCBuildComponents = { cpu, motherboard }
    const totalPrice = CompatibilityChecker.calculateTotalPrice(buildComponents)
    const compatibility = CompatibilityChecker.checkBuildCompatibility(buildComponents)

    return {
      id: `fallback-${Date.now()}`,
      name: 'Configuration de Base',
      components: buildComponents,
      totalPrice,
      estimatedPower: CompatibilityChecker.calculateEstimatedPower(buildComponents),
      compatibility,
      performanceScore: 30,
      valueScore: 50,
      description: 'Configuration minimale fonctionnelle dans votre budget.'
    }
  }
} 