# Agri-Weather

A weather dashboard built for African farmers. Enter your city to get a 7-day weather forecast with an AI-generated summary, and upload a farm image for tree/canopy analysis.

## Features
- 7-day weather forecast with AI farming summary
- Farm image tree and canopy health analysis
- Real-time weather alerts via webhook
- Configurable alert types (heavy rain, storm, extreme heat, frost, high wind)

## Live Demo
[View on Railway](https://agri-weather.up.railway.app/)

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
- `POST /webhook` — Receives weather alerts from WeatherAI
- `GET /alerts` — Returns recent alerts to the frontend
- `GET /webhook/test` — Simulates a test alert

## Deployment
Deployed on Railway with environment variables set via the Railway dashboard.
