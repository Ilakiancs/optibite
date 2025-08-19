'use client'

import React, { useState } from 'react'
import { UserForm } from '@/components/UserForm'
import { BMRDisplay } from '@/components/BMRDisplay'
import { MealPlanDisplay } from '@/components/MealPlanDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  UserData, 
  MealPlan, 
  calculateBMR, 
  generateMealPlan, 
  generateMealDescriptions,
  generateSwapSuggestions 
} from '@/lib/utils'

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [bmrData, setBmrData] = useState<any>(null)
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [mealDescriptions, setMealDescriptions] = useState<Record<string, string> | null>(null)
  const [swapSuggestions, setSwapSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUserSubmit = async (data: UserData) => {
    setLoading(true)
    setError(null)
    
    try {
      // Calculate BMR
      const bmrResponse = await calculateBMR(data)
      setBmrData(bmrResponse)
      setUserData(data)
      
      // Generate meal plan
      const mealPlanResponse = await generateMealPlan(data)
      if (mealPlanResponse.success) {
        setMealPlan(mealPlanResponse.meal_plan)
      } else {
        setError(mealPlanResponse.error || 'Failed to generate meal plan')
      }
    } catch (err) {
      setError('Failed to generate meal plan. Please check your connection and try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateDescriptions = async () => {
    if (!mealPlan || !userData) return
    
    setLoading(true)
    try {
      const response = await generateMealDescriptions(mealPlan, userData.name || '')
      if (response.success) {
        setMealDescriptions(response.descriptions)
      } else {
        setError('Failed to generate meal descriptions')
      }
    } catch (err) {
      setError('Failed to generate meal descriptions')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateSwaps = async (targetDelta: number = 0) => {
    if (!mealPlan) return
    
    setLoading(true)
    try {
      const response = await generateSwapSuggestions(mealPlan, targetDelta)
      if (response.success) {
        setSwapSuggestions(response.suggestions)
      } else {
        setError('Failed to generate swap suggestions')
      }
    } catch (err) {
      setError('Failed to generate swap suggestions')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetApp = () => {
    setUserData(null)
    setBmrData(null)
    setMealPlan(null)
    setMealDescriptions(null)
    setSwapSuggestions([])
    setError(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            OptiBite
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your AI-powered personal meal planning assistant. Get optimized nutrition plans tailored to your unique metabolic profile.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="max-w-2xl mx-auto border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Form */}
        {!userData && (
          <UserForm onSubmit={handleUserSubmit} loading={loading} />
        )}

        {/* BMR Display */}
        {bmrData && userData && (
          <BMRDisplay 
            bmr={bmrData.bmr}
            dailyCalories={bmrData.daily_calories}
            userData={userData}
          />
        )}

        {/* Meal Plan Display */}
        {mealPlan && (
          <MealPlanDisplay mealPlan={mealPlan} />
        )}

        {/* Action Buttons */}
        {mealPlan && (
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl text-center">Enhance Your Meal Plan</CardTitle>
              <CardDescription className="text-center">
                Get AI-powered descriptions and smart swap suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={handleGenerateDescriptions}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                >
                  Generate AI Descriptions
                </Button>
                <Button 
                  onClick={() => handleGenerateSwaps(0)}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                >
                  🔄 Get Swap Suggestions
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Descriptions */}
        {mealDescriptions && (
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl text-center">AI-Powered Meal Descriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(mealDescriptions).map(([meal, description]) => (
                  <div key={meal} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold capitalize mb-2">{meal}</h4>
                    <p className="text-gray-700">{description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Swap Suggestions */}
        {swapSuggestions.length > 0 && (
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl text-center">Smart Swap Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {swapSuggestions.map((suggestion, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-gray-600">Replace:</span>
                      {suggestion.items_to_replace?.map((item: string, i: number) => (
                        <span key={i} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-gray-600">With:</span>
                      {suggestion.replacements?.map((item: string, i: number) => (
                        <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-700">{suggestion.rationale}</p>
                    <div className="text-xs text-gray-500">
                      Calorie change: {suggestion.calorie_delta > 0 ? '+' : ''}{suggestion.calorie_delta}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reset Button */}
        {userData && (
          <div className="text-center">
            <Button onClick={resetApp} variant="outline">
              Start Over
            </Button>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-16">
          <p>&copy; 2024 OptiBite. AI-powered nutrition planning for a healthier you.</p>
        </footer>
      </div>
    </main>
  )
}
