"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Clock,
  Utensils,
  Zap,
  Target,
  Download,
  RefreshCw,
  ChefHat,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Activity,
  Users
} from '@/components/icons'
import type { NutritionInfo, MealItem, DayMealPlan, MealPlan } from '@/lib/types'

interface MealPlanViewProps {
  mealPlan: MealPlan | null
  loading?: boolean
  error?: string | null
  onRegenerate?: () => void
  onSwapMeal?: (dayIndex: number, mealType: string, itemId: string) => void
  onExportPDF?: () => void
  onExportCSV?: () => void
  onGenerateDescriptions?: () => void
  swapSuggestions?: any[]
  loadingDescriptions?: boolean
}

export function MealPlanView({
  mealPlan,
  loading = false,
  error = null,
  onRegenerate,
  onSwapMeal,
  onExportPDF,
  onExportCSV,
  onGenerateDescriptions,
  swapSuggestions = [],
  loadingDescriptions = false
}: MealPlanViewProps) {
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedMeal, setSelectedMeal] = useState<MealItem | null>(null)

  if (loading) {
    return <MealPlanSkeleton />
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Error Generating Meal Plan</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button onClick={onRegenerate} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!mealPlan) {
    return null
  }

  const currentDay = mealPlan.days[selectedDay]
  const nutritionComparison = calculateNutritionComparison(currentDay.totalNutrition, mealPlan.targetNutrition)

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header with Actions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <ChefHat className="h-6 w-6" />
              Your Personalized Meal Plan
            </CardTitle>
            <p className="text-muted-foreground">
              Generated on {new Date(mealPlan.generatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateDescriptions}
              loading={loadingDescriptions}
            >
              <Zap className="h-4 w-4 mr-2" />
              Enhance with AI
            </Button>
            <Button variant="outline" size="sm" onClick={onRegenerate}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Day Navigation */}
      <Tabs value={selectedDay.toString()} onValueChange={(value) => setSelectedDay(parseInt(value))}>
        <TabsList className="grid w-full grid-cols-7">
          {mealPlan.days.map((_, index) => (
            <TabsTrigger key={index} value={index.toString()}>
              Day {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>

        {mealPlan.days.map((day, dayIndex) => (
          <TabsContent key={dayIndex} value={dayIndex.toString()} className="space-y-6">
            {/* Nutrition Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Daily Nutrition Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(day.totalNutrition.calories)}</div>
                    <div className="text-sm text-muted-foreground">Calories</div>
                    <NutritionProgress
                      current={day.totalNutrition.calories}
                      target={mealPlan.targetNutrition.calories}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(day.totalNutrition.protein)}g</div>
                    <div className="text-sm text-muted-foreground">Protein</div>
                    <NutritionProgress
                      current={day.totalNutrition.protein}
                      target={mealPlan.targetNutrition.protein}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(day.totalNutrition.carbs)}g</div>
                    <div className="text-sm text-muted-foreground">Carbs</div>
                    <NutritionProgress
                      current={day.totalNutrition.carbs}
                      target={mealPlan.targetNutrition.carbs}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(day.totalNutrition.fats)}g</div>
                    <div className="text-sm text-muted-foreground">Fats</div>
                    <NutritionProgress
                      current={day.totalNutrition.fats}
                      target={mealPlan.targetNutrition.fats}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MealCard
                title="Breakfast"
                icon={<Clock className="h-5 w-5" />}
                meals={day.breakfast}
                onMealClick={setSelectedMeal}
                onSwap={(itemId) => onSwapMeal?.(dayIndex, 'breakfast', itemId)}
              />
              <MealCard
                title="Lunch"
                icon={<Utensils className="h-5 w-5" />}
                meals={day.lunch}
                onMealClick={setSelectedMeal}
                onSwap={(itemId) => onSwapMeal?.(dayIndex, 'lunch', itemId)}
              />
              <MealCard
                title="Dinner"
                icon={<ChefHat className="h-5 w-5" />}
                meals={day.dinner}
                onMealClick={setSelectedMeal}
                onSwap={(itemId) => onSwapMeal?.(dayIndex, 'dinner', itemId)}
              />
              <MealCard
                title="Snacks"
                icon={<Activity className="h-5 w-5" />}
                meals={day.snacks}
                onMealClick={setSelectedMeal}
                onSwap={(itemId) => onSwapMeal?.(dayIndex, 'snacks', itemId)}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Export Options */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold">Export Your Meal Plan</h3>
              <p className="text-sm text-muted-foreground">
                Save your meal plan for offline use
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={onExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Detail Modal */}
      <Dialog open={!!selectedMeal} onOpenChange={() => setSelectedMeal(null)}>
        <DialogContent className="max-w-2xl">
          {selectedMeal && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMeal.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedMeal.description && (
                  <p className="text-muted-foreground">{selectedMeal.description}</p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Ingredients</h4>
                    <ul className="space-y-1">
                      {selectedMeal.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-sm">• {ingredient}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Nutrition (per serving)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Calories:</span>
                        <span>{Math.round(selectedMeal.nutrition.calories)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span>{Math.round(selectedMeal.nutrition.protein)}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbs:</span>
                        <span>{Math.round(selectedMeal.nutrition.carbs)}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fats:</span>
                        <span>{Math.round(selectedMeal.nutrition.fats)}g</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedMeal.tags && selectedMeal.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedMeal.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 text-sm text-muted-foreground">
                  {selectedMeal.prepTime && (
                    <span>Prep: {selectedMeal.prepTime}min</span>
                  )}
                  {selectedMeal.cookTime && (
                    <span>Cook: {selectedMeal.cookTime}min</span>
                  )}
                  {selectedMeal.difficulty && (
                    <Badge variant="outline">{selectedMeal.difficulty}</Badge>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MealCard({
  title,
  icon,
  meals,
  onMealClick,
  onSwap
}: {
  title: string
  icon: React.ReactNode
  meals: MealItem[]
  onMealClick: (meal: MealItem) => void
  onSwap: (itemId: string) => void
}) {
  const totalCalories = meals.reduce((sum, meal) => sum + meal.nutrition.calories, 0)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {Math.round(totalCalories)} calories
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors"
            onClick={() => onMealClick(meal)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{meal.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(meal.nutrition.calories)} cal • {Math.round(meal.nutrition.protein)}g protein
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onSwap(meal.id)
                }}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function NutritionProgress({ current, target }: { current: number; target: number }) {
  const percentage = Math.min((current / target) * 100, 100)
  const isGood = percentage >= 90 && percentage <= 110

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${isGood ? 'bg-green-500' : percentage > 110 ? 'bg-orange-500' : 'bg-blue-500'}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">
        {Math.round(percentage)}%
      </span>
    </div>
  )
}

function MealPlanSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-16" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function calculateNutritionComparison(current: NutritionInfo, target: NutritionInfo) {
  return {
    calories: (current.calories / target.calories) * 100,
    protein: (current.protein / target.protein) * 100,
    carbs: (current.carbs / target.carbs) * 100,
    fats: (current.fats / target.fats) * 100,
  }
}
