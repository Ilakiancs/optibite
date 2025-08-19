"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Utensils, Heart, AlertCircle, X } from 'lucide-react'

export interface MealPreferences {
  dietaryRestrictions: string[]
  allergies: string[]
  dislikedFoods: string[]
  preferredCuisines: string[]
  mealsPerDay: number
  targetMacros: {
    protein: number // percentage
    carbs: number   // percentage
    fats: number    // percentage
  }
  calorieAdjustment: number // +/- calories from calculated TDEE
  notes?: string
}

interface MealPrefsFormProps {
  data: MealPreferences
  onChange: (field: keyof MealPreferences, value: any) => void
  errors: Record<string, string>
  onNext: () => void
  onPrevious: () => void
  loading?: boolean
}

const commonDietaryRestrictions = [
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Keto',
  'Paleo',
  'Mediterranean',
  'Low Carb',
  'Low Fat',
  'Gluten Free',
  'Dairy Free',
  'Halal',
  'Kosher'
]

const commonAllergies = [
  'Nuts',
  'Peanuts',
  'Shellfish',
  'Fish',
  'Eggs',
  'Dairy',
  'Soy',
  'Wheat/Gluten',
  'Sesame',
  'Sulfites'
]

const commonCuisines = [
  'Italian',
  'Asian',
  'Mexican',
  'Indian',
  'Mediterranean',
  'American',
  'French',
  'Thai',
  'Japanese',
  'Middle Eastern',
  'Greek',
  'Spanish'
]

export function MealPrefsForm({
  data,
  onChange,
  errors,
  onNext,
  onPrevious,
  loading = false
}: MealPrefsFormProps) {
  const addToList = (field: keyof MealPreferences, item: string) => {
    if (Array.isArray(data[field]) && item.trim()) {
      const currentList = data[field] as string[]
      if (!currentList.includes(item)) {
        onChange(field, [...currentList, item])
      }
    }
  }

  const removeFromList = (field: keyof MealPreferences, item: string) => {
    if (Array.isArray(data[field])) {
      const currentList = data[field] as string[]
      onChange(field, currentList.filter(i => i !== item))
    }
  }

  const handleMacroChange = (macro: 'protein' | 'carbs' | 'fats', value: string) => {
    const numValue = parseInt(value) || 0
    const newMacros = { ...data.targetMacros, [macro]: numValue }

    // Auto-adjust other macros to sum to 100%
    const total = Object.values(newMacros).reduce((sum, val) => sum + val, 0)
    if (total > 100) {
      // Proportionally reduce other macros
      const others = Object.keys(newMacros).filter(key => key !== macro) as Array<'protein' | 'carbs' | 'fats'>
      const remaining = 100 - numValue
      const otherTotal = others.reduce((sum, key) => sum + newMacros[key], 0)

      if (otherTotal > 0) {
        others.forEach(key => {
          newMacros[key] = Math.round((newMacros[key] / otherTotal) * remaining)
        })
      }
    }

    onChange('targetMacros', newMacros)
  }

  const macroTotal = data.targetMacros.protein + data.targetMacros.carbs + data.targetMacros.fats

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Utensils className="h-6 w-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-2xl">Meal Preferences</CardTitle>
          <p className="text-muted-foreground mt-2">
            Customize your meal plan based on your dietary needs and preferences
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Dietary Restrictions */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Dietary Restrictions
              </Label>
              <div className="flex flex-wrap gap-2">
                {commonDietaryRestrictions.map((restriction) => (
                  <Badge
                    key={restriction}
                    variant={data.dietaryRestrictions.includes(restriction) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (data.dietaryRestrictions.includes(restriction)) {
                        removeFromList('dietaryRestrictions', restriction)
                      } else {
                        addToList('dietaryRestrictions', restriction)
                      }
                    }}
                  >
                    {restriction}
                  </Badge>
                ))}
              </div>
              {data.dietaryRestrictions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.dietaryRestrictions.map((restriction) => (
                    <Badge key={restriction} variant="secondary" className="gap-1">
                      {restriction}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeFromList('dietaryRestrictions', restriction)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Allergies */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Allergies & Intolerances
              </Label>
              <div className="flex flex-wrap gap-2">
                {commonAllergies.map((allergy) => (
                  <Badge
                    key={allergy}
                    variant={data.allergies.includes(allergy) ? "destructive" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (data.allergies.includes(allergy)) {
                        removeFromList('allergies', allergy)
                      } else {
                        addToList('allergies', allergy)
                      }
                    }}
                  >
                    {allergy}
                  </Badge>
                ))}
              </div>
              {data.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.allergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive" className="gap-1">
                      {allergy}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeFromList('allergies', allergy)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Preferred Cuisines */}
            <div className="space-y-3">
              <Label>Preferred Cuisines</Label>
              <div className="flex flex-wrap gap-2">
                {commonCuisines.map((cuisine) => (
                  <Badge
                    key={cuisine}
                    variant={data.preferredCuisines.includes(cuisine) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (data.preferredCuisines.includes(cuisine)) {
                        removeFromList('preferredCuisines', cuisine)
                      } else {
                        addToList('preferredCuisines', cuisine)
                      }
                    }}
                  >
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Meals Per Day */}
            <div className="space-y-2">
              <Label htmlFor="mealsPerDay">Meals Per Day</Label>
              <Select
                value={data.mealsPerDay.toString()}
                onValueChange={(value) => onChange('mealsPerDay', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 meals (Breakfast, Lunch, Dinner)</SelectItem>
                  <SelectItem value="4">4 meals (+ 1 Snack)</SelectItem>
                  <SelectItem value="5">5 meals (+ 2 Snacks)</SelectItem>
                  <SelectItem value="6">6 meals (+ 3 Snacks)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Target Macros */}
            <div className="space-y-4">
              <Label>Target Macronutrients (%)</Label>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Label htmlFor="protein" className="w-16">Protein</Label>
                  <Input
                    id="protein"
                    type="number"
                    min="10"
                    max="50"
                    value={data.targetMacros.protein}
                    onChange={(e) => handleMacroChange('protein', e.target.value)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="carbs" className="w-16">Carbs</Label>
                  <Input
                    id="carbs"
                    type="number"
                    min="10"
                    max="70"
                    value={data.targetMacros.carbs}
                    onChange={(e) => handleMacroChange('carbs', e.target.value)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="fats" className="w-16">Fats</Label>
                  <Input
                    id="fats"
                    type="number"
                    min="15"
                    max="50"
                    value={data.targetMacros.fats}
                    onChange={(e) => handleMacroChange('fats', e.target.value)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
              <div className="text-sm">
                <span className={macroTotal === 100 ? "text-green-600" : "text-amber-600"}>
                  Total: {macroTotal}% {macroTotal !== 100 && "(Should equal 100%)"}
                </span>
              </div>
            </div>

            {/* Calorie Adjustment */}
            <div className="space-y-2">
              <Label htmlFor="calorieAdjustment">Calorie Adjustment</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="calorieAdjustment"
                  type="number"
                  value={data.calorieAdjustment}
                  onChange={(e) => onChange('calorieAdjustment', parseInt(e.target.value) || 0)}
                  className="w-24"
                  step="50"
                  min="-1000"
                  max="1000"
                />
                <span className="text-sm text-muted-foreground">
                  calories from calculated target
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Positive values increase calories, negative values decrease them
              </p>
            </div>
          </div>
        </div>

        {/* Disliked Foods */}
        <div className="space-y-2">
          <Label htmlFor="dislikedFoods">Foods to Avoid (comma-separated)</Label>
          <Input
            id="dislikedFoods"
            type="text"
            placeholder="e.g., mushrooms, cilantro, liver"
            value={data.dislikedFoods.join(', ')}
            onChange={(e) => {
              const foods = e.target.value.split(',').map(f => f.trim()).filter(f => f)
              onChange('dislikedFoods', foods)
            }}
          />
        </div>

        {/* Additional Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Any additional preferences or requirements..."
            value={data.notes || ''}
            onChange={(e) => onChange('notes', e.target.value)}
            rows={3}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={onPrevious}
          >
            Previous
          </Button>

          <Button
            onClick={onNext}
            disabled={loading}
            loading={loading}
          >
            Generate Meal Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
