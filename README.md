# Agri-Weather

A weather dashboard built for African farmers. Enter your city to get a 7-day weather forecast with an AI-generated summary, and upload a farm image for tree/canopy analysis.

## Live Demo
[View on Railway](agri-weather-production.up.railway.app)

## Tech Stack
- Node.js + Express (backend)
- Plain HTML + CSS (frontend)
- WeatherAI API (weather data + tree analysis)

## Setup Instructions

### 1. Clone the repo
git clone https://github.com/Cherubismark/agri-weather.git
cd agri-weather

### 2. Install dependencies
npm install

### 3. Create a .env file
WEATHER_API_KEY=your_api_key_here
PORT=3000

### 4. Run the app
node server.js

Then open http://localhost:3000 in your browser.

## API Endpoints
- `GET /weather?lat=&lon=` — Returns 7-day forecast + AI summary
- `POST /trees` — Accepts a farm image and returns canopy analysis

## Deployment
Deployed on Railway with environment variables set via the Railway dashboard.
