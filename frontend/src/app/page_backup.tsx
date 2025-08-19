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

interface ChatMessage {
  message: string;
  response: string;
  source: string;
  timestamp: Date;
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
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

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

  const resetApp = () => {
    setShowForm(false);
    setMealPlan(null);
    setShowChat(false);
    setChatHistory([]);
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
        {!showForm && !mealPlan && !showChat && (
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Welcome to OptiBite
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem', lineHeight: '1.6' }}>
              Your personal AI nutrition assistant. Get customized meal plans based on your goals, preferences, and lifestyle.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                style={buttonStyle}
                onClick={handleGetStarted}
                onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#3b82f6'}
              >
                Generate My AI Meal Plan
              </button>
              
              <button
                style={{ ...buttonStyle, backgroundColor: '#059669', border: '1px solid #059669' }}
                onClick={() => setShowChat(true)}
                onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#047857'}
                onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#059669'}
              >
                Chat with AI Nutritionist
              </button>
            </div>
            
            <p style={{ fontSize: '0.875rem', color: '#059669', marginTop: '1rem' }}>
              AI-Powered | Fully Personalized | Real-time Generation
            </p>
          </div>
        )}

        {/* Chat Interface */}
        {showChat && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>AI Nutritionist Chat</h2>
                <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '500' }}>
                  AI-Powered
                </span>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                Ask me anything about nutrition, meal planning, recipes, or healthy eating habits!
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '2rem' }}>
                <button
                  style={{ ...buttonStyle, backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db' }}
                  onClick={() => setShowChat(false)}
                >
                  Back to Home
                </button>
                <button
                  style={{ ...buttonStyle, backgroundColor: '#059669' }}
                  onClick={handleGetStarted}
                >
                  Create Meal Plan
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
