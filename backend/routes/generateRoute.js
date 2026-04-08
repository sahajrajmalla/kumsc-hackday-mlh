const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();

let ai;
try {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (e) {
  console.warn("Could not initialized GoogleGenAI check api key.");
}

const systemPrompt = `You are a specialized Civil Engineering AI. Your task is to design an optimal highway alignment in Nepal connecting the following coordinate waypoints: {waypoints}.

1. Use your Google Maps grounding tool to analyze the terrain context and elevation changes between these coordinates.
2. Write and execute a Python script using a Genetic Algorithm approach to find the least-cost path that avoids steep gradients and minimizes river crossings.
3. Use the matplotlib library to plot the waypoints, geographical constraints, and the final multiple ranked optimized alignments.
4. Convert your absolute best optimized path into a valid GeoJSON 'FeatureCollection' containing 'LineString' features representing the custom road.
5. Return the Matplotlib graph as a base64 string, along with the GeoJSON object, and a structured summary containing: 'costSaved' (estimated in NPR), 'safetyScore' (percentage), and a brief 'summary' of the engineering decisions made. Ensure the output strictly follows the required JSON schema.`;

router.post('/generate-route', async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: 'GoogleGenAI client not initialized, please check API Key.' });
  }

  try {
    const { waypoints } = req.body;
    if (!waypoints || !waypoints.length) {
      return res.status(400).json({ error: 'Waypoints are required' });
    }

    const waypointsString = JSON.stringify(waypoints);
    const prompt = systemPrompt.replace('{waypoints}', waypointsString);

    const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
            tools: [{ googleMaps: {} }, { codeExecution: {} }],
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    costSaved: { type: "STRING" },
                    safetyScore: { type: "STRING" },
                    summary: { type: "STRING" },
                    image: { type: "STRING", description: "Base64 encoded Matplotlib image of the constraints and optimized path" },
                    geojson: { 
                        type: "OBJECT", 
                        description: "Valid GeoJSON FeatureCollection object with Linestring features",
                        properties: {
                            type: { type: "STRING" },
                            features: {
                                type: "ARRAY",
                                items: {
                                    type: "OBJECT",
                                    properties: {
                                        type: { type: "STRING" },
                                        geometry: { type: "OBJECT" },
                                        properties: { type: "OBJECT" }
                                    }
                                }
                            }
                        }
                    }
                },
                required: ["costSaved", "safetyScore", "summary", "image", "geojson"]
            }
        }
    });

    let routeData;
    try {
        routeData = JSON.parse(response.text);
    } catch (parseErr) {
        console.error('Failed to parse response JSON:', response.text);
        return res.status(500).json({ error: 'Failed to parse model response' });
    }
    
    res.json(routeData);
  } catch (err) {
    console.error('Error generating route:', err);
    res.status(500).json({ error: 'Failed to generate route', details: err.message });
  }
});

module.exports = router;
