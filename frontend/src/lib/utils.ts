import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { UserProfile, MealPlan, SwapSuggestion } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API endpoint configuration
const API_BASE_URL = 'http://localhost:8002'

// Re-export types for backward compatibility
export type { UserProfile as UserData, MealPlan, SwapSuggestion } from './types'

// API functions
export async function calculateBMR(userData: UserProfile) {
  const response = await fetch(`${API_BASE_URL}/api/calculate-bmr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
  
  if (!response.ok) {
    throw new Error('Failed to calculate BMR')
  }
  
  return response.json()
}

export async function generateMealPlan(userData: UserProfile, algorithm: string = 'knapsack') {
  const response = await fetch(`${API_BASE_URL}/api/generate-meal-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_data: userData,
      algorithm
    }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to generate meal plan')
  }
  
  return response.json()
}

export async function generateMealDescriptions(mealPlan: MealPlan, userName: string = '') {
  const response = await fetch(`${API_BASE_URL}/api/generate-descriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      meal_plan: mealPlan,
      user_name: userName
    }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to generate meal descriptions')
  }
  
  return response.json()
}

export async function generateSwapSuggestions(mealPlan: MealPlan, targetDelta: number = 0) {
  const response = await fetch(`${API_BASE_URL}/api/generate-swaps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      meal_plan: mealPlan,
      target_delta: targetDelta
    }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to generate swap suggestions')
  }
  
  return response.json()
}
