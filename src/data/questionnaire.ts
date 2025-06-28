import { QuestionnaireStep } from '@/types/pc-components'

export const questionnaireSteps: QuestionnaireStep[] = [
  {
    id: 'usage',
    title: 'How will you use your PC?',
    description: 'Help us understand your primary use cases to recommend the best components.',
    questions: [
      {
        id: 'primary-use',
        type: 'checkbox',
        question: 'What will you primarily use your PC for? (Select all that apply)',
        options: [
          'Gaming (AAA titles)',
          'Gaming (Casual/Indie)',
          'Content Creation (Video Editing)',
          'Content Creation (Photo Editing)',
          'Programming/Development',
          'Office Work/Productivity',
          'Streaming',
          '3D Modeling/CAD',
          'Machine Learning/AI',
          'General Web Browsing'
        ],
        required: true
      },
      {
        id: 'gaming-resolution',
        type: 'multiple-choice',
        question: 'If gaming, what resolution do you plan to play at?',
        options: ['1080p', '1440p', '4K', 'Not applicable'],
        required: false
      },
      {
        id: 'performance-level',
        type: 'multiple-choice',
        question: 'What performance level are you targeting?',
        options: [
          'Budget-friendly (Good enough)',
          'Balanced (Good performance/price)',
          'High-end (Best performance)',
          'Extreme (Money no object)'
        ],
        required: true
      }
    ]
  },
  {
    id: 'budget',
    title: 'What\'s your budget?',
    description: 'Set your budget range so we can recommend components that fit your financial goals.',
    questions: [
      {
        id: 'total-budget',
        type: 'range',
        question: 'What\'s your total budget for the PC (excluding peripherals)?',
        min: 500,
        max: 5000,
        step: 100,
        required: true
      },
      {
        id: 'flexibility',
        type: 'multiple-choice',
        question: 'How flexible is your budget?',
        options: [
          'Strict - Cannot go over',
          'Somewhat flexible - Up to 10% over',
          'Flexible - Up to 20% over for significant benefits'
        ],
        required: true
      }
    ]
  },
  {
    id: 'preferences',
    title: 'Brand & Feature Preferences',
    description: 'Tell us about your brand preferences and what features matter most to you.',
    questions: [
      {
        id: 'cpu-preference',
        type: 'multiple-choice',
        question: 'Do you have a CPU brand preference?',
        options: ['AMD', 'Intel', 'No preference'],
        required: false
      },
      {
        id: 'gpu-preference',
        type: 'multiple-choice',
        question: 'Do you have a GPU brand preference?',
        options: ['NVIDIA', 'AMD', 'No preference'],
        required: false
      },
      {
        id: 'quiet-operation',
        type: 'range',
        question: 'How important is quiet operation? (1 = Don\'t care, 10 = Very important)',
        min: 1,
        max: 10,
        step: 1,
        required: true
      },
      {
        id: 'future-proofing',
        type: 'range',
        question: 'How important is future-proofing? (1 = Don\'t care, 10 = Very important)',
        min: 1,
        max: 10,
        step: 1,
        required: true
      },
      {
        id: 'energy-efficiency',
        type: 'range',
        question: 'How important is energy efficiency? (1 = Don\'t care, 10 = Very important)',
        min: 1,
        max: 10,
        step: 1,
        required: true
      }
    ]
  },
  {
    id: 'requirements',
    title: 'Special Requirements',
    description: 'Any special requirements or constraints for your build?',
    questions: [
      {
        id: 'size-constraint',
        type: 'multiple-choice',
        question: 'Do you have any size constraints?',
        options: [
          'No constraints',
          'Must fit in small space',
          'Prefer compact build',
          'Full tower is fine'
        ],
        required: false
      },
      {
        id: 'existing-parts',
        type: 'checkbox',
        question: 'Do you have any existing parts to reuse?',
        options: [
          'Monitor',
          'Keyboard & Mouse',
          'Storage drives',
          'GPU',
          'Case',
          'Power Supply',
          'None - starting fresh'
        ],
        required: false
      },
      {
        id: 'additional-requirements',
        type: 'text',
        question: 'Any additional requirements or preferences?',
        required: false
      }
    ]
  }
] 