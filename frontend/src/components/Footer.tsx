export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
                O
              </div>
              <span className="font-bold">OptiBite</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered nutrition planning for a healthier lifestyle.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>BMR Calculation</li>
              <li>Meal Planning</li>
              <li>AI Descriptions</li>
              <li>Smart Swaps</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Nutrition Guide</li>
              <li>Health Tips</li>
              <li>Recipe Ideas</li>
              <li>Support</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 OptiBite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
