# OptiBite

**Intelligent Meal Planning Powered by Advanced Algorithms and AI**

OptiBite is a modern, web-based meal planning application that generates personalized nutrition plans using optimization algorithms and natural language processing. Built with Python and Streamlit, it provides an intuitive interface for creating balanced meal plans tailored to individual metabolic needs and dietary preferences.

## Overview

OptiBite combines mathematical optimization with artificial intelligence to solve the complex problem of meal planning. The application calculates your Basal Metabolic Rate (BMR), applies advanced algorithms to select optimal ingredient combinations, and uses AI to generate creative meal descriptions and suggestions.

## Key Features

### Core Functionality
- **Personalized BMR Calculation**: Uses the Mifflin-St Jeor equation for accurate metabolic rate estimation
- **Advanced Meal Optimization**: Implements both greedy and knapsack algorithms for optimal ingredient selection
- **AI-Powered Meal Generation**: Leverages Llama-3 70B via Groq API for creative meal naming and descriptions
- **Smart Swap Suggestions**: Intelligent ingredient replacement recommendations with nutritional impact analysis
- **Multi-Unit Support**: Supports both metric (kg, cm) and imperial (lb, ft+in) measurement systems

### User Experience
- **Modern Responsive Design**: Clean, accessible interface optimized for all devices
- **Real-time Optimization**: Instant meal plan generation and calorie distribution
- **Interactive Components**: Dynamic forms with validation and user feedback
- **Progress Indicators**: Visual feedback for long-running operations
- **Error Handling**: Comprehensive error states with helpful guidance

## Tech Stack

### Backend
- **Python 3.9+**: Core application logic and algorithms
- **Streamlit 1.35.0**: Web framework and UI components
- **Pandas 2.0.3**: Data manipulation and analysis
- **Requests 2.31.0**: HTTP client for API communications

### AI & External Services
- **Groq API**: LLM integration for natural language generation
- **Llama-3 70B**: Large language model for meal creativity
- **OpenAI API**: Alternative AI provider support

### Development & Testing
- **Pytest**: Comprehensive test suite with mocking
- **Black**: Code formatting and style consistency  
- **Flake8**: Linting and code quality checks
- **MyPy**: Static type checking and validation

## Getting Started

### Prerequisites
- Python 3.9 or higher
- pip package manager
- Groq API account and key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd optibite
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

### Quick Start
```bash
# Activate virtual environment
source venv/bin/activate

# Run the application
streamlit run optibite_app.py

# Access at http://localhost:8501
```

## Configuration

### Environment Variables
OptiBite uses environment-based configuration for flexibility and security.

#### Required Configuration
```bash
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here
```

### API Key Setup
1. Visit [Groq Console](https://console.groq.com/)
2. Create account or sign in
3. Navigate to API Keys section
4. Generate new API key
5. Add to `.streamlit/secrets.toml`

## License

This project is licensed under the MIT License.

---

**Built with precision, powered by intelligence, designed for everyone.**
