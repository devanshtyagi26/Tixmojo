# TixMojo Events Platform

A full-stack event booking platform built with React and Node.js.

## Project Structure

- `/src` - React frontend
- `/server` - Express API server

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Running the Application

#### 1. Start the API Server

```bash
cd server
npm install
npm run dev
```

The server will run on http://localhost:5000.

#### 2. Start the Frontend

In a separate terminal:

```bash
# In the root directory
npm install
npm run dev
```

The React app will run on http://localhost:5173.

## Features

- Browse and search events
- View event details
- Filter events by location
- Featured events and carousel
- Responsive design
- API-driven architecture

## Frontend Technologies

- React
- React Router
- Vite
- React Icons
- React Slick (carousel)
- i18next (internationalization)

## Backend Technologies

- Express
- Node.js
- Cors
- Helmet (security)
- Morgan (logging)

## API Endpoints

- `GET /api/events` - Get all events (supports location filter)
- `GET /api/events/spotlight` - Get spotlight/featured events
- `GET /api/events/flyers` - Get carousel flyers
- `GET /api/events/locations` - Get available locations
- `GET /api/events/:id` - Get event details by ID