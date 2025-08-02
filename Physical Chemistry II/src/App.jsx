import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import MoleculeViewer from './components/MoleculeViewer';
import ReactionSelector from './components/ReactionSelector';
import InfoPanel from './components/InfoPanel';
import { reactionTypes } from './data/reactionData';
import './App.css';
import './components/ReactionSelector.css';
import './components/InfoPanel.css';

function App() {
  const [selectedReaction, setSelectedReaction] = useState(reactionTypes[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [freezeAtStepStart, setFreezeAtStepStart] = useState(false);
  const [showElectrons, setShowElectrons] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  const handleReactionChange = (reactionId) => {
    const reaction = reactionTypes.find(r => r.id === reactionId);
    setSelectedReaction(reaction);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepChange = (step) => {
    // If we're jumping to a new step, pause the animation
    if (step !== currentStep) {
      setCurrentStep(step);
      setIsPlaying(false);
    }
  };

  const handleMarkerClick = (step) => {
    // Jump to the specific step and pause at the first frame
    setCurrentStep(step);
    setIsPlaying(false);
  };

  const toggleFreezeOption = () => {
    setFreezeAtStepStart(!freezeAtStepStart);
  };

  const toggleElectrons = () => {
    setShowElectrons(!showElectrons);
  };

  // Zoom control functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 5.0));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleResetView = () => {
    setZoomLevel(1.0);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Molecular Dynamics Visualization</h1>
        <p>Visualize atom and molecule interactions for better understanding of physical chemistry</p>
      </header>

      <main className="app-main">
        <div className="left-panel">
          <div className="controls-panel">
            <ReactionSelector
              reactions={reactionTypes}
              selectedReaction={selectedReaction}
              onReactionChange={handleReactionChange}
            />

            {selectedReaction && (
              <div className="playback-controls">
                <div className="controls-top-row">
                  <div className="play-button-container">
                    <button
                      onClick={handlePlayPause}
                      className="play-button"
                      data-testid="play-button"
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </button>
                  </div>
                  <div className="freeze-toggle-container">
                    <label className="freeze-toggle-label">
                      <input
                        type="checkbox"
                        checked={freezeAtStepStart}
                        onChange={toggleFreezeOption}
                        className="freeze-toggle-input"
                        data-testid="freeze-toggle"
                      />
                      <span className="freeze-toggle-text">Freeze at step start</span>
                    </label>
                  </div>
                </div>
                <div className="step-controls">
                  <div className="step-slider-container">
                    <input
                      type="range"
                      min="0"
                      max={selectedReaction.steps.length - 1}
                      value={currentStep}
                      onChange={(e) => handleStepChange(parseInt(e.target.value))}
                      className="step-slider"
                    />
                    <div className="step-markers">
                      {selectedReaction.steps.map((step, index) => (
                        <div
                          key={`marker-${index}`}
                          className={`step-marker ${currentStep === index ? 'active' : ''}`}
                          style={{
                            left: `${(index / (selectedReaction.steps.length - 1)) * 100}%`,
                          }}
                          data-testid={`step-marker-${index}`}
                          onClick={() => handleMarkerClick(index)}
                          title={step.title}
                        >
                          <span className="marker-tooltip">{step.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="step-info">
                    <span data-testid="current-step" style={{ display: 'none' }}>{currentStep}</span>
                    <span data-testid="step-display">Step {currentStep + 1} of {selectedReaction.steps.length}: {selectedReaction.steps[currentStep].title}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="right-panel">
          <div className="visualization-and-info">
            <div className="visualization-container" style={{ position: 'relative' }}>
              {selectedReaction && (
                <div style={{
                  position: 'absolute',
                  top: '10%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  zIndex: 1000,
                }}>
                  <button
                    onClick={toggleElectrons}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: showElectrons ? '#FF5722' : '#9C27B0',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    {showElectrons ? 'Hide Electrons' : 'Show Electrons'}
                  </button>
                  <button
                    onClick={handleZoomIn}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    Zoom In
                  </button>
                  <button
                    onClick={handleZoomOut}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    Zoom Out
                  </button>
                  <button
                    onClick={handleResetView}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#FF9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    Reset
                  </button>
                  <div style={{
                    padding: '4px 8px',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500',
                    minWidth: '50px',
                    textAlign: 'center',
                  }}>
                    {zoomLevel.toFixed(1)}x
                  </div>
                </div>
              )}
              <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <OrbitControls />
                {selectedReaction && (
                  <MoleculeViewer
                    moleculeData={selectedReaction.steps[currentStep].molecules}
                    isPlaying={isPlaying}
                    freezeAtStepStart={freezeAtStepStart}
                    showElectrons={showElectrons}
                    zoomLevel={zoomLevel}
                    onStepComplete={() => {
                      if (currentStep < selectedReaction.steps.length - 1) {
                        setCurrentStep(currentStep + 1);
                        // If freezeAtStepStart is enabled, pause at the beginning of the next step
                        if (freezeAtStepStart) {
                          setIsPlaying(false);
                        }
                      } else {
                        setIsPlaying(false);
                      }
                    }}
                  />
                )}
              </Canvas>
            </div>

            {selectedReaction && (
              <div className="reaction-info-container">
                <InfoPanel
                  reactionInfo={selectedReaction}
                  currentStep={currentStep}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2025 Molecular Dynamics Visualization Tool</p>
      </footer>
    </div>
  );
}

export default App;
