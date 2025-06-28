import { QuestionnaireStep } from '@/types/pc-components'

export interface ModernQuestionnaireStep extends QuestionnaireStep {
  icon: string
  color: string
  estimatedTime: string
}

export interface Question {
  id: string
  type: 'checkbox' | 'multiple-choice' | 'range' | 'text'
  question: string
  options?: string[]
  min?: number
  max?: number
  step?: number
  required: boolean
}

export interface UsageOption {
  id: string
  label: string
  description: string
  icon: string
  recommendedSpecs: {
    cpu: string
    gpu: string
    ram: string
    storage: string
  }
}

export const usageOptions: UsageOption[] = [
  {
    id: 'gaming-aaa',
    label: 'Gaming AAA',
    description: 'Jeux récents en haute qualité',
    icon: '🎮',
    recommendedSpecs: {
      cpu: 'Performant',
      gpu: 'Très performant',
      ram: '16-32GB',
      storage: '1TB NVMe SSD'
    }
  },
  {
    id: 'gaming-casual',
    label: 'Gaming Casual',
    description: 'Jeux indépendants et anciens',
    icon: '🕹️',
    recommendedSpecs: {
      cpu: 'Moyen',
      gpu: 'Moyen',
      ram: '8-16GB',
      storage: '500GB NVMe SSD'
    }
  },
  {
    id: 'content-video',
    label: 'Montage Vidéo',
    description: '4K, rendu, streaming',
    icon: '🎬',
    recommendedSpecs: {
      cpu: 'Très performant',
      gpu: 'Performant',
      ram: '32-64GB',
      storage: '2TB NVMe SSD'
    }
  },
  {
    id: 'content-photo',
    label: 'Retouche Photo',
    description: 'Photoshop, Lightroom',
    icon: '📸',
    recommendedSpecs: {
      cpu: 'Performant',
      gpu: 'Moyen',
      ram: '16-32GB',
      storage: '1TB NVMe SSD'
    }
  },
  {
    id: 'programming',
    label: 'Développement',
    description: 'IDE, compilation, virtualisation',
    icon: '💻',
    recommendedSpecs: {
      cpu: 'Performant',
      gpu: 'Basique',
      ram: '16-32GB',
      storage: '1TB NVMe SSD'
    }
  },
  {
    id: 'office',
    label: 'Bureautique',
    description: 'Office, navigation web',
    icon: '📄',
    recommendedSpecs: {
      cpu: 'Basique',
      gpu: 'Intégré',
      ram: '8-16GB',
      storage: '512GB SSD'
    }
  },
  {
    id: 'streaming',
    label: 'Streaming',
    description: 'OBS, encodage en direct',
    icon: '📺',
    recommendedSpecs: {
      cpu: 'Très performant',
      gpu: 'Performant',
      ram: '16-32GB',
      storage: '1TB NVMe SSD'
    }
  },
  {
    id: 'modeling-3d',
    label: 'Modélisation 3D',
    description: 'Blender, CAD, architecture',
    icon: '🏗️',
    recommendedSpecs: {
      cpu: 'Très performant',
      gpu: 'Très performant',
      ram: '32-64GB',
      storage: '2TB NVMe SSD'
    }
  },
  {
    id: 'ai-ml',
    label: 'IA & Machine Learning',
    description: 'TensorFlow, PyTorch',
    icon: '🤖',
    recommendedSpecs: {
      cpu: 'Très performant',
      gpu: 'Très performant',
      ram: '128GB DDR5',
      storage: '4TB NVMe SSD'
    }
  },
  {
    id: 'general',
    label: 'Usage Général',
    description: 'Multitâche, polyvalent',
    icon: '🌐',
    recommendedSpecs: {
      cpu: 'Moyen',
      gpu: 'Moyen',
      ram: '16GB',
      storage: '512GB NVMe SSD'
    }
  }
]

export const modernQuestionnaireSteps: ModernQuestionnaireStep[] = [
  {
    id: 'usage',
    title: 'Comment allez-vous utiliser votre PC ?',
    description: 'Sélectionnez vos principales activités pour adapter les recommandations à vos besoins spécifiques.',
    icon: '🎯',
    color: 'blue',
    estimatedTime: '2 min',
    questions: [
      {
        id: 'primary-use',
        type: 'checkbox',
        question: 'Quelles seront vos principales activités ?',
        options: usageOptions.map(option => option.id),
        required: true
      },
      {
        id: 'gaming-resolution',
        type: 'multiple-choice',
        question: 'Si vous jouez, à quelle résolution ?',
        options: [
          '1080p (Full HD)',
          '1440p (2K)',
          '4K (Ultra HD)',
          'Je ne joue pas'
        ],
        required: false
      },
      {
        id: 'performance-level',
        type: 'multiple-choice',
        question: 'Quel niveau de performance visez-vous ?',
        options: [
          'Économique (Ça fonctionne)',
          'Équilibré (Bon rapport qualité/prix)',
          'Performant (Hautes performances)',
          'Extrême (Le meilleur possible)'
        ],
        required: true
      }
    ]
  },
  {
    id: 'budget',
    title: 'Quel est votre budget ?',
    description: 'Définissez votre budget pour que nous puissions optimiser le choix des composants selon vos moyens.',
    icon: '💰',
    color: 'green',
    estimatedTime: '1 min',
    questions: [
      {
        id: 'total-budget',
        type: 'range',
        question: 'Budget total pour le PC (hors périphériques)',
        min: 500,
        max: 5000,
        step: 50,
        required: true
      },
      {
        id: 'flexibility',
        type: 'multiple-choice',
        question: 'Quelle flexibilité avez-vous sur ce budget ?',
        options: [
          'Strict - Ne peut pas dépasser',
          'Flexible - Jusqu\'à 10% de plus',
          'Très flexible - Jusqu\'à 20% pour des gains significatifs'
        ],
        required: true
      }
    ]
  },
  {
    id: 'preferences',
    title: 'Préférences et priorités',
    description: 'Indiquez vos préférences de marques et ce qui est le plus important pour vous.',
    icon: '⚖️',
    color: 'purple',
    estimatedTime: '2 min',
    questions: [
      {
        id: 'cpu-preference',
        type: 'multiple-choice',
        question: 'Avez-vous une préférence pour le processeur ?',
        options: ['AMD', 'Intel', 'Aucune préférence'],
        required: false
      },
      {
        id: 'gpu-preference',
        type: 'multiple-choice',
        question: 'Avez-vous une préférence pour la carte graphique ?',
        options: ['NVIDIA', 'AMD', 'Aucune préférence'],
        required: false
      },
      {
        id: 'quiet-operation',
        type: 'range',
        question: 'Importance du fonctionnement silencieux',
        min: 1,
        max: 10,
        step: 1,
        required: true
      },
      {
        id: 'future-proofing',
        type: 'range',
        question: 'Importance de l\'évolutivité future',
        min: 1,
        max: 10,
        step: 1,
        required: true
      },
      {
        id: 'energy-efficiency',
        type: 'range',
        question: 'Importance de l\'efficacité énergétique',
        min: 1,
        max: 10,
        step: 1,
        required: true
      }
    ]
  },
  {
    id: 'requirements',
    title: 'Exigences spéciales',
    description: 'Derniers détails pour parfaire votre configuration idéale.',
    icon: '🔧',
    color: 'orange',
    estimatedTime: '1 min',
    questions: [
      {
        id: 'size-constraint',
        type: 'multiple-choice',
        question: 'Avez-vous des contraintes de taille ?',
        options: [
          'Aucune contrainte',
          'Doit tenir dans un petit espace',
          'Préfère un build compact',
          'Tour complète acceptée'
        ],
        required: false
      },
      {
        id: 'existing-parts',
        type: 'checkbox',
        question: 'Avez-vous des composants à réutiliser ?',
        options: [
          'Écran',
          'Clavier & Souris',
          'Disques de stockage',
          'Carte graphique',
          'Boîtier',
          'Alimentation',
          'Rien - Tout à neuf'
        ],
        required: false
      },
      {
        id: 'additional-requirements',
        type: 'text',
        question: 'Autres exigences ou préférences particulières ?',
        required: false
      }
    ]
  }
]

// Fonctions d'internationalisation
export const getModernQuestionnaireSteps = (t: (key: string, params?: any) => string): ModernQuestionnaireStep[] => [
  {
    id: 'usage',
    title: t('questions.usage.title'),
    description: t('questions.usage.description'),
    icon: '🎯',
    color: 'blue',
    estimatedTime: '2 min',
    questions: [
      {
        id: 'primary-use',
        type: 'checkbox',
        question: t('questions.usage.primaryUse'),
        options: usageOptions.map(option => option.id),
        required: true
      },
      {
        id: 'gaming-resolution',
        type: 'multiple-choice',
        question: t('questions.usage.gamingResolution'),
        options: [
          t('options.resolutions.1080p'),
          t('options.resolutions.1440p'),
          t('options.resolutions.4k'),
          t('options.resolutions.noGaming')
        ],
        required: false
      },
      {
        id: 'performance-level',
        type: 'multiple-choice',
        question: t('questions.usage.performanceLevel'),
        options: [
          t('options.performance.budget'),
          t('options.performance.balanced'),
          t('options.performance.high'),
          t('options.performance.extreme')
        ],
        required: true
      }
    ]
  },
  {
    id: 'budget',
    title: t('questions.budget.title'),
    description: t('questions.budget.description'),
    icon: '💰',
    color: 'green',
    estimatedTime: '1 min',
    questions: [
      {
        id: 'total-budget',
        type: 'range',
        question: t('questions.budget.totalBudget'),
        min: 500,
        max: 5000,
        step: 50,
        required: true
      },
      {
        id: 'flexibility',
        type: 'multiple-choice',
        question: t('questions.budget.flexibility'),
        options: [
          t('options.flexibility.strict'),
          t('options.flexibility.flexible'),
          t('options.flexibility.veryFlexible')
        ],
        required: true
      }
    ]
  },
  {
    id: 'preferences',
    title: t('questions.preferences.title'),
    description: t('questions.preferences.description'),
    icon: '⚖️',
    color: 'purple',
    estimatedTime: '2 min',
    questions: [
      {
        id: 'cpu-preference',
        type: 'multiple-choice',
        question: t('questions.preferences.cpuPreference'),
        options: [
          t('options.brands.noPreference'),
          t('options.brands.intel'),
          t('options.brands.amd')
        ],
        required: false
      },
      {
        id: 'gpu-preference',
        type: 'multiple-choice',
        question: t('questions.preferences.gpuPreference'),
        options: [
          t('options.brands.noPreference'),
          t('options.brands.nvidia'),
          t('options.brands.amd')
        ],
        required: false
      },
      {
        id: 'quiet-operation',
        type: 'range',
        question: t('questions.preferences.quietOperation'),
        min: 1,
        max: 10,
        step: 1,
        required: true
      },
      {
        id: 'energy-efficiency',
        type: 'range',
        question: t('questions.preferences.energyEfficiency'),
        min: 1,
        max: 10,
        step: 1,
        required: true
      },
      {
        id: 'future-proofing',
        type: 'range',
        question: t('questions.preferences.futureProofing'),
        min: 1,
        max: 10,
        step: 1,
        required: true
      }
    ]
  },
  {
    id: 'requirements',
    title: t('questions.requirements.title'),
    description: t('questions.requirements.description'),
    icon: '🔧',
    color: 'orange',
    estimatedTime: '1 min',
    questions: [
      {
        id: 'size-constraint',
        type: 'multiple-choice',
        question: t('questions.requirements.sizeConstraint'),
        options: [
          t('options.sizes.noConstraint'),
          t('options.sizes.compact'),
          t('options.sizes.standard'),
          t('options.sizes.full')
        ],
        required: false
      },
      {
        id: 'additional-requirements',
        type: 'text',
        question: t('questions.requirements.additionalRequirements'),
        required: false
      }
    ]
  }
]

export const getUsageOptions = (t: (key: string) => string): UsageOption[] => [
  {
    id: 'gaming-aaa',
    label: t('usageOptions.gamingAAA.label'),
    description: t('usageOptions.gamingAAA.description'),
    icon: '🎮',
    recommendedSpecs: {
      cpu: 'Intel i7/Ryzen 7',
      gpu: 'RTX 4070/RX 7800 XT',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD'
    }
  },
  {
    id: 'gaming-casual',
    label: t('usageOptions.gamingCasual.label'),
    description: t('usageOptions.gamingCasual.description'),
    icon: '🕹️',
    recommendedSpecs: {
      cpu: 'Intel i5/Ryzen 5',
      gpu: 'RTX 4060/RX 7600',
      ram: '16GB DDR4',
      storage: '500GB NVMe SSD'
    }
  },
  {
    id: 'content-video',
    label: t('usageOptions.videoEditing.label'),
    description: t('usageOptions.videoEditing.description'),
    icon: '🎬',
    recommendedSpecs: {
      cpu: 'Intel i9/Ryzen 9',
      gpu: 'RTX 4080/RX 7900 XTX',
      ram: '64GB DDR5',
      storage: '2TB NVMe SSD'
    }
  },
  {
    id: 'content-photo',
    label: t('usageOptions.photoEditing.label'),
    description: t('usageOptions.photoEditing.description'),
    icon: '📸',
    recommendedSpecs: {
      cpu: 'Intel i7/Ryzen 7',
      gpu: 'RTX 4070/RX 7700 XT',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD'
    }
  },
  {
    id: 'programming',
    label: t('usageOptions.programming.label'),
    description: t('usageOptions.programming.description'),
    icon: '💻',
    recommendedSpecs: {
      cpu: 'Intel i7/Ryzen 7',
      gpu: 'GTX 1660/Intégrée',
      ram: '32GB DDR4',
      storage: '1TB NVMe SSD'
    }
  },
  {
    id: 'office',
    label: t('usageOptions.office.label'),
    description: t('usageOptions.office.description'),
    icon: '📄',
    recommendedSpecs: {
      cpu: 'Intel i3/Ryzen 3',
      gpu: 'Intégrée',
      ram: '16GB DDR4',
      storage: '512GB SSD'
    }
  },
  {
    id: 'streaming',
    label: t('usageOptions.streaming.label'),
    description: t('usageOptions.streaming.description'),
    icon: '📺',
    recommendedSpecs: {
      cpu: 'Intel i7/Ryzen 7',
      gpu: 'RTX 4070/RX 7700 XT',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD'
    }
  },
  {
    id: 'modeling-3d',
    label: t('usageOptions.modeling3d.label'),
    description: t('usageOptions.modeling3d.description'),
    icon: '🏗️',
    recommendedSpecs: {
      cpu: 'Intel i9/Ryzen 9',
      gpu: 'RTX 4080/RX 7900 XTX',
      ram: '64GB DDR5',
      storage: '2TB NVMe SSD'
    }
  },
  {
    id: 'ai-ml',
    label: t('usageOptions.aiMl.label'),
    description: t('usageOptions.aiMl.description'),
    icon: '🤖',
    recommendedSpecs: {
      cpu: 'Intel i9/Ryzen 9',
      gpu: 'RTX 4090',
      ram: '128GB DDR5',
      storage: '4TB NVMe SSD'
    }
  },
  {
    id: 'general',
    label: t('usageOptions.general.label'),
    description: t('usageOptions.general.description'),
    icon: '🌐',
    recommendedSpecs: {
      cpu: 'Intel i5/Ryzen 5',
      gpu: 'RTX 4060/Intégrée',
      ram: '16GB',
      storage: '512GB NVMe SSD'
    }
  }
] 