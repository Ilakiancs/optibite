"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Target, Zap } from "lucide-react"

interface HeroProps {
  onGetStarted: () => void
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      
      {/* Content */}
      <div className="relative container">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-muted/50">
            <Sparkles className="mr-2 h-3 w-3" />
            AI-Powered Nutrition Planning
          </div>
          
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Your Personal
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Meal Planning
              </span>
              Assistant
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get science-based nutrition plans tailored to your unique metabolic profile with AI-powered insights.
            </p>
          </div>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="text-base"
            >
              Start Planning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="text-base">
              Learn More
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
            <div className="flex flex-col items-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Precision Targeting</h3>
              <p className="text-sm text-muted-foreground text-center">
                Scientifically calculated BMR and calorie targets based on your physiology
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">AI-Enhanced</h3>
              <p className="text-sm text-muted-foreground text-center">
                Creative meal descriptions and smart ingredient suggestions powered by AI
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Instant Results</h3>
              <p className="text-sm text-muted-foreground text-center">
                Get your personalized meal plan in seconds with real-time optimization
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
