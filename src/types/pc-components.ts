export interface PCComponent {
  id: string
  name: string
  brand: string
  category: ComponentCategory
  price: number
  specs: Record<string, any>
  compatibility: ComponentCompatibility
  powerConsumption?: number
  pros: string[]
  cons: string[]
  image?: string
  vendorLinks: VendorLink[]
}

export type ComponentCategory = 
  | 'cpu'
  | 'gpu'
  | 'motherboard'
  | 'memory'
  | 'storage'
  | 'power-supply'
  | 'cooling'
  | 'case'

export interface ComponentCompatibility {
  socket?: string
  chipset?: string
  formFactor?: string
  memoryType?: string
  slots?: number
  maxMemoryCapacity?: number
  pciSlots?: number
  powerConnectors?: string[]
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
}

export interface VendorLink {
  vendor: string
  url: string
  price: number
  inStock: boolean
}

export interface UserPreferences {
  id: string
  primaryUse: string[]
  budget: {
    min: number
    max: number
  }
  performance: 'budget' | 'balanced' | 'high-end'
  brands: {
    preferred: string[]
    avoid: string[]
  }
  priorities: {
    quietOperation: number
    energyEfficiency: number
    futureProofing: number
    aesthetics: number
  }
  specialRequirements: string[]
}

export interface PCBuild {
  id: string
  name: string
  components: {
    cpu?: PCComponent
    gpu?: PCComponent
    motherboard?: PCComponent
    memory?: PCComponent[]
    storage?: PCComponent[]
    powerSupply?: PCComponent
    cooling?: PCComponent
    case?: PCComponent
  }
  totalPrice: number
  estimatedPower: number
  compatibility: {
    isValid: boolean
    warnings: string[]
    errors: string[]
  }
  createdAt: Date
  userPreferences: UserPreferences
}

export interface QuestionnaireStep {
  id: string
  title: string
  description: string
  questions: Question[]
}

export interface Question {
  id: string
  type: 'multiple-choice' | 'range' | 'checkbox' | 'text'
  question: string
  options?: string[]
  min?: number
  max?: number
  step?: number
  required: boolean
} 