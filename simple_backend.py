from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import os
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to import OpenAI for OpenRouter
try:
    import openai
    # Configure for OpenRouter
    openai_client = openai.OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENROUTER_API_KEY"),
        default_headers={
            "HTTP-Referer": os.getenv("SITE_URL", "http://localhost:3000"),
            "X-Title": os.getenv("SITE_NAME", "OptiBite AI Meal Planner"),
        }
    )
except ImportError:
    logger.warning("OpenAI not installed")
    openai = None
    openai_client = None
except Exception as e:
    logger.warning(f"OpenAI setup failed: {e}")
    openai = None
    openai_client = None

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
    """Generate an AI-powered personalized meal plan"""
    target_calories = bmr_data.recommended_calories
    
    # Try to generate AI meal plan first
    use_ai = os.getenv("USE_AI", "false").lower() == "true"
    
    if use_ai and openai_client:
        try:
            # Create detailed prompt for meal planning
            dietary_restrictions_text = ", ".join(user_data.dietary_restrictions) if user_data.dietary_restrictions else "none"
            
            prompt = f"""Create a personalized daily meal plan for someone with these specifications:

NUTRITIONAL TARGETS:
- Total daily calories: {target_calories:.0f}
- BMR: {bmr_data.bmr:.0f} calories
- TDEE: {bmr_data.tdee:.0f} calories
- Goal: {user_data.goal.replace('_', ' ')}

PERSONAL INFO:
- Age: {user_data.age}
- Sex: {user_data.sex}
- Weight: {user_data.weight} kg
- Height: {user_data.height} cm
- Activity level: {user_data.activity_level.replace('_', ' ')}
- Dietary restrictions: {dietary_restrictions_text}

Please provide a detailed meal plan with:
1. 4 meals: breakfast, lunch, dinner, snack
2. Each meal should include: name, detailed description, ingredients list, approximate calories, protein, carbs, and fats
3. Meals should be realistic, tasty, and aligned with the nutritional targets
4. Consider the dietary restrictions and personal goals
5. Include cooking instructions or preparation tips

Format as JSON with this structure:
{{
    "breakfast": {{
        "name": "meal name",
        "description": "detailed description",
        "calories": number,
        "protein": number (in grams),
        "carbs": number (in grams),
        "fats": number (in grams),
        "ingredients": ["ingredient1", "ingredient2", ...],
        "instructions": "preparation steps"
    }},
    "lunch": {{ ... }},
    "dinner": {{ ... }},
    "snack": {{ ... }}
}}"""

            response = openai_client.chat.completions.create(
                model="openai/gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": "You are OptiBite AI, a professional nutritionist and meal planning expert. Create detailed, personalized meal plans that are nutritionally balanced, realistic, and delicious. Always respond with valid JSON format."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=2000,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            # Try to parse the AI response as JSON
            try:
                import json
                ai_meals = json.loads(ai_response)
                
                # Validate and calculate totals
                total_protein = sum(meal.get("protein", 0) for meal in ai_meals.values())
                total_carbs = sum(meal.get("carbs", 0) for meal in ai_meals.values())
                total_fats = sum(meal.get("fats", 0) for meal in ai_meals.values())
                total_calories_calculated = sum(meal.get("calories", 0) for meal in ai_meals.values())
                
                return MealPlan(
                    meals=ai_meals,
                    total_calories=total_calories_calculated,
                    total_protein=total_protein,
                    total_carbs=total_carbs,
                    total_fats=total_fats
                )
                
            except json.JSONDecodeError:
                logger.error("Failed to parse AI meal plan JSON, falling back to basic plan")
                pass
                
        except Exception as ai_error:
            logger.error(f"AI meal plan generation failed: {ai_error}")
            pass
    
    # Fallback to basic meal plan
    # Simple meal distribution
    breakfast_cals = target_calories * 0.25
    lunch_cals = target_calories * 0.35
    dinner_cals = target_calories * 0.3
    snack_cals = target_calories * 0.1
    
    # Enhanced basic meals based on user preferences
    dietary_restrictions = user_data.dietary_restrictions or []
    is_vegetarian = any("vegetarian" in restriction.lower() for restriction in dietary_restrictions)
    is_vegan = any("vegan" in restriction.lower() for restriction in dietary_restrictions)
    
    # Adjust proteins based on dietary restrictions
    if is_vegan:
        protein_sources = ["Tofu", "Tempeh", "Lentils", "Chickpeas", "Quinoa", "Hemp seeds"]
        breakfast_protein = "Tofu scramble"
        lunch_protein = "Lentil patty"
        dinner_protein = "Tempeh"
    elif is_vegetarian:
        protein_sources = ["Greek yogurt", "Eggs", "Cottage cheese", "Beans", "Quinoa"]
        breakfast_protein = "Greek yogurt"
        lunch_protein = "Black bean"
        dinner_protein = "Eggs"
    else:
        protein_sources = ["Chicken breast", "Salmon", "Turkey", "Lean beef", "Eggs"]
        breakfast_protein = "Eggs"
        lunch_protein = "Grilled chicken"
        dinner_protein = "Salmon"
    
    meals = {
        "breakfast": {
            "name": f"Power {breakfast_protein} Bowl",
            "description": f"A nutritious breakfast featuring {breakfast_protein} with complex carbs and healthy fats to start your day strong.",
            "calories": breakfast_cals,
            "protein": breakfast_cals * 0.2 / 4,
            "carbs": breakfast_cals * 0.5 / 4,
            "fats": breakfast_cals * 0.3 / 9,
            "ingredients": [breakfast_protein, "Oatmeal", "Berries", "Almonds", "Chia seeds"],
            "instructions": "Prepare oatmeal, top with protein, berries, and nuts. Add chia seeds for extra nutrition."
        },
        "lunch": {
            "name": f"Balanced {lunch_protein} Plate",
            "description": f"A well-rounded lunch with {lunch_protein}, complex carbohydrates, and plenty of vegetables for sustained energy.",
            "calories": lunch_cals,
            "protein": lunch_cals * 0.25 / 4,
            "carbs": lunch_cals * 0.45 / 4,
            "fats": lunch_cals * 0.3 / 9,
            "ingredients": [lunch_protein, "Quinoa", "Mixed vegetables", "Avocado", "Olive oil"],
            "instructions": "Cook quinoa, prepare protein, sauté vegetables with olive oil, and combine with sliced avocado."
        },
        "dinner": {
            "name": f"Nutritious {dinner_protein} Dinner",
            "description": f"A satisfying dinner with {dinner_protein}, nutrient-dense vegetables, and healthy carbohydrates.",
            "calories": dinner_cals,
            "protein": dinner_cals * 0.3 / 4,
            "carbs": dinner_cals * 0.4 / 4,
            "fats": dinner_cals * 0.3 / 9,
            "ingredients": [dinner_protein, "Sweet potato", "Broccoli", "Spinach", "Olive oil"],
            "instructions": "Bake sweet potato, steam broccoli and spinach, prepare protein, and drizzle with olive oil."
        },
        "snack": {
            "name": "Energy Boost Snack",
            "description": "A perfect snack to maintain energy levels between meals with balanced macronutrients.",
            "calories": snack_cals,
            "protein": snack_cals * 0.15 / 4,
            "carbs": snack_cals * 0.55 / 4,
            "fats": snack_cals * 0.3 / 9,
            "ingredients": ["Apple", "Almond butter", "Greek yogurt" if not is_vegan else "Coconut yogurt"],
            "instructions": "Slice apple and serve with almond butter and a small portion of yogurt."
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

@app.post("/api/chat")
async def chat_endpoint(request: Dict[str, Any]):
    """Simple chat endpoint for meal suggestions"""
    try:
        message = request.get("message", "")
        if not message:
            return {"error": "Message is required"}
        
        # Check if we should use AI
        use_ai = os.getenv("USE_AI", "false").lower() == "true"
        
        if use_ai and openai_client:
            try:
                response = openai_client.chat.completions.create(
                    model="openai/gpt-4o",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are OptiBite AI, a professional nutritionist and meal planning assistant. Provide practical, science-based meal suggestions, cooking advice, and nutrition guidance. Keep responses helpful, concise, and actionable. Focus on healthy, balanced meals that fit users' dietary needs and preferences."
                        },
                        {
                            "role": "user",
                            "content": message
                        }
                    ],
                    max_tokens=500,
                    temperature=0.7
                )
                
                ai_response = response.choices[0].message.content.strip()
                return {
                    "response": ai_response,
                    "source": "AI (OpenRouter GPT-4o)"
                }
                
            except Exception as ai_error:
                logger.error(f"AI chat failed: {ai_error}")
                # Fall back to sample response
                pass
        
        # Sample responses based on keywords
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["breakfast", "morning"]):
            response = "For a healthy breakfast, try overnight oats with berries and nuts, or scrambled eggs with spinach and whole grain toast. Both provide sustained energy for your morning!"
        elif any(word in message_lower for word in ["lunch", "midday"]):
            response = "For lunch, consider a quinoa bowl with roasted vegetables and grilled chicken, or a hearty salad with mixed greens, avocado, and lean protein. These keep you satisfied without afternoon sluggishness."
        elif any(word in message_lower for word in ["dinner", "evening"]):
            response = "For dinner, try baked salmon with roasted sweet potatoes and steamed broccoli, or a stir-fry with tofu and colorful vegetables over brown rice. Light yet satisfying!"
        elif any(word in message_lower for word in ["snack", "hungry"]):
            response = "For healthy snacks, try apple slices with almond butter, Greek yogurt with berries, or a handful of mixed nuts. These provide energy without the crash!"
        elif any(word in message_lower for word in ["weight", "lose", "diet"]):
            response = "Focus on whole foods: lean proteins, vegetables, fruits, and whole grains. Portion control and regular meals help maintain steady energy. Consider meal prep for consistent healthy choices!"
        elif any(word in message_lower for word in ["vegetarian", "vegan", "plant"]):
            response = "Plant-based options: lentil curry, chickpea salads, black bean tacos, or Buddha bowls with quinoa. Ensure you get enough protein from legumes, nuts, and seeds!"
        else:
            response = "I'd love to help with your meal planning! Ask me about breakfast ideas, lunch suggestions, dinner recipes, healthy snacks, or specific dietary needs. What sounds good to you?"
        
        return {
            "response": response,
            "source": "Assistant"
        }
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        return {"error": f"Chat failed: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
