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
  // Free Radical Chain Reaction terms
  'radical',
  'radicals',
  'initiation',
  'propagation',
  'termination',
  'homolytic cleavage',
  'homolytically',
  'chlorine molecule',
  'chlorine radicals',
  'chlorine radical',
  'electron',
  'electrons',
  'covalent bond',
  'unpaired electrons',
  'unpaired electron',
  'reactive',
  'molecules',
  'methane',
  'abstracting',
  'abstracts',
  'hydrogen atom',
  'hydrogen',
  'hydrogen chloride',
  'methyl radical',
  'exothermic',
  'chain reaction',
  'chain',
  'methyl chloride',
  'product',
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

  // First, handle explicit <tooltip> tags
  const tooltipTagPattern = /<tooltip[^>]*>([^<]+)<\/tooltip>/gi;
  let processedText = text;
  const parts = [];
  let lastIndex = 0;
  let keyCounter = 0;
  let match;

  // Process explicit tooltip tags first
  while ((match = tooltipTagPattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      const beforeText = text.slice(lastIndex, match.index);
      parts.push(...processAutoTooltips(beforeText, className, keyCounter));
      keyCounter += countTooltips(beforeText);
    }

    // Add the tooltip-wrapped term
    const tooltipContent = match[1];
    parts.push(
      <Tooltip
        key={`tooltip-${keyCounter++}`}
        term={tooltipContent}
        className={className}
      >
        {tooltipContent}
      </Tooltip>,
    );

    lastIndex = tooltipTagPattern.lastIndex;
  }

  // Add remaining text after the last tooltip tag
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    parts.push(...processAutoTooltips(remainingText, className, keyCounter));
  }

  // If no explicit tooltip tags were found, process the entire text for auto-tooltips
  if (parts.length === 0) {
    return processAutoTooltips(text, className, 0);
  }

  return parts.length > 1 ? parts : text;
};

// Helper function to process automatic tooltips for a text segment
const processAutoTooltips = (text, className, startKeyCounter) => {
  if (!text || typeof text !== 'string') {
    return [text];
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
  let keyCounter = startKeyCounter;

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

  return parts.length > 0 ? parts : [text];
};

// Helper function to count tooltips in a text segment
const countTooltips = (text) => {
  const sortedTerms = [...TECHNICAL_TERMS].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`\\b(${sortedTerms.map(term =>
    term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  ).join('|')})\\b`, 'gi');
  
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
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

