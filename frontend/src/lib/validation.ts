import { z } from "zod";

// User Profile Schema
export const userProfileSchema = z.object({
  name: z.string().optional(),
  age: z
    .number()
    .min(13, "Age must be at least 13 years")
    .max(120, "Age must be less than 120 years"),
  gender: z.enum(["male", "female"]),
  height: z
    .number()
    .min(30, "Height is required")
    .refine((val) => val > 0, "Height must be greater than 0"),
  weight: z
    .number()
    .min(20, "Weight is required")
    .refine((val) => val > 0, "Weight must be greater than 0"),
  activityLevel: z.enum([
    "sedentary",
    "light",
    "moderate",
    "active",
    "very_active",
  ]),
  goal: z.enum(["lose_weight", "maintain_weight", "gain_weight"]),
  unitSystem: z.enum(["metric", "imperial"]).default("metric"),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// Meal Preferences Schema
export const mealPreferencesSchema = z.object({
  dietaryRestrictions: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  dislikedFoods: z.array(z.string()).default([]),
  preferredCuisines: z.array(z.string()).default([]),
  mealsPerDay: z.number().min(3).max(6).default(4),
  targetMacros: z
    .object({
      protein: z.number().min(10).max(50),
      carbs: z.number().min(10).max(70),
      fats: z.number().min(15).max(50),
    })
    .refine((data) => data.protein + data.carbs + data.fats === 100, {
      message: "Macronutrient percentages must sum to 100%",
      path: ["targetMacros"],
    }),
  calorieAdjustment: z.number().min(-1000).max(1000).default(0),
  notes: z.string().optional(),
});

export type MealPreferences = z.infer<typeof mealPreferencesSchema>;

// Combined Planner Input Schema
export const plannerInputSchema = z.object({
  userProfile: userProfileSchema,
  mealPreferences: mealPreferencesSchema,
});

export type PlannerInput = z.infer<typeof plannerInputSchema>;

// BMR Response Schema
export const bmrResponseSchema = z.object({
  bmr: z.number(),
  tdee: z.number(),
  recommendedCalories: z.number(),
  macros: z.object({
    protein: z.number(),
    carbs: z.number(),
    fats: z.number(),
  }),
});

export type BMRResponse = z.infer<typeof bmrResponseSchema>;

// Nutrition Info Schema
export const nutritionInfoSchema = z.object({
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fats: z.number(),
  fiber: z.number().optional(),
  sugar: z.number().optional(),
  sodium: z.number().optional(),
});

export type NutritionInfo = z.infer<typeof nutritionInfoSchema>;

// Meal Item Schema
export const mealItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  ingredients: z.array(z.string()),
  nutrition: nutritionInfoSchema,
  servingSize: z.string().optional(),
  prepTime: z.number().optional(),
  cookTime: z.number().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  tags: z.array(z.string()).optional(),
});

export type MealItem = z.infer<typeof mealItemSchema>;

// Day Meal Plan Schema
export const dayMealPlanSchema = z.object({
  breakfast: z.array(mealItemSchema),
  lunch: z.array(mealItemSchema),
  dinner: z.array(mealItemSchema),
  snacks: z.array(mealItemSchema),
  totalNutrition: nutritionInfoSchema,
});

export type DayMealPlan = z.infer<typeof dayMealPlanSchema>;

// Meal Plan Schema
export const mealPlanSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  days: z.array(dayMealPlanSchema),
  targetNutrition: nutritionInfoSchema,
  preferences: z.object({
    dietaryRestrictions: z.array(z.string()),
    allergies: z.array(z.string()),
    cuisines: z.array(z.string()),
  }),
  generatedAt: z.string(),
});

export type MealPlan = z.infer<typeof mealPlanSchema>;

// Swap Suggestion Schema
export const swapSuggestionSchema = z.object({
  id: z.string(),
  originalMeal: mealItemSchema,
  suggestedMeal: mealItemSchema,
  reason: z.string(),
  nutritionDelta: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fats: z.number(),
  }),
  compatibility: z.number().min(0).max(1), // 0-1 score
});

export type SwapSuggestion = z.infer<typeof swapSuggestionSchema>;

// API Response Schemas
export const apiErrorSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
  code: z.string().optional(),
});

export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    timestamp: z.string(),
  });

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  details: z.string().optional(),
  timestamp: z.string(),
});

// Form validation helpers
export function validateUserProfile(data: unknown): {
  data?: UserProfile;
  errors?: Record<string, string>;
} {
  const result = userProfileSchema.safeParse(data);

  if (result.success) {
    return { data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    errors[path] = issue.message;
  });

  return { errors };
}

export function validateMealPreferences(data: unknown): {
  data?: MealPreferences;
  errors?: Record<string, string>;
} {
  const result = mealPreferencesSchema.safeParse(data);

  if (result.success) {
    return { data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    errors[path] = issue.message;
  });

  return { errors };
}
