import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import * as THREE from 'three';

// Gas particle component
function GasParticle({ position, velocity, containerBounds, temperature }) {
  const meshRef = useRef();
  const velocityRef = useRef(velocity);
  const positionRef = useRef(position);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Update position based on velocity
    positionRef.current[0] += velocityRef.current[0] * delta * temperature;
    positionRef.current[1] += velocityRef.current[1] * delta * temperature;
    positionRef.current[2] += velocityRef.current[2] * delta * temperature;

    // Bounce off container walls
    const bounds = containerBounds;
    for (let i = 0; i < 3; i++) {
      if (positionRef.current[i] > bounds[i] || positionRef.current[i] < -bounds[i]) {
        velocityRef.current[i] *= -1;
        positionRef.current[i] = Math.max(-bounds[i], Math.min(bounds[i], positionRef.current[i]));
      }
    }

    meshRef.current.position.set(...positionRef.current);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[3.375, 8, 8]} />
      <meshStandardMaterial color="#4CAF50" />
    </mesh>
  );
}

// Container walls component
function Container({ dimensions }) {
  const [width, height, depth] = dimensions;
  
  return (
    <group>
      {/* Container walls - wireframe */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width * 2, height * 2, depth * 2)]} />
        <lineBasicMaterial color="#2196F3" linewidth={2} />
      </lineSegments>
      
      {/* Semi-transparent container walls */}
      <mesh>
        <boxGeometry args={[width * 2, height * 2, depth * 2]} />
        <meshStandardMaterial 
          color="#E3F2FD" 
          transparent 
          opacity={0.1} 
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
      <Container dimensions={containerDimensions} />
      {particles.map(particle => (
        <GasParticle
          key={particle.id}
          position={particle.position}
          velocity={particle.velocity}
          containerBounds={containerDimensions}
          temperature={temperature}
        />
      ))}
      
      {/* Display current values */}
      <Text
        position={[0, containerDimensions[1] + 1, 0]}
        fontSize={0.5}
        color="#1976D2"
        anchorX="center"
        anchorY="middle"
      >
        {`V: ${volume.toFixed(1)} L | P: ${pressure.toFixed(1)} atm`}
      </Text>
    </group>
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
            <label htmlFor="volume-slider">Volume (L):</label>
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
            <label>Pressure (atm):</label>
            <span className="value-display calculated">{pressure.toFixed(2)} atm</span>
          </div>

          <div className="control-group">
            <label htmlFor="temperature-slider">Temperature (relative):</label>
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
            <button
              onClick={runBoyleDemo}
              disabled={isAnimating}
              className="demo-button"
            >
              {isAnimating ? 'Running Demo...' : 'Run Boyle\'s Law Demo'}
            </button>
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
        <h3>Understanding Boyle's Law</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>The Law</h4>
            <p>At constant temperature, the pressure of a gas is inversely proportional to its volume.</p>
          </div>
          <div className="info-card">
            <h4>What You See</h4>
            <p>As the container shrinks (volume decreases), gas particles hit the walls more frequently, increasing pressure.</p>
          </div>
          <div className="info-card">
            <h4>Real World</h4>
            <p>This explains why a balloon pops when squeezed too hard, or why a syringe becomes harder to push as you compress the air inside.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GasLawSimulator;