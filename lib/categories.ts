export const GOAL_CATEGORIES = {
  CAREER: {
    label: 'Career',
    icon: '💼',
    color: 'blue',
    description: 'Professional growth and career goals'
  },
  HEALTH: {
    label: 'Health',
    icon: '💪',
    color: 'green',
    description: 'Physical and mental wellness'
  },
  FINANCE: {
    label: 'Finance',
    icon: '💰',
    color: 'yellow',
    description: 'Financial goals and wealth building'
  },
  RELATIONSHIPS: {
    label: 'Relationships',
    icon: '❤️',
    color: 'pink',
    description: 'Personal relationships and connections'
  },
  LEARNING: {
    label: 'Learning',
    icon: '📚',
    color: 'purple',
    description: 'Education and skill development'
  },
  OTHER: {
    label: 'Other',
    icon: '🎯',
    color: 'gray',
    description: 'Other personal goals'
  }
} as const

export type GoalCategory = keyof typeof GOAL_CATEGORIES

export const GOAL_TEMPLATES: Record<GoalCategory, string[]> = {
  CAREER: [
    'Become a senior software engineer',
    'Start my own business',
    'Get promoted to management',
    'Learn a new programming language',
    'Speak at a tech conference'
  ],
  HEALTH: [
    'Run a marathon',
    'Lose 20 pounds',
    'Practice yoga daily',
    'Quit smoking',
    'Build muscle and get fit'
  ],
  FINANCE: [
    'Save $50,000 for a house',
    'Become debt-free',
    'Start investing in stocks',
    'Build a passive income stream',
    'Reach $100K net worth'
  ],
  RELATIONSHIPS: [
    'Get married',
    'Reconnect with old friends',
    'Improve communication with family',
    'Make 10 new meaningful friendships',
    'Travel with my partner to 5 countries'
  ],
  LEARNING: [
    'Learn to speak Spanish fluently',
    'Master data science',
    'Read 100 books',
    'Get a master\'s degree',
    'Learn to play guitar'
  ],
  OTHER: [
    'Travel to 20 countries',
    'Write a book',
    'Learn to cook gourmet meals',
    'Volunteer 100 hours',
    'Complete a creative project'
  ]
}

export function getCategoryColor(category: GoalCategory): string {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    pink: 'bg-pink-50 text-pink-600 border-pink-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200'
  }
  return colors[GOAL_CATEGORIES[category].color as keyof typeof colors]
}
