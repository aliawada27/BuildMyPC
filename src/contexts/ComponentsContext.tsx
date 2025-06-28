'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface PCComponent {
  id: string
  category: string
  brand: string
  model: string
  price_usd: number
  performance_tier: 'budget' | 'mid' | 'high' | 'enthusiast'
  
  // CPU specific
  socket?: string
  cores?: number
  threads?: number
  base_clock?: string
  boost_clock?: string
  tdp?: string
  integrated_graphics?: boolean
  
  // GPU specific
  vram?: string
  ray_tracing?: boolean
  recommended_psu?: string
  
  // Motherboard specific
  form_factor?: string
  memory_type?: string
  max_memory?: string
  memory_slots?: number
  
  // RAM specific
  capacity?: string
  speed?: string
  
  // Storage specific
  type?: string
  interface?: string
  read_speed?: string
  
  // PSU specific
  wattage?: string
  efficiency?: string
  modular?: boolean
  
  // Case specific
  size?: string
  
  // Cooling specific
  tdp_rating?: string
  included_with?: string[]
  sockets?: string[]
}

export interface ComponentsDatabase {
  components: PCComponent[]
}

interface ComponentsContextType {
  components: PCComponent[]
  loading: boolean
  error: string | null
  getComponentsByCategory: (category: string) => PCComponent[]
  getComponentById: (id: string) => PCComponent | undefined
  getCompatibleComponents: (category: string, filters: any) => PCComponent[]
}

const ComponentsContext = createContext<ComponentsContextType | undefined>(undefined)

export const useComponents = () => {
  const context = useContext(ComponentsContext)
  if (context === undefined) {
    throw new Error('useComponents must be used within a ComponentsProvider')
  }
  return context
}

interface ComponentsProviderProps {
  children: React.ReactNode
}

export const ComponentsProvider: React.FC<ComponentsProviderProps> = ({ children }) => {
  const [components, setComponents] = useState<PCComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadComponents()
  }, [])

  const loadComponents = async () => {
    try {
      setLoading(true)
      setError(null)
      
             // Charger le fichier JSON local
       const response = await fetch('/api/components')
       if (!response.ok) {
         // Fallback: essayer de charger directement depuis le fichier statique
         const fallbackResponse = await import('@/data/pc_parts_full_database.json')
         setComponents(fallbackResponse.components as PCComponent[])
       } else {
         const data: ComponentsDatabase = await response.json()
         setComponents(data.components as PCComponent[])
       }
    } catch (err) {
      console.error('Erreur lors du chargement des composants:', err)
      setError('Impossible de charger la base de données des composants')
      
             // Fallback avec import direct
       try {
         const fallbackData = await import('@/data/pc_parts_full_database.json')
         setComponents(fallbackData.components as any)
         setError(null)
       } catch (fallbackErr) {
         console.error('Erreur fallback:', fallbackErr)
         setError('Base de données indisponible')
       }
    } finally {
      setLoading(false)
    }
  }

  const getComponentsByCategory = (category: string): PCComponent[] => {
    return components.filter(component => component.category === category)
  }

  const getComponentById = (id: string): PCComponent | undefined => {
    return components.find(component => component.id === id)
  }

  const getCompatibleComponents = (category: string, filters: any): PCComponent[] => {
    let filteredComponents = getComponentsByCategory(category)

    // Filtres de compatibilité
    if (filters.socket && category === 'Motherboard') {
      filteredComponents = filteredComponents.filter(
        component => component.socket === filters.socket
      )
    }

    if (filters.socket && category === 'Cooling') {
      filteredComponents = filteredComponents.filter(
        component => !component.sockets || component.sockets.includes(filters.socket)
      )
    }

    if (filters.memory_type && category === 'RAM') {
      filteredComponents = filteredComponents.filter(
        component => component.memory_type === filters.memory_type
      )
    }

    if (filters.form_factor && category === 'Case') {
      filteredComponents = filteredComponents.filter(
        component => component.form_factor === filters.form_factor || 
                    (filters.form_factor === 'Micro ATX' && component.form_factor === 'ATX')
      )
    }

    if (filters.min_wattage && category === 'PSU') {
      filteredComponents = filteredComponents.filter(
        component => {
          const wattage = parseInt(component.wattage?.replace('W', '') || '0')
          return wattage >= filters.min_wattage
        }
      )
    }

    if (filters.performance_tier) {
      const tierOrder = ['budget', 'mid', 'high', 'enthusiast']
      const minTierIndex = tierOrder.indexOf(filters.performance_tier)
      filteredComponents = filteredComponents.filter(
        component => tierOrder.indexOf(component.performance_tier) >= minTierIndex
      )
    }

    if (filters.max_price) {
      filteredComponents = filteredComponents.filter(
        component => component.price_usd <= filters.max_price
      )
    }

    return filteredComponents
  }

  const value: ComponentsContextType = {
    components,
    loading,
    error,
    getComponentsByCategory,
    getComponentById,
    getCompatibleComponents
  }

  return (
    <ComponentsContext.Provider value={value}>
      {children}
    </ComponentsContext.Provider>
  )
} 