'use client'

import React, { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { MultiStepForm } from '@/components/MultiStepForm'
import { ResultsDashboard } from '@/components/ResultsDashboard'
import { Card, CardContent } from '@/components/ui/card'
import { 
  UserData, 
  MealPlan, 
  calculateBMR, 
  generateMealPlan, 
  generateMealDescriptions,
  generateSwapSuggestions 
} from '@/lib/utils'

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [bmrData, setBmrData] = useState<any>(null)
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [mealDescriptions, setMealDescriptions] = useState<Record<string, string> | null>(null)
  const [swapSuggestions, setSwapSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGetStarted = () => {
    setShowForm(true)
  }

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
    setShowForm(false)
    setUserData(null)
    setBmrData(null)
    setMealPlan(null)
    setMealDescriptions(null)
    setSwapSuggestions([])
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Error Display */}
        {error && (
          <div className="container py-4">
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Landing Hero */}
        {!showForm && !mealPlan && (
          <Hero onGetStarted={handleGetStarted} />
        )}

        {/* Multi-Step Form */}
        {showForm && !mealPlan && (
          <section className="py-12 md:py-20">
            <div className="container">
              <MultiStepForm onSubmit={handleUserSubmit} loading={loading} />
            </div>
          </section>
        )}

        {/* Results Dashboard */}
        {mealPlan && userData && bmrData && (
          <section className="py-12 md:py-20">
            <div className="container">
              <ResultsDashboard
                userData={userData}
                bmrData={bmrData}
                mealPlan={mealPlan}
                mealDescriptions={mealDescriptions}
                swapSuggestions={swapSuggestions}
                onGenerateDescriptions={handleGenerateDescriptions}
                onGenerateSwaps={handleGenerateSwaps}
                onReset={resetApp}
                loading={loading}
              />
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
