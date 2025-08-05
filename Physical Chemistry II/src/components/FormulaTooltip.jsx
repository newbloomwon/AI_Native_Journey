import React, { useState, useRef, useEffect } from 'react';
import { getFormulaExplanation, identifyFormulaTerms } from '../data/formulaData';
import './FormulaTooltip.css';

const FormulaTooltip = ({ children, formula }) => {
  const [hoveredTerm, setHoveredTerm] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);

  // Refine tooltip position after it's rendered with actual dimensions
  useEffect(() => {
    if (isVisible && tooltipRef.current && hoveredTerm) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let { x, y } = tooltipPosition;
      let needsUpdate = false;
      
      // Check horizontal boundaries with actual width
      const halfWidth = tooltipRect.width / 2;
      if (x + halfWidth > viewportWidth - 20) {
        x = viewportWidth - halfWidth - 20;
        needsUpdate = true;
      } else if (x - halfWidth < 20) {
        x = halfWidth + 20;
        needsUpdate = true;
      }
      
      // Check vertical boundaries with actual height
      if (y - tooltipRect.height < 20) {
        // Tooltip positioned above but extends past top of viewport
        y = 20 + tooltipRect.height;
        needsUpdate = true;
      } else if (y + 10 > viewportHeight - 20) {
        // Tooltip positioned below but extends past bottom of viewport
        y = viewportHeight - 20;
        needsUpdate = true;
      }
      
      // Final safety check - ensure tooltip is never cut off at any edge
      const minY = 20 + tooltipRect.height;
      const maxY = viewportHeight - 20;
      if (y < minY) {
        y = minY;
        needsUpdate = true;
      } else if (y > maxY) {
        y = maxY;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        setTooltipPosition({ x, y });
      }
    }
  }, [isVisible, hoveredTerm, tooltipPosition]);

  // Parse the formula to identify chemical terms
  const parseFormula = (text) => {
    if (!text) return [{ text, isChemical: false }];
    
    const terms = identifyFormulaTerms(text);
    if (terms.length === 0) {
      return [{ text, isChemical: false }];
    }

    const parts = [];
    let lastIndex = 0;

    terms.forEach((term, index) => {
      // Add text before this term
      if (term.position > lastIndex) {
        parts.push({
          text: text.slice(lastIndex, term.position),
          isChemical: false
        });
      }

      // Add the chemical term
      parts.push({
        text: term.term,
        isChemical: true,
        explanation: term.explanation
      });

      lastIndex = term.position + term.term.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        text: text.slice(lastIndex),
        isChemical: false
      });
    }

    return parts;
  };

  const handleMouseEnter = (explanation, event) => {
    setHoveredTerm(explanation);
    updateTooltipPosition(event);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    setHoveredTerm(null);
  };

  const handleMouseMove = (event) => {
    if (isVisible) {
      updateTooltipPosition(event);
    }
  };

  const updateTooltipPosition = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Initial position - center horizontally above the element
    let x = rect.left + rect.width / 2;
    let y = rect.top - 10;
    
    // Estimate tooltip dimensions (will be refined after render)
    const estimatedTooltipWidth = 320; // slightly less than max-width
    const estimatedTooltipHeight = 200; // reasonable estimate
    
    // Adjust horizontal position if tooltip would go off-screen
    const halfWidth = estimatedTooltipWidth / 2;
    if (x + halfWidth > viewportWidth - 20) {
      x = viewportWidth - halfWidth - 20;
    } else if (x - halfWidth < 20) {
      x = halfWidth + 20;
    }
    
    // Adjust vertical position if tooltip would go off-screen
    if (y - estimatedTooltipHeight < 20) {
      // Try to show below the element instead
      const newY = rect.bottom + 10;
      // Check if positioning below will fit in viewport
      if (newY + estimatedTooltipHeight <= viewportHeight - 20) {
        y = newY;
      } else {
        // If neither above nor below fits well, choose the better option
        const spaceAbove = rect.top - 20;
        const spaceBelow = viewportHeight - rect.bottom - 20;
        if (spaceBelow > spaceAbove) {
          y = rect.bottom + 10;
        } else {
          // Position at top of viewport with enough space
          y = 20 + estimatedTooltipHeight;
        }
      }
    }
    
    setTooltipPosition({ x, y });
  };

  // If formula prop is provided, parse it; otherwise use children
  const content = formula || (typeof children === 'string' ? children : '');
  const parsedParts = parseFormula(content);

  return (
    <span className="formula-tooltip-container" ref={containerRef}>
      {parsedParts.map((part, index) => (
        part.isChemical ? (
          <span
            key={index}
            className="chemical-term"
            onMouseEnter={(e) => handleMouseEnter(part.explanation, e)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            title={part.explanation.name}
          >
            {part.text}
          </span>
        ) : (
          <span key={index}>{part.text}</span>
        )
      ))}
      
      {/* If no formula prop, render children normally */}
      {!formula && typeof children !== 'string' && children}
      
      {/* Tooltip */}
      {isVisible && hoveredTerm && (
        <div
          ref={tooltipRef}
          className="formula-tooltip"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: tooltipPosition.y <= 250 || (tooltipPosition.y - 200 < 20) ? 'translate(-50%, 0%)' : 'translate(-50%, -100%)'
          }}
        >
          <div className={`formula-tooltip-arrow ${tooltipPosition.y <= 250 || (tooltipPosition.y - 200 < 20) ? 'arrow-up' : ''}`}></div>
          <div className="formula-tooltip-content">
            <div className="formula-tooltip-header">
              <span className="formula-term">{hoveredTerm.term}</span>
              <span className="formula-name">{hoveredTerm.name}</span>
            </div>
            
            <div className="formula-description">
              {hoveredTerm.description}
            </div>
            
            {hoveredTerm.role && (
              <div className="formula-role">
                <strong>Role:</strong> {hoveredTerm.role}
              </div>
            )}
            
            {hoveredTerm.examples && hoveredTerm.examples.length > 0 && (
              <div className="formula-examples">
                <strong>Examples:</strong>
                <ul>
                  {hoveredTerm.examples.map((example, idx) => (
                    <li key={idx}>{example}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {hoveredTerm.beginnerTip && (
              <div className="formula-tip">
                <span className="tip-icon">💡</span>
                <span className="tip-text">{hoveredTerm.beginnerTip}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </span>
  );
};

export default FormulaTooltip;