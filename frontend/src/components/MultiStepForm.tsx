"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { UserData } from '@/lib/utils'
import { ChevronLeft, ChevronRight, User, Activity, Target } from '@/components/icons'

interface MultiStepFormProps {
  onSubmit: (userData: UserData) => void
  loading?: boolean
}

export function MultiStepForm({ onSubmit, loading = false }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<UserData>({
    weight: 0,
    height: 0,
    age: 0,
    gender: '',
    name: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Tell us a bit about yourself',
      icon: User,
      fields: ['name', 'gender', 'age']
    },
    {
      id: 'physical',
      title: 'Physical Metrics',
      description: 'Your height and weight for accurate calculations',
      icon: Activity,
      fields: ['height', 'weight']
    },
    {
      id: 'review',
      title: 'Review & Generate',
      description: 'Confirm your information and generate your meal plan',
      icon: Target,
      fields: []
    }
  ]

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}
    const currentFields = steps[step].fields

    currentFields.forEach(field => {
      switch (field) {
        case 'gender':
          if (!formData.gender) newErrors.gender = 'Please select your gender'
          break
        case 'age':
          if (!formData.age || formData.age < 13 || formData.age > 120) {
            newErrors.age = 'Please enter a valid age (13-120)'
          }
          break
        case 'height':
          if (!formData.height || formData.height < 100 || formData.height > 250) {
            newErrors.height = 'Please enter a valid height (100-250 cm)'
          }
          break
        case 'weight':
          if (!formData.weight || formData.weight < 30 || formData.weight > 300) {
            newErrors.weight = 'Please enter a valid weight (30-300 kg)'
          }
          break
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        onSubmit(formData)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (field: keyof UserData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Current Step */}
      <Card className="border-2">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            {React.createElement(steps[currentStep].icon, { className: "h-6 w-6 text-primary" })}
          </div>
          <div>
            <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
            <p className="text-muted-foreground mt-2">{steps[currentStep].description}</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step 0: Personal Information */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age (years) *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age || ''}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                />
                {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
              </div>
            </div>
          )}

          {/* Step 1: Physical Metrics */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={formData.height || ''}
                  onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
                />
                {errors.height && <p className="text-sm text-destructive">{errors.height}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={formData.weight || ''}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                />
                {errors.weight && <p className="text-sm text-destructive">{errors.weight}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="font-semibold">Review Your Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {formData.name && (
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <span className="ml-2 font-medium">{formData.name}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Gender:</span>
                    <span className="ml-2 font-medium">{formData.gender}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Age:</span>
                    <span className="ml-2 font-medium">{formData.age} years</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Height:</span>
                    <span className="ml-2 font-medium">{formData.height} cm</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Weight:</span>
                    <span className="ml-2 font-medium">{formData.weight} kg</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={loading}
              loading={loading}
            >
              {currentStep === steps.length - 1 ? 'Generate Plan' : 'Next'}
              {currentStep < steps.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
