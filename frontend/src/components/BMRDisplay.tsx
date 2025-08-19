'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserData } from '@/lib/utils'

interface BMRDisplayProps {
  bmr: number
  dailyCalories: number
  userData: UserData
}

export function BMRDisplay({ bmr, dailyCalories, userData }: BMRDisplayProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Your Metabolic Profile</CardTitle>
        <CardDescription className="text-center">
          Personalized calculations based on your information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-blue-600">{Math.round(bmr)}</div>
            <div className="text-sm text-gray-600">Base Metabolic Rate</div>
            <div className="text-xs text-gray-500">Calories burned at rest</div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-purple-600">{Math.round(dailyCalories)}</div>
            <div className="text-sm text-gray-600">Daily Calorie Target</div>
            <div className="text-xs text-gray-500">Including activity level</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Your Profile Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {userData.name && (
              <div>
                <span className="text-gray-600">Name:</span> {userData.name}
              </div>
            )}
            <div>
              <span className="text-gray-600">Gender:</span> {userData.gender}
            </div>
            <div>
              <span className="text-gray-600">Age:</span> {userData.age} years
            </div>
            <div>
              <span className="text-gray-600">Weight:</span> {userData.weight} kg
            </div>
            <div>
              <span className="text-gray-600">Height:</span> {userData.height} cm
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
