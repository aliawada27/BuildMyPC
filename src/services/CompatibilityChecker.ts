import { PCComponent } from '@/contexts/ComponentsContext'

export interface CompatibilityResult {
  isCompatible: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

export interface PCBuildComponents {
  cpu?: PCComponent
  gpu?: PCComponent
  motherboard?: PCComponent
  ram?: PCComponent
  storage?: PCComponent[]
  psu?: PCComponent
  case?: PCComponent
  cooling?: PCComponent
}

export class CompatibilityChecker {
  
  static checkBuildCompatibility(components: PCBuildComponents): CompatibilityResult {
    const result: CompatibilityResult = {
      isCompatible: true,
      errors: [],
      warnings: [],
      suggestions: []
    }

    // Vérifications obligatoires
    this.checkCPUMotherboardCompatibility(components, result)
    this.checkRAMMotherboardCompatibility(components, result)
    this.checkPSUPowerRequirements(components, result)
    this.checkCaseMotherboardCompatibility(components, result)
    this.checkCoolingCompatibility(components, result)

    // Vérifications recommandées (warnings)
    this.checkPerformanceBalance(components, result)
    this.checkPowerEfficiency(components, result)

    // Suggestions d'optimisation
    this.generateOptimizationSuggestions(components, result)

    result.isCompatible = result.errors.length === 0

    return result
  }

  private static checkCPUMotherboardCompatibility(
    components: PCBuildComponents, 
    result: CompatibilityResult
  ) {
    const { cpu, motherboard } = components

    if (!cpu || !motherboard) {
      if (!cpu) result.errors.push('CPU manquant')
      if (!motherboard) result.errors.push('Carte mère manquante')
      return
    }

    if (cpu.socket !== motherboard.socket) {
      result.errors.push(
        `Incompatibilité socket: CPU ${cpu.socket} vs Carte mère ${motherboard.socket}`
      )
    }
  }

  private static checkRAMMotherboardCompatibility(
    components: PCBuildComponents, 
    result: CompatibilityResult
  ) {
    const { ram, motherboard } = components

    if (!ram || !motherboard) {
      if (!ram) result.errors.push('Mémoire RAM manquante')
      return
    }

    if (ram.memory_type !== motherboard.memory_type) {
      result.errors.push(
        `Incompatibilité mémoire: RAM ${ram.memory_type} vs Carte mère ${motherboard.memory_type}`
      )
    }

    // Vérifier la capacité maximale
    const ramCapacity = parseInt(ram.capacity?.replace('GB', '') || '0')
    const maxCapacity = parseInt(motherboard.max_memory?.replace('GB', '') || '0')
    
    if (ramCapacity > maxCapacity) {
      result.warnings.push(
        `Capacité RAM (${ram.capacity}) dépasse le maximum supporté (${motherboard.max_memory})`
      )
    }
  }

  private static checkPSUPowerRequirements(
    components: PCBuildComponents, 
    result: CompatibilityResult
  ) {
    const { cpu, gpu, psu } = components

    if (!psu) {
      result.errors.push('Alimentation manquante')
      return
    }

    // Calculer la consommation totale estimée
    let totalPower = 0
    let recommendations: string[] = []

    if (cpu) {
      const cpuPower = parseInt(cpu.tdp?.replace('W', '') || '65')
      totalPower += cpuPower
    }

    if (gpu) {
      const gpuPower = parseInt(gpu.tdp?.replace('W', '') || '150')
      totalPower += gpuPower
      
      // Vérifier les recommandations du GPU
      if (gpu.recommended_psu) {
        const recommendedPower = parseInt(gpu.recommended_psu.replace('W', ''))
        recommendations.push(`GPU recommande ${gpu.recommended_psu}`)
      }
    }

    // Ajouter 100W pour les autres composants (carte mère, RAM, stockage, ventilateurs)
    totalPower += 100

    const psuWattage = parseInt(psu.wattage?.replace('W', '') || '0')

    // Vérifier que l'alimentation a au moins 20% de marge
    const recommendedPSU = Math.ceil(totalPower * 1.2)

    if (psuWattage < totalPower) {
      result.errors.push(
        `Alimentation insuffisante: ${psu.wattage} pour ${totalPower}W requis`
      )
    } else if (psuWattage < recommendedPSU) {
      result.warnings.push(
        `Alimentation limite: ${psu.wattage} recommandé ${recommendedPSU}W pour 20% de marge`
      )
    }

    if (recommendations.length > 0) {
      result.suggestions.push(...recommendations)
    }
  }

  private static checkCaseMotherboardCompatibility(
    components: PCBuildComponents, 
    result: CompatibilityResult
  ) {
    const { motherboard, case: pcCase } = components

    if (!pcCase || !motherboard) {
      if (!pcCase) result.warnings.push('Boîtier non sélectionné')
      return
    }

    // Vérifier la compatibilité des formats
    const caseFormFactors = ['Mini ITX', 'Micro ATX', 'ATX', 'E-ATX']
    const mbFormFactor = motherboard.form_factor
    const caseFormFactor = pcCase.form_factor

    const mbIndex = caseFormFactors.indexOf(mbFormFactor || '')
    const caseIndex = caseFormFactors.indexOf(caseFormFactor || '')

    if (mbIndex > caseIndex) {
      result.errors.push(
        `Boîtier trop petit: ${caseFormFactor} ne peut pas accueillir ${mbFormFactor}`
      )
    }
  }

  private static checkCoolingCompatibility(
    components: PCBuildComponents, 
    result: CompatibilityResult
  ) {
    const { cpu, cooling, motherboard } = components

    if (!cpu) return

    const cpuTDP = parseInt(cpu.tdp?.replace('W', '') || '65')

    if (!cooling) {
      // Vérifier si le CPU a un refroidisseur inclus
      if (cpu.brand === 'AMD' && cpuTDP <= 65) {
        result.suggestions.push('CPU AMD inclut un refroidisseur stock')
        return
      }
      
      if (cpuTDP > 65) {
        result.warnings.push('Refroidissement recommandé pour ce CPU')
      }
      return
    }

    const coolingTDP = parseInt(cooling.tdp_rating?.replace('W', '') || '65')

    if (coolingTDP < cpuTDP) {
      result.warnings.push(
        `Refroidissement limite: ${cooling.tdp_rating} pour CPU ${cpu.tdp}`
      )
    }

    // Vérifier la compatibilité socket
    if (cooling.sockets && motherboard?.socket) {
      if (!cooling.sockets.includes(motherboard.socket)) {
        result.errors.push(
          `Refroidissement incompatible avec socket ${motherboard.socket}`
        )
      }
    }
  }

  private static checkPerformanceBalance(
    components: PCBuildComponents, 
    result: CompatibilityResult
  ) {
    const { cpu, gpu } = components

    if (!cpu || !gpu) return

    const tierOrder = ['budget', 'mid', 'high', 'enthusiast']
    const cpuTierIndex = tierOrder.indexOf(cpu.performance_tier)
    const gpuTierIndex = tierOrder.indexOf(gpu.performance_tier)

    const difference = Math.abs(cpuTierIndex - gpuTierIndex)

    if (difference > 1) {
      if (cpuTierIndex > gpuTierIndex) {
        result.warnings.push(
          'CPU potentiellement bridé par le GPU (déséquilibre performance)'
        )
      } else {
        result.warnings.push(
          'GPU potentiellement bridé par le CPU (déséquilibre performance)'
        )
      }
    }
  }

  private static checkPowerEfficiency(
    components: PCBuildComponents, 
    result: CompatibilityResult
  ) {
    const { psu } = components

    if (!psu) return

    if (psu.efficiency === '80+ Bronze' || !psu.efficiency) {
      result.suggestions.push(
        'Considérez une alimentation 80+ Gold pour une meilleure efficacité'
      )
    }

    if (!psu.modular) {
      result.suggestions.push(
        'Alimentation modulaire recommandée pour un câblage plus propre'
      )
    }
  }

  private static generateOptimizationSuggestions(
    components: PCBuildComponents, 
    result: CompatibilityResult
  ) {
    const { cpu, gpu, ram, storage } = components

    // Suggestion stockage
    if (storage && storage.length > 0) {
      const hasNVMe = storage.some(s => s.interface === 'NVMe')
      if (!hasNVMe) {
        result.suggestions.push(
          'SSD NVMe recommandé pour de meilleures performances'
        )
      }
    }

    // Suggestion RAM
    if (ram && cpu) {
      const ramCapacity = parseInt(ram.capacity?.replace('GB', '') || '16')
      
      if (cpu.performance_tier === 'high' || cpu.performance_tier === 'enthusiast') {
        if (ramCapacity < 32) {
          result.suggestions.push(
            '32GB de RAM recommandé pour les CPU haut de gamme'
          )
        }
      }
    }

    // Suggestion gaming
    if (gpu && gpu.performance_tier === 'budget') {
      result.suggestions.push(
        'Pour du gaming 1440p ou ray tracing, considérez un GPU plus puissant'
      )
    }
  }

  static calculateEstimatedPower(components: PCBuildComponents): number {
    let totalPower = 0

    if (components.cpu) {
      totalPower += parseInt(components.cpu.tdp?.replace('W', '') || '65')
    }

    if (components.gpu) {
      totalPower += parseInt(components.gpu.tdp?.replace('W', '') || '150')
    }

    // Autres composants
    totalPower += 100

    return totalPower
  }

  static calculateTotalPrice(components: PCBuildComponents): number {
    let totalPrice = 0

    Object.values(components).forEach(component => {
      if (Array.isArray(component)) {
        // Pour le stockage qui peut être un array
        component.forEach(item => {
          totalPrice += item.price_usd || 0
        })
      } else if (component) {
        totalPrice += component.price_usd || 0
      }
    })

    return totalPrice
  }
} 