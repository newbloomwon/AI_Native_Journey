import React, { useState, useRef, useEffect } from 'react';
import './Tooltip.css';

const Tooltip = ({ term, children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, direction: 'top' });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipWidth = 300; // max-width from CSS
    const tooltipHeight = 120; // estimated height
    const margin = 8;

    let direction = 'top';
    let top = triggerRect.top - tooltipHeight - margin;
    let left = triggerRect.left + (triggerRect.width / 2) - (tooltipWidth / 2);

    // Check if tooltip would go above viewport
    if (top < margin) {
      direction = 'bottom';
      top = triggerRect.bottom + margin;
    }

    // Check if tooltip would go below viewport
    if (top + tooltipHeight > viewportHeight - margin) {
      direction = 'top';
      top = triggerRect.top - tooltipHeight - margin;
    }

    // Check if tooltip would go off left side
    if (left < margin) {
      left = margin;
    }

    // Check if tooltip would go off right side
    if (left + tooltipWidth > viewportWidth - margin) {
      left = viewportWidth - tooltipWidth - margin;
    }

    setPosition({ top, left, direction });
  };

  const handleMouseEnter = () => {
    calculatePosition();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        calculatePosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isVisible]);

  return (
    <span
      className={`tooltip-wrapper ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={triggerRef}
    >
      <span className="tooltip-trigger">
        {children}
      </span>
      {isVisible && (
        <div
          className={`tooltip-popup tooltip-${position.direction}`}
          ref={tooltipRef}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <div className="tooltip-content">
            <div className="tooltip-term">{term}</div>
            <div className="tooltip-definition">{getDefinition(term)}</div>
          </div>
          <div className={`tooltip-arrow arrow-${position.direction}`} />
        </div>
      )}
    </span>
  );
};

// Glossary of chemistry terms with high school-friendly explanations
const getDefinition = (term) => {
  const glossary = {
    'nucleophile': 'A molecule or ion that loves electrons and wants to donate them. Think of it as an "electron-rich" particle that seeks out positive charges.',
    'substrate': 'The main molecule that gets changed during a chemical reaction. It\'s like the "target" that other molecules attack.',
    'leaving group': 'A part of a molecule that breaks away during a reaction. It\'s like a piece that gets "kicked out" when something new comes in.',
    'orbital overlap': 'When the electron clouds around atoms get close enough to share space. This is how atoms form bonds with each other.',
    'backside attack': 'When one molecule approaches another from the opposite side of where something will leave. Like sneaking up from behind.',
    'transition state': 'The highest energy point during a reaction where bonds are half-broken and half-formed. It\'s like the peak of a mountain that molecules must climb over.',
    'bimolecular': 'A reaction that involves exactly two molecules colliding and reacting with each other.',
    'stereochemistry': 'The 3D arrangement of atoms in a molecule. Like how your left and right hands have the same parts but are mirror images.',
    'conjugate base': 'What\'s left of an acid after it gives away a hydrogen ion (proton). It\'s the "partner" of the original acid.',
    'conjugate acid': 'What a base becomes after it accepts a hydrogen ion (proton). It\'s the "partner" of the original base.',
    'proton transfer': 'The movement of a hydrogen ion (H+) from one molecule to another. It\'s like passing a positively charged ball.',
    'lone pair': 'A pair of electrons that belong to one atom and aren\'t shared with other atoms. They\'re "available" for bonding.',
    'oxidation': 'When an atom or molecule loses electrons. Remember: "OIL" - Oxidation Is Loss (of electrons).',
    'reduction': 'When an atom or molecule gains electrons. Remember: "RIG" - Reduction Is Gain (of electrons).',
    'oxidizing agent': 'A substance that causes other things to lose electrons (get oxidized). It\'s like an "electron thief."',
    'reducing agent': 'A substance that gives away electrons, causing other things to gain electrons (get reduced). It\'s like an "electron donor."',
    'valence electron': 'The outermost electrons of an atom that participate in chemical bonding. They\'re the "active" electrons.',
    'polarized': 'When electrons in a bond are pulled more toward one atom than the other, creating partial positive and negative charges.',
    'partial positive charge': 'A slight positive charge on an atom when electrons are pulled away from it. Shown as δ+ (delta plus).',
    'partial negative charge': 'A slight negative charge on an atom when electrons are pulled toward it. Shown as δ- (delta minus).',
    'electron pair': 'Two electrons that are paired together, either in a bond between atoms or as a lone pair on one atom.',
    'trigonal bipyramidal': 'A 3D shape where an atom is surrounded by 5 other atoms - 3 in a triangle around the middle and 2 above and below.',
    'geometry': 'The 3D shape that molecules take based on how their atoms are arranged in space.',
    'bond formation': 'The process of atoms sharing or transferring electrons to create a chemical bond between them.',
    'bond breaking': 'The process of a chemical bond being destroyed, usually by electrons moving away from the bond.',
    'electron reorganization': 'The movement and rearrangement of electrons during a chemical reaction.',
    'energy barrier': 'The amount of energy needed to start a chemical reaction. Like the energy needed to push a ball over a hill.',
    'baseline energy': 'The starting energy level of molecules before a reaction begins.',
    'energy level': 'The amount of energy that molecules have at any point during a reaction.',
  };

  // Convert term to lowercase for matching
  const lowerTerm = term.toLowerCase();

  // Try exact match first
  if (glossary[lowerTerm]) {
    return glossary[lowerTerm];
  }

  // Try partial matches for compound terms
  for (const [key, definition] of Object.entries(glossary)) {
    if (lowerTerm.includes(key) || key.includes(lowerTerm)) {
      return definition;
    }
  }

  // Default message if term not found
  return 'This is a chemistry term. Ask your teacher for more details!';
};

export default Tooltip;
