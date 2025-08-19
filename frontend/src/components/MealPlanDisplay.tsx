'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MealPlan } from '@/lib/utils'

interface MealPlanDisplayProps {
  mealPlan: MealPlan
}

export function MealPlanDisplay({ mealPlan }: MealPlanDisplayProps) {
  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return '🌅'
      case 'lunch':
        return '☀️'
      case 'dinner':
        return '🌙'
      default:
        return 'Meal'
    }
  }

  const meals = [
    { 
      name: 'Breakfast', 
      items: mealPlan.breakfast_items,
      icon: getMealIcon('breakfast')
    },
    { 
      name: 'Lunch', 
      items: mealPlan.lunch_items,
      icon: getMealIcon('lunch')
    },
    { 
      name: 'Dinner', 
      items: mealPlan.dinner_items,
      icon: getMealIcon('dinner')
    }
  ]

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Your Personalized Meal Plan</CardTitle>
          <CardDescription className="text-center">
            Optimized for your nutritional needs and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <Card key={meal.name} className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">{meal.icon}</span>
                    {meal.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {meal.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Summary */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-center">Nutritional Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">{mealPlan.total_calories}</div>
              <div className="text-sm text-gray-600">Total Calories</div>
            </div>
            {Object.entries(mealPlan.breakdown).map(([nutrient, value]) => (
              <div key={nutrient} className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">{value}</div>
                <div className="text-sm text-gray-600 capitalize">{nutrient}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
