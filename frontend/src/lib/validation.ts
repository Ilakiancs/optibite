import { z } from "zod"

export const userFormSchema = z.object({
  name: z.string().optional(),
  gender: z.enum(["Male", "Female"], {
    required_error: "Please select your gender",
  }),
  weight: z
    .number()
    .min(30, "Weight must be at least 30 kg")
    .max(300, "Weight must be less than 300 kg"),
  height: z
    .number()
    .min(100, "Height must be at least 100 cm")
    .max(250, "Height must be less than 250 cm"),
  age: z
    .number()
    .min(13, "Age must be at least 13 years")
    .max(120, "Age must be less than 120 years"),
})

export type UserFormData = z.infer<typeof userFormSchema>

// Activity level schema for future enhancements
export const activityLevelSchema = z.enum([
  "sedentary",
  "lightly_active", 
  "moderately_active",
  "very_active",
  "extra_active"
])

// Dietary preferences schema
export const dietaryPreferencesSchema = z.object({
  vegetarian: z.boolean().default(false),
  vegan: z.boolean().default(false),
  glutenFree: z.boolean().default(false),
  dairyFree: z.boolean().default(false),
  lowCarb: z.boolean().default(false),
  allergies: z.array(z.string()).default([]),
})

export type DietaryPreferences = z.infer<typeof dietaryPreferencesSchema>
