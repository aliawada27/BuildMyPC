import { PCComponent, UserPreferences, PCBuild, ComponentCategory } from '@/types/pc-components'
import { pcComponentsDatabase } from '@/data/components-database'
import { v4 as uuidv4 } from 'uuid'

export class RecommendationEngine {
  private components: PCComponent[]
  
  constructor() {
    this.components = pcComponentsDatabase
  }

  generateBuild(preferences: UserPreferences): PCBuild {
    const recommendedComponents = this.selectComponents(preferences)
    const totalPrice = this.calculateTotalPrice(recommendedComponents)
    const estimatedPower = this.calculatePowerConsumption(recommendedComponents)
    const compatibility = this.checkCompatibility(recommendedComponents)

    return {
      id: uuidv4(),
      name: `${preferences.performance.charAt(0).toUpperCase() + preferences.performance.slice(1)} Build`,
      components: recommendedComponents,
      totalPrice,
      estimatedPower,
      compatibility,
      createdAt: new Date(),
      userPreferences: preferences
    }
  }

  private selectComponents(preferences: UserPreferences) {
    const components: PCBuild['components'] = {}
    
    // Select CPU based on performance level and use case
    components.cpu = this.selectCPU(preferences)
    
    // Select GPU based on gaming needs and budget
    components.gpu = this.selectGPU(preferences, components.cpu)
    
    // Select motherboard compatible with CPU
    components.motherboard = this.selectMotherboard(preferences, components.cpu)
    
    // Select memory compatible with motherboard/CPU
    components.memory = [this.selectMemory(preferences, components.cpu, components.motherboard)]
    
    // Select storage based on performance needs
    components.storage = [this.selectStorage(preferences)]
    
    // Select PSU based on total system power
    const estimatedPower = this.estimateSystemPower(components)
    components.powerSupply = this.selectPowerSupply(preferences, estimatedPower)
    
    // Select case that fits everything
    components.case = this.selectCase(preferences, components.motherboard)

    return components
  }

  private selectCPU(preferences: UserPreferences): PCComponent {
    const cpus = this.components.filter(c => c.category === 'cpu')
    
    // Filter by brand preference
    let filteredCPUs = cpus
    if (preferences.brands.preferred.includes('AMD') && !preferences.brands.preferred.includes('Intel')) {
      filteredCPUs = cpus.filter(c => c.brand === 'AMD')
    } else if (preferences.brands.preferred.includes('Intel') && !preferences.brands.preferred.includes('AMD')) {
      filteredCPUs = cpus.filter(c => c.brand === 'Intel')
    }

    // Score CPUs based on preferences
    const scoredCPUs = filteredCPUs.map(cpu => ({
      component: cpu,
      score: this.scoreCPU(cpu, preferences)
    }))

    // Sort by score and filter by budget
    scoredCPUs.sort((a, b) => b.score - a.score)
    
    const affordableCPUs = scoredCPUs.filter(scored => 
      scored.component.price <= preferences.budget.max * 0.4 // CPU should be max 40% of budget
    )

    return affordableCPUs.length > 0 ? affordableCPUs[0].component : scoredCPUs[0].component
  }

  private scoreCPU(cpu: PCComponent, preferences: UserPreferences): number {
    let score = 0
    
    // Base performance scoring
    const cores = cpu.specs.cores || 4
    const threads = cpu.specs.threads || cores
    const boostClock = cpu.specs.boostClock || 3.0
    
    // Gaming workload scoring
    if (preferences.primaryUse.includes('Gaming (AAA titles)')) {
      score += Math.min(cores * 10, 80) // Diminishing returns after 8 cores
      score += boostClock * 15
    }
    
    // Content creation scoring
    if (preferences.primaryUse.includes('Content Creation (Video Editing)')) {
      score += threads * 8 // More threads = better for video editing
      score += cores * 12
    }
    
    // Programming/Development scoring
    if (preferences.primaryUse.includes('Programming/Development')) {
      score += cores * 8
      score += threads * 5
    }

    // Budget efficiency scoring
    const pricePerformance = score / cpu.price
    score += pricePerformance * 20

    // Energy efficiency bonus
    if (preferences.priorities.energyEfficiency >= 7) {
      const tdp = cpu.specs.tdp || 100
      score += Math.max(0, (100 - tdp) * 2) // Lower TDP = higher score
    }

    return score
  }

  private selectGPU(preferences: UserPreferences, cpu?: PCComponent): PCComponent {
    const gpus = this.components.filter(c => c.category === 'gpu')
    
    // If no gaming, select a basic GPU or integrated
    const isGaming = preferences.primaryUse.some(use => use.includes('Gaming'))
    if (!isGaming) {
      return gpus.sort((a, b) => a.price - b.price)[0] // Cheapest GPU
    }

    // Filter by brand preference
    let filteredGPUs = gpus
    if (preferences.brands.preferred.includes('NVIDIA') && !preferences.brands.preferred.includes('AMD')) {
      filteredGPUs = gpus.filter(c => c.brand === 'NVIDIA')
    } else if (preferences.brands.preferred.includes('AMD') && !preferences.brands.preferred.includes('NVIDIA')) {
      filteredGPUs = gpus.filter(c => c.brand === 'AMD')
    }

    // Score GPUs
    const scoredGPUs = filteredGPUs.map(gpu => ({
      component: gpu,
      score: this.scoreGPU(gpu, preferences)
    }))

    scoredGPUs.sort((a, b) => b.score - a.score)
    
    // GPU should be 25-40% of budget depending on use case
    const gpuBudgetPercent = preferences.primaryUse.includes('Gaming (AAA titles)') ? 0.4 : 0.3
    const maxGPUPrice = preferences.budget.max * gpuBudgetPercent
    
    const affordableGPUs = scoredGPUs.filter(scored => scored.component.price <= maxGPUPrice)
    return affordableGPUs.length > 0 ? affordableGPUs[0].component : scoredGPUs[0].component
  }

  private scoreGPU(gpu: PCComponent, preferences: UserPreferences): number {
    let score = 0
    
    // Base performance indicators
    const memory = parseInt(gpu.specs.memory) || 8
    const boostClock = gpu.specs.boostClock || 1500
    
    // Gaming performance scoring
    if (preferences.primaryUse.includes('Gaming (AAA titles)')) {
      score += memory * 15 // VRAM is crucial for modern games
      score += boostClock * 0.1
    }
    
    // Content creation scoring
    if (preferences.primaryUse.includes('Content Creation (Video Editing)')) {
      score += memory * 20 // Video editing needs lots of VRAM
    }

    // Budget efficiency
    const pricePerformance = score / gpu.price
    score += pricePerformance * 25

    return score
  }

  private selectMotherboard(preferences: UserPreferences, cpu?: PCComponent): PCComponent {
    const motherboards = this.components.filter(c => c.category === 'motherboard')
    
    // Filter compatible motherboards
    const compatibleMobos = cpu ? 
      motherboards.filter(mobo => mobo.compatibility.socket === cpu.compatibility.socket) :
      motherboards

    // Score motherboards
    const scoredMobos = compatibleMobos.map(mobo => ({
      component: mobo,
      score: this.scoreMotherboard(mobo, preferences)
    }))

    scoredMobos.sort((a, b) => b.score - a.score)
    
    // Motherboard should be 10-15% of budget
    const maxMoboPrice = preferences.budget.max * 0.15
    const affordableMobos = scoredMobos.filter(scored => scored.component.price <= maxMoboPrice)
    
    return affordableMobos.length > 0 ? affordableMobos[0].component : scoredMobos[0].component
  }

  private scoreMotherboard(mobo: PCComponent, preferences: UserPreferences): number {
    let score = 50 // Base score
    
    // Feature scoring
    if (mobo.specs.wifi) score += 30 // WiFi is convenient
    if (mobo.specs.usb && mobo.specs.usb.includes('USB-C')) score += 20
    
    // Future proofing
    if (preferences.priorities.futureProofing >= 7) {
      if (mobo.specs.expansion?.some((slot: string) => slot.includes('PCIe 5.0'))) {
        score += 40
      }
    }

    return score
  }

  private selectMemory(preferences: UserPreferences, cpu?: PCComponent, motherboard?: PCComponent): PCComponent {
    const memory = this.components.filter(c => c.category === 'memory')
    
    // Filter compatible memory
    const memoryType = cpu?.compatibility.memoryType || motherboard?.compatibility.memoryType || 'DDR4'
    const compatibleMemory = memory.filter(mem => 
      memoryType.includes(mem.compatibility.memoryType || 'DDR4')
    )

    // Score based on capacity and speed
    const scoredMemory = compatibleMemory.map(mem => ({
      component: mem,
      score: this.scoreMemory(mem, preferences)
    }))

    scoredMemory.sort((a, b) => b.score - a.score)
    
    // Memory should be 10-15% of budget
    const maxMemoryPrice = preferences.budget.max * 0.15
    const affordableMemory = scoredMemory.filter(scored => scored.component.price <= maxMemoryPrice)
    
    return affordableMemory.length > 0 ? affordableMemory[0].component : scoredMemory[0].component
  }

  private scoreMemory(memory: PCComponent, preferences: UserPreferences): number {
    let score = 0
    
    const capacity = memory.specs.capacity || 16
    const speed = memory.specs.speed || 3200
    
    // Capacity scoring based on use case
    if (preferences.primaryUse.includes('Content Creation (Video Editing)')) {
      score += Math.min(capacity * 3, 96) // Diminishing returns after 32GB
    } else if (preferences.primaryUse.includes('Gaming (AAA titles)')) {
      score += Math.min(capacity * 2, 64) // Diminishing returns after 32GB
    } else {
      score += Math.min(capacity * 1.5, 48) // Basic usage
    }
    
    // Speed scoring
    score += speed * 0.01
    
    // Price efficiency
    score += (score / memory.price) * 10
    
    return score
  }

  private selectStorage(preferences: UserPreferences): PCComponent {
    const storage = this.components.filter(c => c.category === 'storage')
    
    const scoredStorage = storage.map(stor => ({
      component: stor,
      score: this.scoreStorage(stor, preferences)
    }))

    scoredStorage.sort((a, b) => b.score - a.score)
    
    // Storage should be 5-10% of budget
    const maxStoragePrice = preferences.budget.max * 0.1
    const affordableStorage = scoredStorage.filter(scored => scored.component.price <= maxStoragePrice)
    
    return affordableStorage.length > 0 ? affordableStorage[0].component : scoredStorage[0].component
  }

  private scoreStorage(storage: PCComponent, preferences: UserPreferences): number {
    let score = 0
    
    const capacity = storage.specs.capacity || 500
    const readSpeed = storage.specs.readSpeed || 500
    const isSSD = storage.specs.type?.includes('SSD')
    
    // Capacity scoring
    score += Math.min(capacity * 0.1, 100)
    
    // Speed scoring (important for content creation and gaming)
    if (preferences.primaryUse.some(use => use.includes('Content Creation') || use.includes('Gaming'))) {
      score += readSpeed * 0.01
    }
    
    // SSD bonus
    if (isSSD) score += 50
    
    // Price efficiency
    score += (score / storage.price) * 5
    
    return score
  }

  private selectPowerSupply(preferences: UserPreferences, estimatedPower: number): PCComponent {
    const psus = this.components.filter(c => c.category === 'power-supply')
    
    // Filter PSUs with adequate wattage (20% headroom)
    const requiredWattage = estimatedPower * 1.2
    const adequatePSUs = psus.filter(psu => (psu.specs.wattage || 500) >= requiredWattage)
    
    const scoredPSUs = adequatePSUs.map(psu => ({
      component: psu,
      score: this.scorePSU(psu, preferences)
    }))

    scoredPSUs.sort((a, b) => b.score - a.score)
    
    return scoredPSUs.length > 0 ? scoredPSUs[0].component : psus[0]
  }

  private scorePSU(psu: PCComponent, preferences: UserPreferences): number {
    let score = 0
    
    // Efficiency scoring
    const efficiency = psu.specs.efficiency || '80+ Bronze'
    if (efficiency.includes('Gold')) score += 30
    else if (efficiency.includes('Silver')) score += 20
    else if (efficiency.includes('Bronze')) score += 10
    
    // Modular bonus
    if (psu.specs.modular === 'Fully Modular') score += 25
    else if (psu.specs.modular === 'Semi Modular') score += 15
    
    // Quiet operation bonus
    if (preferences.priorities.quietOperation >= 7) {
      score += 20 // Assume higher quality PSUs are quieter
    }
    
    return score
  }

  private selectCase(preferences: UserPreferences, motherboard?: PCComponent): PCComponent {
    const cases = this.components.filter(c => c.category === 'case')
    
    // Filter compatible cases
    const formFactor = motherboard?.compatibility.formFactor || 'ATX'
    const compatibleCases = cases.filter(caseComp => 
      caseComp.specs.motherboardSupport?.includes(formFactor)
    )

    const scoredCases = compatibleCases.map(caseComp => ({
      component: caseComp,
      score: this.scoreCase(caseComp, preferences)
    }))

    scoredCases.sort((a, b) => b.score - a.score)
    
    return scoredCases.length > 0 ? scoredCases[0].component : cases[0]
  }

  private scoreCase(caseComp: PCComponent, preferences: UserPreferences): number {
    let score = 50 // Base score
    
    // Build quality indicators
    score += caseComp.pros.length * 5
    
    // Size preference
    // This would need more complex logic based on size constraints
    
    return score
  }

  private estimateSystemPower(components: PCBuild['components']): number {
    let totalPower = 0
    
    if (components.cpu) totalPower += components.cpu.powerConsumption || 65
    if (components.gpu) totalPower += components.gpu.powerConsumption || 150
    if (components.memory) totalPower += components.memory.length * 10
    if (components.storage) totalPower += components.storage.length * 10
    
    // Add 20% for other components (fans, etc.)
    return Math.round(totalPower * 1.2)
  }

  private calculateTotalPrice(components: PCBuild['components']): number {
    let total = 0
    
    Object.values(components).forEach(component => {
      if (Array.isArray(component)) {
        total += component.reduce((sum, comp) => sum + comp.price, 0)
      } else if (component) {
        total += component.price
      }
    })
    
    return total
  }

  private calculatePowerConsumption(components: PCBuild['components']): number {
    return this.estimateSystemPower(components)
  }

  private checkCompatibility(components: PCBuild['components']): PCBuild['compatibility'] {
    const warnings: string[] = []
    const errors: string[] = []
    
    // Check CPU/Motherboard compatibility
    if (components.cpu && components.motherboard) {
      if (components.cpu.compatibility.socket !== components.motherboard.compatibility.socket) {
        errors.push('CPU socket does not match motherboard socket')
      }
    }
    
    // Check memory compatibility
    if (components.memory && components.motherboard) {
      const memoryType = components.memory[0]?.compatibility.memoryType
      const moboMemoryType = components.motherboard.compatibility.memoryType
      
      if (memoryType && moboMemoryType && !moboMemoryType.includes(memoryType)) {
        errors.push('Memory type not compatible with motherboard')
      }
    }
    
    // Check power supply adequacy
    if (components.powerSupply) {
      const requiredPower = this.estimateSystemPower(components)
      const psuWattage = components.powerSupply.specs.wattage || 500
      
      if (psuWattage < requiredPower) {
        errors.push('Power supply wattage insufficient for system requirements')
      } else if (psuWattage < requiredPower * 1.1) {
        warnings.push('Power supply wattage is close to system requirements')
      }
    }
    
    return {
      isValid: errors.length === 0,
      warnings,
      errors
    }
  }
} 