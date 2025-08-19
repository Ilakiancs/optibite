"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  const handleGetStarted = () => {
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {!showForm && <Hero onGetStarted={handleGetStarted} />}
        
        {showForm && (
          <section className="py-12 md:py-20">
            <div className="container">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-8">
                  Meal Planning Form
                </h1>
                <p className="text-xl text-gray-500 mb-8">
                  This feature is coming soon!
                </p>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
