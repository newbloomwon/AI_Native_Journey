import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import * as THREE from 'three';
import './GasLawSimulator.css';

// Gas particle component
function GasParticle({ position, velocity, containerBounds, temperature, pressure }) {
  const meshRef = useRef();
  const velocityRef = useRef(velocity);
  const positionRef = useRef(position);
  const collisionCountRef = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Update position based on velocity and temperature
    const speedMultiplier = temperature * 2; // Higher temperature = faster movement
    positionRef.current[0] += velocityRef.current[0] * delta * speedMultiplier;
    positionRef.current[1] += velocityRef.current[1] * delta * speedMultiplier;
    positionRef.current[2] += velocityRef.current[2] * delta * speedMultiplier;

    // Bounce off container walls with collision counting
    const bounds = containerBounds;
    for (let i = 0; i < 3; i++) {
      if (positionRef.current[i] > bounds[i] || positionRef.current[i] < -bounds[i]) {
        velocityRef.current[i] *= -1;
        positionRef.current[i] = Math.max(-bounds[i], Math.min(bounds[i], positionRef.current[i]));
        collisionCountRef.current++;
      }
    }

    meshRef.current.position.set(...positionRef.current);
  });

  // Color changes based on pressure (higher pressure = more red/energetic)
  const particleColor = pressure > 1.5 ? '#FF5722' : pressure > 1.2 ? '#FF9800' : '#4CAF50';

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[3.375, 8, 8]} />
      <meshStandardMaterial color={particleColor} />
    </mesh>
  );
}

// Container walls component
function Container({ dimensions, pressure }) {
  const [width, height, depth] = dimensions;
  
  // Wall color intensity based on pressure (visual feedback)
  const wallIntensity = Math.min(pressure / 2.0, 1.0);
  const wallColor = new THREE.Color().setHSL(0.6 - (wallIntensity * 0.2), 0.8, 0.7);
  
  return (
    <group>
      {/* Container walls - wireframe with pressure-based color */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width * 2, height * 2, depth * 2)]} />
        <lineBasicMaterial color={wallColor} linewidth={3} />
      </lineSegments>
      
      {/* Semi-transparent container walls with pressure visualization */}
      <mesh>
        <boxGeometry args={[width * 2, height * 2, depth * 2]} />
        <meshStandardMaterial 
          color={wallColor}
          transparent 
          opacity={0.1 + (wallIntensity * 0.15)} 
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Gas visualization component
function GasVisualization({ volume, pressure, temperature, particleCount, zoomLevel = 1.0 }) {
  const groupRef = useRef();
  const containerDimensions = [
    Math.cbrt(volume) * 16.875, // 5.625 * 3 = 16.875 (300% increase for larger view)
    Math.cbrt(volume) * 16.875,
    Math.cbrt(volume) * 16.875
  ];

  // Generate particles with random positions and velocities
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    position: [
      (Math.random() - 0.5) * containerDimensions[0] * 1.8,
      (Math.random() - 0.5) * containerDimensions[1] * 1.8,
      (Math.random() - 0.5) * containerDimensions[2] * 1.8
    ],
    velocity: [
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    ]
  }));

  // Apply zoom level to the group
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.scale.setScalar(zoomLevel);
    }
  });

  return (
    <group ref={groupRef}>
      <Container dimensions={containerDimensions} pressure={pressure} />
      {particles.map(particle => (
        <GasParticle
          key={particle.id}
          position={particle.position}
          velocity={particle.velocity}
          containerBounds={containerDimensions}
          temperature={temperature}
          pressure={pressure}
        />
      ))}
      
      {/* Display current values with enhanced formatting */}
      <Text
        position={[0, containerDimensions[1] + 1, 0]}
        fontSize={0.5}
        color={pressure > 1.5 ? "#FF5722" : "#1976D2"}
        anchorX="center"
        anchorY="middle"
      >
        {`V: ${volume.toFixed(1)} L | P: ${pressure.toFixed(2)} atm | T: ${temperature.toFixed(1)}x`}
      </Text>
      
      {/* Pressure indicator */}
      <Text
        position={[0, containerDimensions[1] + 0.5, 0]}
        fontSize={0.3}
        color={pressure > 1.5 ? "#FF5722" : pressure > 1.2 ? "#FF9800" : "#4CAF50"}
        anchorX="center"
        anchorY="middle"
      >
        {pressure > 1.5 ? "HIGH PRESSURE" : pressure > 1.2 ? "MEDIUM PRESSURE" : "LOW PRESSURE"}
      </Text>
    </group>
  );
}

// Tooltip component for physics explanations
function PhysicsTooltip({ children, explanation, title }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className="physics-tooltip-container"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      {showTooltip && (
        <div className="physics-tooltip">
          <div className="tooltip-title">{title}</div>
          <div className="tooltip-content">{explanation}</div>
        </div>
      )}
    </div>
  );
}

const GasLawSimulator = () => {
  const [volume, setVolume] = useState(2.0); // Liters
  const [pressure, setPressure] = useState(1.0); // atm
  const [temperature, setTemperature] = useState(1.0); // Relative scale
  const [isAnimating, setIsAnimating] = useState(false);
  const [particleCount] = useState(20);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // Zoom control functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 3.0));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.3));
  };

  const handleResetView = () => {
    setZoomLevel(1.0);
  };

  // Boyle's Law: P1V1 = P2V2 (at constant temperature)
  const calculatePressure = (newVolume) => {
    const initialPV = 2.0 * 1.0; // Initial P * V
    return initialPV / newVolume;
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    setPressure(calculatePressure(newVolume));
  };

  const runBoyleDemo = () => {
    setIsAnimating(true);
    let currentVol = 2.0;
    const targetVol = 1.0;
    const step = -0.05;
    
    const animate = () => {
      currentVol += step;
      if (currentVol <= targetVol) {
        currentVol = targetVol;
        setIsAnimating(false);
      }
      
      handleVolumeChange(currentVol);
      
      if (currentVol > targetVol) {
        setTimeout(animate, 100);
      }
    };
    
    animate();
  };

  const resetSimulation = () => {
    setVolume(2.0);
    setPressure(1.0);
    setTemperature(1.0);
    setIsAnimating(false);
  };

  return (
    <div className="gas-law-simulator">
      <div className="simulator-header">
        <h2>Boyle's Gas Law Simulator</h2>
        <p>Explore the relationship between pressure and volume at constant temperature</p>
        <div className="gas-law-equation">
          P₁V₁ = P₂V₂ (at constant T)
        </div>
      </div>

      <div className="simulator-content">
        <div className="controls-panel">
          <div className="control-group">
            <PhysicsTooltip 
              title="Volume Control" 
              explanation="Volume is the amount of space the gas occupies. When you decrease volume (compress the gas), particles have less space to move around, leading to more frequent collisions with container walls and higher pressure."
            >
              <label htmlFor="volume-slider">Volume (L): ℹ️</label>
            </PhysicsTooltip>
            <input
              id="volume-slider"
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              disabled={isAnimating}
              className="slider"
            />
            <span className="value-display">{volume.toFixed(1)} L</span>
          </div>

          <div className="control-group">
            <PhysicsTooltip 
              title="Pressure (Calculated)" 
              explanation="Pressure is the force per unit area exerted by gas particles hitting container walls. According to Boyle's Law (P₁V₁ = P₂V₂), pressure increases when volume decreases at constant temperature. Watch the container walls change color as pressure increases!"
            >
              <label>Pressure (atm): ℹ️</label>
            </PhysicsTooltip>
            <span className="value-display calculated">{pressure.toFixed(2)} atm</span>
          </div>

          <div className="control-group">
            <PhysicsTooltip 
              title="Temperature Effect" 
              explanation="Temperature affects the kinetic energy of gas particles. Higher temperature = faster moving particles = more energetic collisions. This is why particles move faster and change color when you increase temperature!"
            >
              <label htmlFor="temperature-slider">Temperature (relative): ℹ️</label>
            </PhysicsTooltip>
            <input
              id="temperature-slider"
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              disabled={isAnimating}
              className="slider"
            />
            <span className="value-display">{temperature.toFixed(1)}x</span>
          </div>

          <div className="button-group">
            <PhysicsTooltip 
              title="Boyle's Law Demonstration" 
              explanation="This demo compresses the gas from 2.0L to 1.0L, demonstrating that halving the volume doubles the pressure (2.0 atm). Watch how particles hit walls more frequently and the container walls change color to show increased pressure!"
            >
              <button
                onClick={runBoyleDemo}
                disabled={isAnimating}
                className="demo-button"
              >
                {isAnimating ? 'Running Demo...' : 'Run Boyle\'s Law Demo ℹ️'}
              </button>
            </PhysicsTooltip>
            <button
              onClick={resetSimulation}
              disabled={isAnimating}
              className="reset-button"
            >
              Reset
            </button>
          </div>

          <div className="zoom-controls">
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
                marginRight: '5px'
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
                marginRight: '5px'
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
                marginRight: '10px'
              }}
            >
              Reset View
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
              display: 'inline-block'
            }}>
              {zoomLevel.toFixed(1)}x
            </div>
          </div>
        </div>

        <div className="visualization-container">
          <Canvas camera={{ position: [45, 36, 45], fov: 70 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            <GasVisualization
              volume={volume}
              pressure={pressure}
              temperature={temperature}
              particleCount={particleCount}
              zoomLevel={zoomLevel}
            />
          </Canvas>
        </div>
      </div>

      <div className="educational-info">
        <h3>Understanding Boyle's Law Physics</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>Why Does Volume Shrink in the Demo?</h4>
            <p>The demo compresses the gas from 2.0L to 1.0L to demonstrate Boyle's Law. This simulates what happens when you squeeze a syringe or compress air in a piston. The volume reduction is intentional to show the inverse pressure-volume relationship.</p>
          </div>
          <div className="info-card">
            <h4>How Do You See Pressure Changes?</h4>
            <p><strong>Visual Cues:</strong> Watch for (1) Container walls changing color from blue to orange/red, (2) Particles changing from green to orange/red, (3) "HIGH PRESSURE" text appearing, and (4) More frequent particle-wall collisions.</p>
          </div>
          <div className="info-card">
            <h4>Temperature & Collision Speed</h4>
            <p><strong>Yes, you're right!</strong> Higher temperature makes particles move faster (2x speed multiplier), and decreased volume causes more frequent wall collisions. Both effects increase pressure - this is why particles change color and move more energetically.</p>
          </div>
          <div className="info-card">
            <h4>The Physics Formula</h4>
            <p><strong>P₁V₁ = P₂V₂</strong><br/>Initial: 1.0 atm × 2.0 L = 2.0<br/>Final: 2.0 atm × 1.0 L = 2.0<br/>Halving volume doubles pressure!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GasLawSimulator;