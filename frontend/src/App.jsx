import { useState } from 'react';
import axios from 'axios';
import { Network, MapPin, Activity, DollarSign, X } from 'lucide-react';
import InteractiveMap from './components/InteractiveMap';
import './index.css';

function App() {
  const [waypoints, setWaypoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (waypoints.length < 2) {
      setError("Please select at least 2 waypoints on the map.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Map to object formats expected by Gemini if needed, or stick to arrays.
      const payload = {
        waypoints: waypoints.map((wp) => ({ lat: wp[0], lng: wp[1] }))
      };
      
      const response = await axios.post('http://localhost:3001/api/generate-route', payload);
      setResults(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "An error occurred while generating the route.");
    } finally {
      setLoading(false);
    }
  };

  const clearWaypoints = () => {
    setWaypoints([]);
    setResults(null);
    setError(null);
  };
  
  const removeWaypoint = (indexToRemove) => {
      setWaypoints(prev => prev.filter((_, idx) => idx !== indexToRemove));
  }

  return (
    <div className="app-container">
      {/* Sidebar Controls */}
      <aside className="sidebar">
        <h1>OptiRoute <Network size={28} style={{display: 'inline', verticalAlign: 'middle', marginLeft: '8px'}}/></h1>
        <p className="subtitle">Setu AI: Intelligent route optimization across challenging terrains.</p>

        <div className="waypoints-section">
          <h3>Waypoints</h3>
          <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>
            Click on the map to add target locations for the highway alignment.
          </p>
          
          {waypoints.length > 0 ? (
            <div className="waypoints-list">
              {waypoints.map((wp, i) => (
                <div key={i} className="waypoint-item">
                  <div className="waypoint-left">
                      <div className="waypoint-marker">{i + 1}</div>
                      <div className="waypoint-coords">
                        {wp[0].toFixed(4)}, {wp[1].toFixed(4)}
                      </div>
                  </div>
                  <button onClick={() => removeWaypoint(i)} className="remove-btn">
                      <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{padding: '1rem', border: '1px dashed #334155', borderRadius: '8px', textAlign: 'center', color: '#94a3b8', marginBottom: '1rem'}}>
              No waypoints selected
            </div>
          )}
          
          <div style={{display: 'flex', gap: '10px'}}>
              <button 
                className="btn" 
                onClick={handleGenerate} 
                disabled={waypoints.length < 2 || loading}
              >
                <MapPin size={18} /> Configure Alignment
              </button>
              {waypoints.length > 0 && (
                  <button 
                    className="btn" 
                    onClick={clearWaypoints} 
                    style={{backgroundColor: '#ef4444', flex: '0.3'}}
                  >
                    Clear
                  </button>
              )}
          </div>
          
          {error && (
            <div style={{color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem', padding: '0.8rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px'}}>
              {error}
            </div>
          )}
        </div>

        {/* Results Panel */}
        {results && (
          <div className="results-container">
            <h3>Alignment Summary</h3>
            <div className="metrics-grid" style={{marginTop: '1rem'}}>
              <div className="metric-card">
                <span className="metric-label"><DollarSign size={14} style={{display:'inline', verticalAlign:'sub'}} /> Cost Saved</span>
                <span className="metric-val">{results.costSaved}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label"><Activity size={14} style={{display:'inline', verticalAlign:'sub'}} /> Safety Score</span>
                <span className="metric-val">{results.safetyScore}</span>
              </div>
            </div>

            <div className="summary-box">
              {results.summary}
            </div>

            {results.image && (
              <div>
                <span className="metric-label">Matplotlib Analysis</span>
                {/* Ensure the image string has the correct data URI scheme */}
                <img 
                  src={results.image.startsWith('data:image') ? results.image : `data:image/png;base64,${results.image}`} 
                  alt="Route Analysis Plot" 
                  className="plot-image" 
                />
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Main Map Content */}
      <main className="map-container-wrapper">
        <InteractiveMap 
          waypoints={waypoints} 
          setWaypoints={setWaypoints} 
          geojson={results?.geojson}
        />
        
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <h3>Generating Route</h3>
            <p style={{marginTop: '0.5rem', opacity: 0.8, fontSize: '0.9rem'}}>Running genetic algorithms via Setu AI...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
