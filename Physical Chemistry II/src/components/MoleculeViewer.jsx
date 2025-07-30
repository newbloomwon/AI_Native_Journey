import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Html } from '@react-three/drei';

// Color mapping for common elements
const elementColors = {
  H: '#FFFFFF',  // Hydrogen - white
  C: '#909090',  // Carbon - gray
  N: '#3050F8',  // Nitrogen - blue
  O: '#FF0D0D',  // Oxygen - red
  F: '#90E050',  // Fluorine - light green
  Cl: '#1FF01F', // Chlorine - green
  Br: '#A62929', // Bromine - brown
  I: '#940094',  // Iodine - purple
  Na: '#AB5CF2', // Sodium - purple
  Mg: '#8AFF00', // Magnesium - light green
  P: '#FF8000',  // Phosphorus - orange
  S: '#FFFF30',  // Sulfur - yellow
  default: '#FF00FF' // Default - magenta
};

// Relative size mapping for common elements
const elementSizes = {
  H: 0.4,   // Hydrogen - smallest
  C: 0.7,   // Carbon
  N: 0.65,  // Nitrogen
  O: 0.6,   // Oxygen
  F: 0.5,   // Fluorine
  Cl: 0.8,  // Chlorine
  Br: 0.95, // Bromine
  I: 1.1,   // Iodine
  Na: 1.0,  // Sodium
  Mg: 0.9,  // Magnesium
  P: 0.8,   // Phosphorus
  S: 0.85,  // Sulfur
  default: 0.7 // Default
};

const Atom = ({ element, position, showLabel = false }) => {
  const color = elementColors[element] || elementColors.default;
  const size = elementSizes[element] || elementSizes.default;
  
  return (
    <group position={position}>
      <Sphere args={[size, 32, 32]}>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </Sphere>
      {showLabel && (
        <Html distanceFactor={10}>
          <div style={{ 
            background: 'rgba(0,0,0,0.6)', 
            color: 'white', 
            padding: '2px 5px', 
            borderRadius: '3px',
            fontSize: '12px',
            userSelect: 'none'
          }}>
            {element}
          </div>
        </Html>
      )}
    </group>
  );
};

const Bond = ({ start, end, color = '#FFFFFF' }) => {
  return (
    <Line
      points={[start, end]}
      color={color}
      lineWidth={3}
      dashed={false}
    />
  );
};

const MoleculeViewer = ({ moleculeData, isPlaying, freezeAtStepStart, onStepComplete }) => {
  const groupRef = useRef();
  const animationRef = useRef({ time: 0, framesPassed: 0 });
  
  // Animation logic
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Always apply a small rotation for better visibility, even when paused
      groupRef.current.rotation.y += delta * 0.1;
      
      if (isPlaying) {
        // Increment frame counter
        animationRef.current.framesPassed++;
        
        // More dynamic rotation when playing
        groupRef.current.rotation.y += delta * 0.4;
        
        // Track animation time for step completion
        animationRef.current.time += delta;
        if (animationRef.current.time > 3) { // 3 seconds per step
          animationRef.current.time = 0;
          animationRef.current.framesPassed = 0;
          onStepComplete();
        }
      }
    }
  });
  
  // Reset animation timer and frame counter when molecule data changes
  useEffect(() => {
    animationRef.current.time = 0;
    animationRef.current.framesPassed = 0;
  }, [moleculeData]);

  if (!moleculeData || !moleculeData.length) {
    return null;
  }

  return (
    <group ref={groupRef}>
      {/* Render atoms */}
      {moleculeData.map((molecule, moleculeIndex) => (
        <group key={`molecule-${moleculeIndex}`}>
          {molecule.atoms.map((atom, atomIndex) => (
            <Atom
              key={`atom-${moleculeIndex}-${atomIndex}`}
              element={atom.element}
              position={atom.position}
              showLabel={atom.showLabel}
            />
          ))}
          
          {/* Render bonds */}
          {molecule.bonds && molecule.bonds.map((bond, bondIndex) => (
            <Bond
              key={`bond-${moleculeIndex}-${bondIndex}`}
              start={molecule.atoms[bond.from].position}
              end={molecule.atoms[bond.to].position}
              color={bond.color || '#FFFFFF'}
            />
          ))}
        </group>
      ))}
    </group>
  );
};

export default MoleculeViewer;