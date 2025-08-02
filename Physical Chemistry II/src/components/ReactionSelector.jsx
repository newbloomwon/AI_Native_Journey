import React from 'react';
import { wrapWithTooltips } from '../utils/tooltipUtils.jsx';

const ReactionSelector = ({ reactions, selectedReaction, onReactionChange }) => {
  return (
    <div className="reaction-selector">
      <div className="selector-header">
        <h2>Select Reaction Type</h2>
        <select
          value={selectedReaction ? selectedReaction.id : ''}
          onChange={(e) => onReactionChange(e.target.value)}
          className="reaction-dropdown"
        >
          <option value="" disabled>Choose a reaction...</option>
          {reactions.map(reaction => (
            <option key={reaction.id} value={reaction.id}>
              {reaction.name}
            </option>
          ))}
        </select>
      </div>

      {selectedReaction && (
        <div className="reaction-description">
          <div className="description-text">{wrapWithTooltips(selectedReaction.description)}</div>
          <div className="reaction-equation">
            {selectedReaction.equation}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactionSelector;
