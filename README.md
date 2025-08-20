# OptiBite AI Meal Planner

**Personalized Nutrition Planning with AI-Powered Meal Generation**

OptiBite is a modern web application that creates personalized meal plans using artificial intelligence and advanced nutritional calculations. Built with Next.js and FastAPI, it combines precise metabolic calculations with AI-generated meal suggestions to provide comprehensive nutrition planning.

## Overview

OptiBite addresses the complexity of meal planning by integrating scientific nutrition calculations with AI creativity. The application calculates your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE), then uses OpenRouter's GPT-4o model to generate detailed, personalized meal plans with cooking instructions and nutritional breakdowns.

## Features

### Core Functionality
- **Accurate BMR/TDEE Calculation**: Uses the Mifflin-St Jeor equation for precise metabolic rate estimation
- **AI-Powered Meal Generation**: Leverages OpenRouter API with GPT-4o for creative, detailed meal planning
- **Personalized Nutrition Targets**: Customized calorie and macronutrient recommendations based on goals
- **Detailed Meal Plans**: Complete meals with ingredients, instructions, and nutritional information
- **Dietary Restriction Support**: Accommodates vegetarian, vegan, and other dietary preferences
- **Interactive AI Chat**: Real-time nutrition consultation with AI nutritionist

### User Experience
- **Modern Responsive Design**: Clean, accessible interface optimized for all devices
- **Real-time Generation**: Instant meal plan creation and nutritional analysis
- **Interactive Chat Interface**: Direct communication with AI nutritionist for personalized advice
- **Comprehensive Results**: Detailed daily nutrition summaries with meal breakdowns
- **Professional UI Components**: Custom-built interface with smooth interactions

## Technology Stack

### Frontend
- **Next.js 15.4.7**: React framework with Turbopack for fast development
- **TypeScript**: Type-safe development with enhanced IDE support
- **TailwindCSS**: Utility-first CSS framework for responsive design
- **Custom UI Components**: Professional interface components for optimal user experience

### Backend
- **FastAPI**: High-performance Python web framework
- **Python 3.13**: Modern Python with advanced features
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server for production deployment

### AI Integration
- **OpenRouter API**: Advanced AI model routing platform
- **GPT-4o**: State-of-the-art language model for meal generation
- **Intelligent Fallbacks**: Keyword-based responses when AI is unavailable
- **Custom Prompts**: Specialized nutrition and meal planning instructions

### Development Tools
- **Virtual Environment**: Isolated Python environment for dependencies
- **Environment Configuration**: Secure API key and settings management
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Error Handling**: Comprehensive error management and user feedback

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- Python 3.9 or higher
- npm or yarn package manager
- OpenRouter API account and key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ilakiancs/optibite.git
   cd optibite
   ```

2. **Backend Setup**
   ```bash
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install Python dependencies
   pip install fastapi uvicorn python-dotenv openai python-multipart
   ```

3. **Frontend Setup**
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Install Node.js dependencies
   npm install
   ```

4. **Environment Configuration**
   ```bash
   # Create environment file in root directory
   cp env.example .env
   
   # Edit .env with your OpenRouter API key
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   USE_AI=true
   SITE_URL=http://localhost:3000
   SITE_NAME=OptiBite AI Meal Planner
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   # From project root, with virtual environment activated
   python simple_backend.py
   # Server runs on http://localhost:8002
   ```

2. **Start the Frontend Development Server**
   ```bash
   # From frontend directory
   npm run dev
   # Application available at http://localhost:3000
   ```

3. **Access the Application**
   - Open your browser to `http://localhost:3000`
   - Fill out the personal information form
   - Generate your personalized meal plan
   - Chat with the AI nutritionist for additional guidance

## API Configuration

### OpenRouter Setup
1. Visit [OpenRouter](https://openrouter.ai/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Generate a new API key
5. Add the key to your `.env` file

### Environment Variables
```bash
# Required Configuration
OPENROUTER_API_KEY=your_api_key_here
USE_AI=true

# Optional Configuration
SITE_URL=http://localhost:3000
SITE_NAME=OptiBite AI Meal Planner
DEBUG=true
```

## Project Structure
```
optibite/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utility functions
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── simple_backend.py        # FastAPI backend server
├── requirements.txt         # Python dependencies
├── .env                     # Environment configuration
└── README.md               
```

## Features in Detail

### Meal Plan Generation
- Calculates precise caloric needs based on age, gender, weight, height, and activity level
- Generates complete meal plans with breakfast, lunch, dinner, and snacks
- Provides detailed nutritional breakdowns for each meal
- Includes cooking instructions and ingredient lists
- Adapts to dietary restrictions and preferences

### AI Nutritionist Chat
- Real-time conversation with AI-powered nutritionist
- Personalized nutrition advice and meal suggestions
- Answers questions about healthy eating and meal planning
- Provides cooking tips and ingredient substitutions

### Nutritional Calculations
- BMR calculation using Mifflin-St Jeor equation
- TDEE calculation with activity level multipliers
- Goal-based calorie adjustments for weight management
- Balanced macronutrient distribution

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenRouter for providing access to advanced AI models
- Next.js team for the excellent React framework
- FastAPI team for the high-performance Python framework
- TailwindCSS for the utility-first CSS framework
