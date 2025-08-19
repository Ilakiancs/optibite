"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserProfile as UserData, MealPlan } from '@/lib/types'
import { 
  Activity, 
  Target, 
  Utensils, 
  RefreshCw, 
  Sparkles,
  TrendingUp,
  Clock,
  Users
} from '@/components/icons'

interface ResultsDashboardProps {
  userData: UserData
  bmrData: any
  mealPlan: MealPlan
  mealDescriptions?: Record<string, string> | null
  swapSuggestions?: any[]
  onGenerateDescriptions: () => void
  onGenerateSwaps: () => void
  onReset: () => void
  loading?: boolean
}

export function ResultsDashboard({
  userData,
  bmrData,
  mealPlan,
  mealDescriptions,
  swapSuggestions = [],
  onGenerateDescriptions,
  onGenerateSwaps,
  onReset,
  loading = false
}: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅'
      case 'lunch': return '☀️'
      case 'dinner': return '🌙'
      default: return 'Meal'
    }
  }

  const meals = [
    { name: 'Breakfast', items: mealPlan.breakfast_items || [], icon: getMealIcon('breakfast') },
    { name: 'Lunch', items: mealPlan.lunch_items || [], icon: getMealIcon('lunch') },
    { name: 'Dinner', items: mealPlan.dinner_items || [], icon: getMealIcon('dinner') }
  ]

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-gray-100">
          <Target className="mr-2 h-3 w-3" />
          Your Personalized Plan is Ready
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">
          Welcome to Your Nutrition Dashboard
          {userData.name && <span className="block text-xl text-gray-500 mt-2">Hello, {userData.name}!</span>}
        </h2>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base Metabolic Rate</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(bmrData.bmr)}</div>
            <p className="text-xs text-gray-500">calories at rest</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Target</CardTitle>
            <Target className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(bmrData.daily_calories)}</div>
            <p className="text-xs text-gray-500">total daily calories</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Calories</CardTitle>
            <Utensils className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mealPlan.total_calories || 0}</div>
            <p className="text-xs text-gray-500">from your meal plan</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="meals">Meals</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="optimize">Optimize</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Gender:</span>
                    <span className="ml-2 font-medium">{userData.gender}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Age:</span>
                    <span className="ml-2 font-medium">{userData.age} years</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Height:</span>
                    <span className="ml-2 font-medium">{userData.height} cm</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Weight:</span>
                    <span className="ml-2 font-medium">{userData.weight} kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nutritional Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Nutritional Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-green-600">{mealPlan.total_calories || 0}</div>
                    <div className="text-xs text-gray-500">Total Calories</div>
                  </div>
                  {mealPlan.breakdown && Object.entries(mealPlan.breakdown).map(([nutrient, value]) => (
                    <div key={nutrient} className="space-y-1">
                      <div className="text-2xl font-bold text-blue-600">{value}</div>
                      <div className="text-xs text-gray-500 capitalize">{nutrient}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Meals Tab */}
        <TabsContent value="meals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <Card key={meal.name} className="card-hover">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-2xl">{meal.icon}</span>
                    {meal.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {meal.items && meal.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1.5 text-xs">•</span>
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-6">
          <div className="text-center space-y-4">
            <Button 
              onClick={onGenerateDescriptions}
              disabled={loading || !!mealDescriptions}
              loading={loading}
              size="lg"
              className="w-full md:w-auto"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {mealDescriptions ? 'AI Descriptions Generated' : 'Generate AI Meal Descriptions'}
            </Button>
          </div>

          {mealDescriptions && (
            <div className="space-y-4">
              {Object.entries(mealDescriptions).map(([meal, description]) => (
                <Card key={meal}>
                  <CardHeader>
                    <CardTitle className="capitalize">{meal} Inspiration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 leading-relaxed">{description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Optimize Tab */}
        <TabsContent value="optimize" className="space-y-6">
          <div className="text-center space-y-4">
            <Button 
              onClick={onGenerateSwaps}
              disabled={loading}
              loading={loading}
              size="lg"
              variant="outline"
              className="w-full md:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Get Smart Swap Suggestions
            </Button>
          </div>

          {swapSuggestions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Smart Swap Recommendations</h3>
              {swapSuggestions.map((suggestion, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-gray-500">Replace:</span>
                        {suggestion.items_to_replace?.map((item: string, i: number) => (
                          <span key={i} className="bg-destructive/10 text-destructive px-2 py-1 rounded text-sm">
                            {item}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-gray-500">With:</span>
                        {suggestion.replacements?.map((item: string, i: number) => (
                          <span key={i} className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-2 py-1 rounded text-sm">
                            {item}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{suggestion.rationale}</p>
                      <div className="text-xs text-gray-500">
                        Calorie impact: {suggestion.calorie_delta > 0 ? '+' : ''}{suggestion.calorie_delta} calories
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Reset Button */}
      <div className="text-center pt-8 border-t">
        <Button onClick={onReset} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>
    </div>
  )
}
