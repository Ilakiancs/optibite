from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json

app = FastAPI(title="OptiBite API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserData(BaseModel):
    weight: float
    height: float
    age: int
    sex: str
    activity_level: str
    goal: str
    dietary_restrictions: List[str] = []

class MealPlan(BaseModel):
    meals: dict
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fats: float

class BMRData(BaseModel):
    bmr: float
    tdee: float
    recommended_calories: float

# Mock data and functions
def calculate_bmr(user_data: UserData) -> BMRData:
    """Calculate BMR using Mifflin-St Jeor equation"""
    if user_data.sex.lower() == 'male':
        bmr = 10 * user_data.weight + 6.25 * user_data.height - 5 * user_data.age + 5
    else:
        bmr = 10 * user_data.weight + 6.25 * user_data.height - 5 * user_data.age - 161
    
    activity_multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9
    }
    
    tdee = bmr * activity_multipliers.get(user_data.activity_level, 1.55)
    
    # Adjust based on goal
    if user_data.goal == 'lose_weight':
        recommended_calories = tdee - 500
    elif user_data.goal == 'gain_weight':
        recommended_calories = tdee + 500
    else:
        recommended_calories = tdee
    
    return BMRData(
        bmr=bmr,
        tdee=tdee,
        recommended_calories=recommended_calories
    )

def generate_meal_plan(user_data: UserData, bmr_data: BMRData) -> MealPlan:
    """Generate a sample meal plan"""
    target_calories = bmr_data.recommended_calories
    
    # Simple meal distribution
    breakfast_cals = target_calories * 0.25
    lunch_cals = target_calories * 0.35
    dinner_cals = target_calories * 0.3
    snack_cals = target_calories * 0.1
    
    meals = {
        "breakfast": {
            "name": "Healthy Breakfast Bowl",
            "calories": breakfast_cals,
            "protein": breakfast_cals * 0.2 / 4,
            "carbs": breakfast_cals * 0.5 / 4,
            "fats": breakfast_cals * 0.3 / 9,
            "ingredients": ["Oatmeal", "Berries", "Greek yogurt", "Almonds"]
        },
        "lunch": {
            "name": "Balanced Lunch",
            "calories": lunch_cals,
            "protein": lunch_cals * 0.25 / 4,
            "carbs": lunch_cals * 0.45 / 4,
            "fats": lunch_cals * 0.3 / 9,
            "ingredients": ["Grilled chicken", "Quinoa", "Mixed vegetables", "Olive oil"]
        },
        "dinner": {
            "name": "Nutritious Dinner",
            "calories": dinner_cals,
            "protein": dinner_cals * 0.3 / 4,
            "carbs": dinner_cals * 0.4 / 4,
            "fats": dinner_cals * 0.3 / 9,
            "ingredients": ["Salmon", "Sweet potato", "Broccoli", "Avocado"]
        },
        "snack": {
            "name": "Healthy Snack",
            "calories": snack_cals,
            "protein": snack_cals * 0.15 / 4,
            "carbs": snack_cals * 0.55 / 4,
            "fats": snack_cals * 0.3 / 9,
            "ingredients": ["Apple", "Peanut butter"]
        }
    }
    
    total_protein = sum(meal["protein"] for meal in meals.values())
    total_carbs = sum(meal["carbs"] for meal in meals.values())
    total_fats = sum(meal["fats"] for meal in meals.values())
    
    return MealPlan(
        meals=meals,
        total_calories=target_calories,
        total_protein=total_protein,
        total_carbs=total_carbs,
        total_fats=total_fats
    )

# API Routes
@app.get("/")
async def root():
    return {"message": "OptiBite API is running"}

@app.post("/calculate-bmr")
async def calculate_bmr_endpoint(user_data: UserData):
    try:
        bmr_data = calculate_bmr(user_data)
        return bmr_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/generate-meal-plan")
async def generate_meal_plan_endpoint(user_data: UserData):
    try:
        bmr_data = calculate_bmr(user_data)
        meal_plan = generate_meal_plan(user_data, bmr_data)
        return {
            "bmr_data": bmr_data,
            "meal_plan": meal_plan
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/generate-descriptions")
async def generate_descriptions(meal_plan: dict):
    """Generate AI descriptions for meals"""
    descriptions = {}
    for meal_key, meal_data in meal_plan.get("meals", {}).items():
        descriptions[meal_key] = f"A delicious and nutritious {meal_data.get('name', meal_key)} packed with wholesome ingredients to fuel your day."
    return descriptions

@app.post("/swap-suggestions")
async def suggest_balanced_swap_endpoint(request: dict):
    """Generate swap suggestions for ingredients"""
    meal_key = request.get("meal_key")
    ingredient = request.get("ingredient")
    
    # Mock swap suggestions
    swap_suggestions = [
        {
            "original": ingredient,
            "alternative": f"Organic {ingredient}",
            "reason": "Higher quality and more nutrients",
            "nutrition_change": "Higher antioxidants"
        },
        {
            "original": ingredient,
            "alternative": f"Low-sodium {ingredient}",
            "reason": "Better for heart health",
            "nutrition_change": "Reduced sodium content"
        }
    ]
    
    return {"suggestions": swap_suggestions}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
