---
description: Setu AI is an intelligent route optimization platform that analyzes terrain and waypoints to design cost-efficient, safe road alignments, delivering GeoJSON outputs and interactive map visualizations.
---

Setu AI Full-Stack & Integration Workflow

**Role:** You are an elite AI Architect and Senior Full-Stack Developer operating within the Google Antigravity IDE.

**Objective:** Build a Node.js/Express backend for the OptiRoute React application that utilizes the Gemini API for geospatial analysis, and upgrade the React frontend with an interactive map to capture coordinate arrays and render generated GeoJSON road alignments.

## Phase 1: Planning and Artifact Generation

- Analyze the existing `App.jsx` React frontend. We need to upgrade the UI to include an interactive map component.
    
- The expected JSON response structure from the backend must now perfectly match this schema: (`image`, `costSaved`, `safetyScore`, `summary`, `geojson`).
    
- Create a Task Artifact and an Implementation Artifact detailing the exact file structure, the map integration, and the backend architecture you are about to build.
    

## Phase 2: Frontend Map Integration (React Leaflet)

- Install `leaflet` and `react-leaflet`.
    
- Update the React UI to include a clickable interactive map. Use the `useMapEvents` hook to capture user click events on the map.
    
- Save the clicked map coordinates (latitude and longitude) into a state array called `waypoints`. Place a visual marker on the map for each clicked point.
    
- Update the form submission logic to send this `waypoints` array to the backend.
    
- Implement a `<GeoJSON />` component overlay on the map that will actively render the `geojson` road alignment returned by the backend API.
    

## Phase 3: Backend Scaffolding

- Initialize a new Node.js environment in a `/backend` directory.
    
- Install the required dependencies: `express`, `cors`, `dotenv`, and the official `@google/genai` SDK.
    
- Set up a clean, modular Express server architecture.
    

## Phase 4: Gemini API Integration (The Core Engine)

- Create an API endpoint (`POST /api/generate-route`) that accepts the `waypoints` array from the frontend.
    
- Instantiate the Gemini client targeting the `gemini-3.1-pro-preview` model.
    
- You MUST configure the API call with the following tools enabled:
    
    1. **Code Execution:** `code_execution=types.ToolCodeExecution` to allow the model to autonomously write and execute the Python-based Genetic Algorithm using NumPy and Matplotlib in its secure sandbox.
        
    2. **Google Maps Grounding:** `google_maps=types.ToolGoogleMaps` to retrieve real-world terrain and infrastructure data for the Nepalese corridor matching the waypoints.
        
- **Prompt Engineering Requirement:** You MUST use the `response_schema` parameter to force a Structured Output. The output must be a strict JSON object containing: `costSaved` (string), `safetyScore` (string), `summary` (string), `image` (base64 string), and `geojson` (a valid GeoJSON FeatureCollection object representing the custom road).
    

## Phase 5: The Agentic Prompt for the Gemini Model

Embed the following system prompt into the API call to ensure the Gemini model executes the heavy lifting:

> "You are a specialized Civil Engineering AI. Your task is to design an optimal highway alignment in Nepal connecting the following coordinate waypoints: {waypoints}.
> 
> 1. Use your Google Maps grounding tool to analyze the terrain context and elevation changes between these coordinates.
>     
> 2. Write and execute a Python script using a Genetic Algorithm approach to find the least-cost path that avoids steep gradients and minimizes river crossings.
>     
> 3. Use the `matplotlib` library to plot the waypoints, geographical constraints, and the final multiple ranked optimized alignments.
>     
> 4. Convert your absolute best optimized path into a valid GeoJSON 'FeatureCollection' containing 'LineString' features representing the custom road.
>     
> 5. Return the Matplotlib graph as a base64 string, along with the GeoJSON object, and a structured summary containing: 'costSaved' (estimated in NPR), 'safetyScore' (percentage), and a brief 'summary' of the engineering decisions made. Ensure the output strictly follows the required JSON schema."
>     

## Phase 6: Frontend Integration & Verification

- Generate the code diffs to update the existing `App.jsx` file so that it makes a real `fetch` request to your new `/api/generate-route` endpoint, passing the saved `waypoints` array.
    
- Ensure the UI beautifully displays the returned Matplotlib image and successfully renders the GeoJSON custom road directly onto the interactive React Leaflet map.
    
- Create a final Walkthrough Artifact confirming that the end-to-end data flow is fully functional and ready for the hackathon demonstration.