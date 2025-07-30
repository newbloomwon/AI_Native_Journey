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
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [freezeAtStepStart, setFreezeAtStepStart] = useState(true);
  
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
                            left: `${(index / (selectedReaction.steps.length - 1)) * 100}%` 
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
            <div className="visualization-container">
              <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <OrbitControls />
                {selectedReaction && (
                  <MoleculeViewer 
                    moleculeData={selectedReaction.steps[currentStep].molecules} 
                    isPlaying={isPlaying}
                    freezeAtStepStart={freezeAtStepStart}
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