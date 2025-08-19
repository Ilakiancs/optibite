"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, Ruler, Weight } from "@/components/icons";

export interface UserProfile {
  name?: string;
  age: number;
  gender: "male" | "female" | "";
  height: number;
  weight: number;
  activityLevel:
    | "sedentary"
    | "light"
    | "moderate"
    | "active"
    | "very_active"
    | "";
  goal: "lose_weight" | "maintain_weight" | "gain_weight" | "";
  unitSystem: "metric" | "imperial";
}

interface UserFormProps {
  data: UserProfile;
  onChange: (field: keyof UserProfile, value: string | number) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious?: () => void;
  canGoBack?: boolean;
  loading?: boolean;
}

const activityLevels = [
  { value: "sedentary", label: "Sedentary (little/no exercise)" },
  { value: "light", label: "Light (light exercise 1-3 days/week)" },
  { value: "moderate", label: "Moderate (moderate exercise 3-5 days/week)" },
  { value: "active", label: "Active (hard exercise 6-7 days/week)" },
  {
    value: "very_active",
    label: "Very Active (very hard exercise, physical job)",
  },
];

const goals = [
  { value: "lose_weight", label: "Lose Weight" },
  { value: "maintain_weight", label: "Maintain Weight" },
  { value: "gain_weight", label: "Gain Weight" },
];

export function UserForm({
  data,
  onChange,
  errors,
  onNext,
  onPrevious,
  canGoBack = false,
  loading = false,
}: UserFormProps) {
  const handleHeightChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange("height", numValue);
  };

  const handleWeightChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange("weight", numValue);
  };

  const handleAgeChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    onChange("age", numValue);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-2xl">Personal Information</CardTitle>
          <p className="text-gray-500 mt-2">
            Tell us about yourself to create your personalized meal plan
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name (Optional)</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={data.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            className="w-full"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Unit System */}
        <div className="space-y-2">
          <Label>Measurement System</Label>
          <Select
            value={data.unitSystem}
            onValueChange={(value) => onChange("unitSystem", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select measurement system" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (kg, cm)</SelectItem>
              <SelectItem value="imperial">Imperial (lb, ft/in)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender */}
          <div className="space-y-2">
            <Label>Gender *</Label>
            <Select
              value={data.gender}
              onValueChange={(value) => onChange("gender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-destructive">{errors.gender}</p>
            )}
          </div>

          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Age (years) *
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="25"
              value={data.age || ""}
              onChange={(e) => handleAgeChange(e.target.value)}
              min="13"
              max="120"
            />
            {errors.age && (
              <p className="text-sm text-destructive">{errors.age}</p>
            )}
          </div>

          {/* Height */}
          <div className="space-y-2">
            <Label htmlFor="height" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Height ({data.unitSystem === "metric" ? "cm" : "ft"}) *
            </Label>
            <Input
              id="height"
              type="number"
              placeholder={data.unitSystem === "metric" ? "170" : "5.7"}
              value={data.height || ""}
              onChange={(e) => handleHeightChange(e.target.value)}
              step={data.unitSystem === "metric" ? "1" : "0.1"}
              min={data.unitSystem === "metric" ? "100" : "3"}
              max={data.unitSystem === "metric" ? "250" : "8"}
            />
            {errors.height && (
              <p className="text-sm text-destructive">{errors.height}</p>
            )}
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight" className="flex items-center gap-2">
              <Weight className="h-4 w-4" />
              Weight ({data.unitSystem === "metric" ? "kg" : "lb"}) *
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder={data.unitSystem === "metric" ? "70" : "154"}
              value={data.weight || ""}
              onChange={(e) => handleWeightChange(e.target.value)}
              step={data.unitSystem === "metric" ? "0.1" : "0.5"}
              min={data.unitSystem === "metric" ? "30" : "66"}
              max={data.unitSystem === "metric" ? "300" : "660"}
            />
            {errors.weight && (
              <p className="text-sm text-destructive">{errors.weight}</p>
            )}
          </div>
        </div>

        {/* Activity Level */}
        <div className="space-y-2">
          <Label>Activity Level *</Label>
          <Select
            value={data.activityLevel}
            onValueChange={(value) => onChange("activityLevel", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your activity level" />
            </SelectTrigger>
            <SelectContent>
              {activityLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.activityLevel && (
            <p className="text-sm text-destructive">{errors.activityLevel}</p>
          )}
        </div>

        {/* Goal */}
        <div className="space-y-2">
          <Label>Goal *</Label>
          <Select
            value={data.goal}
            onValueChange={(value) => onChange("goal", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your goal" />
            </SelectTrigger>
            <SelectContent>
              {goals.map((goal) => (
                <SelectItem key={goal.value} value={goal.value}>
                  {goal.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.goal && (
            <p className="text-sm text-destructive">{errors.goal}</p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrevious} disabled={!canGoBack}>
            Previous
          </Button>

          <Button onClick={onNext} disabled={loading} loading={loading}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
