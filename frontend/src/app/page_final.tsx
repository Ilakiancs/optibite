"use client";

import { useState } from "react";

interface UserData {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  goal: string;
}

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    age: 25,
    gender: "male",
    height: 170,
    weight: 70,
    activityLevel: "moderate",
    goal: "maintain_weight",
  });
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [message, setMessage] = useState("");

  const cardStyle = {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
    outline: 'none',
  };

  const selectStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: 'white',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#374151',
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleGetStarted = () => {
    setShowForm(true);
  };

  const handleInputChange = (field: keyof UserData, value: string | number) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!userData.gender || !userData.activityLevel || !userData.goal) {
      showMessage("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8002/generate-meal-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weight: userData.weight,
          height: userData.height,
          age: userData.age,
          sex: userData.gender,
          activity_level: userData.activityLevel,
          goal: userData.goal,
          dietary_restrictions: [],
          allergies: [],
          preferred_cuisines: [],
          meals_per_day: 4,
          target_macros: { protein: 25, carbs: 45, fats: 30 },
          calorie_adjustment: 0,
          disliked_foods: [],
          notes: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMealPlan(data);
      showMessage("Your meal plan has been generated!");
    } catch (error) {
      console.error("Error:", error);
      showMessage("Failed to generate meal plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setShowForm(false);
    setMealPlan(null);
    setUserData({
      name: "",
      age: 25,
      gender: "male",
      height: 170,
      weight: 70,
      activityLevel: "moderate",
      goal: "maintain_weight",
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>OptiBite</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>AI-Powered Meal Planning</p>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          backgroundColor: message.includes('failed') || message.includes('fill') ? '#fee2e2' : '#d1fae5',
          color: message.includes('failed') || message.includes('fill') ? '#dc2626' : '#065f46',
          padding: '1rem',
          borderRadius: '8px',
          border: `1px solid ${message.includes('failed') || message.includes('fill') ? '#fca5a5' : '#86efac'}`,
          zIndex: 1000,
          maxWidth: '400px',
        }}>
          {message}
        </div>
      )}

      <main style={{ flex: 1, padding: '2rem' }}>
        {/* Landing Hero */}
        {!showForm && !mealPlan && (
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Welcome to OptiBite
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '3rem', lineHeight: '1.6' }}>
              Your personal AI nutrition assistant. Get customized meal plans based on your goals, preferences, and lifestyle.
            </p>
            <button
              style={buttonStyle}
              onClick={handleGetStarted}
              onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#3b82f6'}
            >
              Get Started
            </button>
          </div>
        )}

        {/* User Form */}
        {showForm && !mealPlan && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={cardStyle}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem' }}>
                Tell Us About Yourself
              </h2>
              <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
                We'll create a personalized meal plan for you
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <label style={labelStyle}>Name (Optional)</label>
                  <input
                    style={inputStyle}
                    value={userData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Age *</label>
                  <input
                    style={inputStyle}
                    type="number"
                    value={userData.age}
                    onChange={(e) => handleInputChange("age", parseInt(e.target.value) || 0)}
                    placeholder="25"
                    min="13"
                    max="120"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Gender *</label>
                  <select
                    style={selectStyle}
                    value={userData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Height (cm) *</label>
                  <input
                    style={inputStyle}
                    type="number"
                    value={userData.height}
                    onChange={(e) => handleInputChange("height", parseFloat(e.target.value) || 0)}
                    placeholder="170"
                    min="100"
                    max="250"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Weight (kg) *</label>
                  <input
                    style={inputStyle}
                    type="number"
                    value={userData.weight}
                    onChange={(e) => handleInputChange("weight", parseFloat(e.target.value) || 0)}
                    placeholder="70"
                    min="30"
                    max="300"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Activity Level *</label>
                  <select
                    style={selectStyle}
                    value={userData.activityLevel}
                    onChange={(e) => handleInputChange("activityLevel", e.target.value)}
                  >
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                    <option value="very_active">Very Active</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={labelStyle}>Goal *</label>
                <select
                  style={selectStyle}
                  value={userData.goal}
                  onChange={(e) => handleInputChange("goal", e.target.value)}
                >
                  <option value="">Select your goal</option>
                  <option value="lose_weight">Lose Weight</option>
                  <option value="maintain_weight">Maintain Weight</option>
                  <option value="gain_weight">Gain Weight</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1.5rem' }}>
                <button
                  style={{ ...buttonStyle, backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db' }}
                  onClick={() => setShowForm(false)}
                >
                  Back
                </button>
                <button
                  style={{ ...buttonStyle, backgroundColor: loading ? '#9ca3af' : '#3b82f6' }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Meal Plan"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {mealPlan && (
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={cardStyle}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Your Meal Plan</h2>
              <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                Here's your personalized meal plan
              </p>

              {mealPlan.bmr_data && (
                <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '1.25rem' }}>
                    Your Nutrition Targets
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
                    <div>
                      <span style={{ fontWeight: '500' }}>BMR:</span> {Math.round(mealPlan.bmr_data.bmr)} cal
                    </div>
                    <div>
                      <span style={{ fontWeight: '500' }}>TDEE:</span> {Math.round(mealPlan.bmr_data.tdee)} cal
                    </div>
                    <div>
                      <span style={{ fontWeight: '500' }}>Target:</span> {Math.round(mealPlan.bmr_data.recommended_calories)} cal
                    </div>
                    <div>
                      <span style={{ fontWeight: '500' }}>Protein:</span> {Math.round(mealPlan.bmr_data.macros.protein)}g
                    </div>
                  </div>
                </div>
              )}

              {mealPlan.meal_plan && mealPlan.meal_plan.days && mealPlan.meal_plan.days.length > 0 && (
                <div>
                  <h3 style={{ fontWeight: '600', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Day 1 Meals</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {Object.entries(mealPlan.meal_plan.days[0]).map(([mealType, meals]) => {
                      if (mealType === "total_nutrition" || !Array.isArray(meals)) return null;

                      return (
                        <div key={mealType} style={{ ...cardStyle, padding: '1.5rem' }}>
                          <h4 style={{ fontSize: '1.125rem', fontWeight: '600', textTransform: 'capitalize', marginBottom: '1rem', color: '#1f2937' }}>
                            {mealType}
                          </h4>
                          {(meals as any[]).map((meal: any, index: number) => (
                            <div key={index} style={{ marginBottom: index === meals.length - 1 ? 0 : '1rem', paddingBottom: index === meals.length - 1 ? 0 : '1rem', borderBottom: index === meals.length - 1 ? 'none' : '1px solid #f3f4f6' }}>
                              <h5 style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#374151' }}>
                                {meal.name}
                              </h5>
                              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                {Math.round(meal.nutrition.calories)} cal
                              </p>
                              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                Ingredients: {meal.ingredients.slice(0, 3).join(", ")}
                                {meal.ingredients.length > 3 && "..."}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem' }}>
                <button style={buttonStyle} onClick={resetApp}>
                  Create New Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb', padding: '2rem 0', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', margin: 0 }}>© 2025 OptiBite. Your AI-powered nutrition assistant.</p>
        </div>
      </footer>
    </div>
  );
}
