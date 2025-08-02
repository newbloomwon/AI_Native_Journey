import React from 'react';
import Tooltip from '../components/Tooltip';

// List of technical terms that should have tooltips
const TECHNICAL_TERMS = [
  'nucleophile',
  'substrate',
  'leaving group',
  'orbital overlap',
  'backside attack',
  'transition state',
  'bimolecular',
  'stereochemistry',
  'conjugate base',
  'conjugate acid',
  'proton transfer',
  'lone pair',
  'oxidation',
  'reduction',
  'oxidizing agent',
  'reducing agent',
  'valence electron',
  'polarized',
  'partial positive charge',
  'partial negative charge',
  'electron pair',
  'trigonal bipyramidal',
  'geometry',
  'bond formation',
  'bond breaking',
  'electron reorganization',
  'energy barrier',
  'baseline energy',
  'energy level',
];

/**
 * Wraps technical terms in text with Tooltip components
 * @param {string} text - The text to process
 * @param {string} className - Optional CSS class for tooltip wrapper
 * @returns {React.ReactNode} - Text with tooltips wrapped around technical terms
 */
export const wrapWithTooltips = (text, className = '') => {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // Create a regex pattern that matches any of the technical terms
  // Sort by length (longest first) to match longer terms before shorter ones
  const sortedTerms = [...TECHNICAL_TERMS].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`\\b(${sortedTerms.map(term =>
    term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  ).join('|')})\\b`, 'gi');

  const parts = [];
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Add the matched term wrapped in a Tooltip
    const matchedTerm = match[0];
    parts.push(
      <Tooltip
        key={`tooltip-${keyCounter++}`}
        term={matchedTerm}
        className={className}
      >
        {matchedTerm}
      </Tooltip>,
    );

    lastIndex = pattern.lastIndex;
  }

  // Add remaining text after the last match
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 1 ? parts : text;
};

/**
 * Processes an array of text items and wraps technical terms with tooltips
 * @param {string[]} textArray - Array of text strings
 * @param {string} className - Optional CSS class for tooltip wrapper
 * @returns {React.ReactNode[]} - Array with tooltips wrapped around technical terms
 */
export const wrapArrayWithTooltips = (textArray, className = '') => {
  if (!Array.isArray(textArray)) {
    return textArray;
  }

  return textArray.map((text, index) => (
    <span key={`tooltip-array-${index}`}>
      {wrapWithTooltips(text, className)}
    </span>
  ));
};

/**
 * Checks if a given term is in the technical terms list
 * @param {string} term - The term to check
 * @returns {boolean} - True if the term is technical
 */
export const isTechnicalTerm = (term) => {
  if (!term || typeof term !== 'string') {
    return false;
  }

  return TECHNICAL_TERMS.some(techTerm =>
    term.toLowerCase().includes(techTerm.toLowerCase()),
  );
};

/**
 * Adds a new technical term to the list
 * @param {string} term - The new term to add
 */
export const addTechnicalTerm = (term) => {
  if (term && typeof term === 'string' && !TECHNICAL_TERMS.includes(term.toLowerCase())) {
    TECHNICAL_TERMS.push(term.toLowerCase());
  }
};

/**
 * Gets all technical terms
 * @returns {string[]} - Array of all technical terms
 */
export const getTechnicalTerms = () => {
  return [...TECHNICAL_TERMS];
};

