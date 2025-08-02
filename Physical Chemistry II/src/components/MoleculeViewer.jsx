import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Html } from '@react-three/drei';
import { Vector3 } from 'three';

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
  default: '#FF00FF', // Default - magenta
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
  default: 0.7, // Default
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
            userSelect: 'none',
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

const Electron = ({ position, isMoving = false, targetPosition = null, highlighted = false, isUnpaired = false, isRadical = false }) => {
  const electronRef = useRef();
  const [currentPos, setCurrentPos] = useState(position);

  useFrame((state, delta) => {
    if (isMoving && targetPosition && electronRef.current) {
      // Animate electron movement
      const current = new Vector3(...currentPos);
      const target = new Vector3(...targetPosition);
      const direction = target.sub(current).normalize();
      const speed = 0.5; // Adjust speed as needed

      const newPos = [
        currentPos[0] + direction.x * speed * delta,
        currentPos[1] + direction.y * speed * delta,
        currentPos[2] + direction.z * speed * delta,
      ];

      setCurrentPos(newPos);
      electronRef.current.position.set(...newPos);
    }

    // Add pulsing effect for highlighted electrons or radical electrons
    if (electronRef.current && (highlighted || isUnpaired || isRadical)) {
      const time = state.clock.getElapsedTime();
      const pulseFactor = isUnpaired || isRadical ? 2.0 : 1.0; // Faster pulse for radicals
      const scale = 1 + 0.3 * Math.sin(time * pulseFactor * 3);
      electronRef.current.scale.setScalar(scale);
    }
  });

  // Determine electron color based on type
  const getElectronColor = () => {
    if (isUnpaired || isRadical) return '#ff4444'; // Red for unpaired/radical electrons
    if (highlighted) return '#ffff00'; // Yellow for highlighted electrons
    return '#ff0000'; // Default red for paired electrons
  };

  const getElectronEmissive = () => {
    if (isUnpaired || isRadical) return '#441111'; // Dim red emissive for radicals
    if (highlighted) return '#444400'; // Dim yellow emissive for highlighted
    return '#440000'; // Default dim red emissive
  };

  return (
    <group ref={electronRef} position={currentPos}>
      <Sphere args={[isUnpaired || isRadical ? 0.08 : 0.05, 8, 8]}>
        <meshStandardMaterial 
          color={getElectronColor()} 
          emissive={getElectronEmissive()}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
      {/* Add a glowing effect for unpaired electrons */}
      {(isUnpaired || isRadical) && (
        <Sphere args={[0.12, 8, 8]}>
          <meshStandardMaterial 
            color="#ff4444" 
            transparent
            opacity={0.3}
            emissive="#ff2222"
          />
        </Sphere>
      )}
    </group>
  );
};


const MoleculeViewer = ({ moleculeData, isPlaying, freezeAtStepStart, onStepComplete, showElectrons = false, zoomLevel = 1.0 }) => {
  const groupRef = useRef();
  const animationRef = useRef({ time: 0, framesPassed: 0 });

  // Animation logic
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Apply zoom
      groupRef.current.scale.setScalar(zoomLevel);

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

  // Generate electron positions for visualization
  const generateElectronPositions = () => {
    if (!moleculeData || !showElectrons) return [];

    const electrons = [];
    moleculeData.forEach((molecule, moleculeIndex) => {
      // Check if molecule has specific electron data
      const electronData = molecule.electrons || [];
      const unpairedElectrons = molecule.unpairedElectrons || [];
      const radicals = molecule.radicals || [];
      const bonds = molecule.bonds || [];

      // Generate bond electrons
      bonds.forEach((bond, bondIndex) => {
        const atom1 = molecule.atoms[bond.from];
        const atom2 = molecule.atoms[bond.to];
        
        if (atom1 && atom2) {
          const midpoint = [
            (atom1.position[0] + atom2.position[0]) / 2,
            (atom1.position[1] + atom2.position[1]) / 2,
            (atom1.position[2] + atom2.position[2]) / 2,
          ];
          
          // Add electrons based on bond order (default to 1 if not specified)
          const bondOrder = bond.order || 1;
          for (let i = 0; i < bondOrder * 2; i++) {
            const offset = (i % 2 === 0) ? 0.1 : -0.1;
            electrons.push({
              id: `bond-${moleculeIndex}-${bondIndex}-electron-${i}`,
              position: [
                midpoint[0] + offset,
                midpoint[1],
                midpoint[2],
              ],
              atomIndex: null,
              moleculeIndex: moleculeIndex,
              highlighted: bond.highlighted || false,
              isUnpaired: false,
              isRadical: false,
            });
          }
        }
      });

      molecule.atoms.forEach((atom, atomIndex) => {
        // Find specific electron info for this atom
        const atomElectronInfo = electronData.find(e => e.atomIndex === atomIndex);
        const electronCount = atomElectronInfo ? atomElectronInfo.count : getValenceElectrons(atom.element);
        const isHighlighted = atomElectronInfo ? atomElectronInfo.highlight : false;

        for (let i = 0; i < electronCount; i++) {
          const angle = (i / electronCount) * Math.PI * 2;
          const radius = (elementSizes[atom.element] || elementSizes.default) + 0.3;
          const electronPos = [
            atom.position[0] + Math.cos(angle) * radius,
            atom.position[1] + Math.sin(angle) * radius * 0.5,
            atom.position[2],
          ];
          electrons.push({
            id: `electron-${moleculeIndex}-${atomIndex}-${i}`,
            position: electronPos,
            atomIndex: atomIndex,
            moleculeIndex: moleculeIndex,
            highlighted: isHighlighted,
            isUnpaired: false,
            isRadical: false,
          });
        }
      });

      // Generate unpaired electrons
      unpairedElectrons.forEach((unpaired, index) => {
        const atom = molecule.atoms[unpaired.atomIndex];
        if (atom) {
          electrons.push({
            id: `unpaired-${moleculeIndex}-${index}`,
            position: [
              atom.position[0] + (unpaired.offset?.[0] || 0.3),
              atom.position[1] + (unpaired.offset?.[1] || 0.3),
              atom.position[2] + (unpaired.offset?.[2] || 0),
            ],
            atomIndex: unpaired.atomIndex,
            moleculeIndex: moleculeIndex,
            highlighted: false,
            isUnpaired: true,
            isRadical: false,
          });
        }
      });

      // Generate radical electrons
      radicals.forEach((radical, index) => {
        const atom = molecule.atoms[radical.atomIndex];
        if (atom) {
          electrons.push({
            id: `radical-${moleculeIndex}-${index}`,
            position: [
              atom.position[0] + (radical.offset?.[0] || 0.4),
              atom.position[1] + (radical.offset?.[1] || 0.4),
              atom.position[2] + (radical.offset?.[2] || 0),
            ],
            atomIndex: radical.atomIndex,
            moleculeIndex: moleculeIndex,
            highlighted: false,
            isUnpaired: false,
            isRadical: true,
          });
        }
      });
    });
    return electrons;
  };

  const getValenceElectrons = (element) => {
    const valenceMap = {
      'H': 1, 'C': 4, 'N': 5, 'O': 6, 'F': 7,
      'Cl': 7, 'Br': 7, 'I': 7, 'Na': 1, 'Mg': 2,
      'P': 5, 'S': 6,
    };
    return valenceMap[element] || 4;
  };

  const electronPositions = generateElectronPositions();

  return (
    <>
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

        {/* Render electrons */}
        {electronPositions.map((electron) => (
          <Electron
            key={electron.id}
            position={electron.position}
            isMoving={isPlaying}
            highlighted={electron.highlighted}
            isUnpaired={electron.isUnpaired}
            isRadical={electron.isRadical}
          />
        ))}
      </group>

    </>
  );
};

export default MoleculeViewer;
