import React from 'react';
import { wrapWithTooltips } from '../utils/tooltipUtils.jsx';

const InfoPanel = ({ reactionInfo, currentStep }) => {
  if (!reactionInfo || !reactionInfo.steps || !reactionInfo.steps[currentStep]) {
    return null;
  }

  const stepInfo = reactionInfo.steps[currentStep];

  return (
    <div className="info-panel">
      <div className="info-header">
        <h2>Step {currentStep + 1}: {stepInfo.title}</h2>
      </div>

      <div className="step-details">
        <div className="step-description">{wrapWithTooltips(stepInfo.description)}</div>
      </div>

      <div className="reaction-details">
        {stepInfo.keyPoints && stepInfo.keyPoints.length > 0 && (
          <div className="key-points">
            <h4>Key Points:</h4>
            <ul>
              {stepInfo.keyPoints.map((point, index) => (
                <li key={index}>{wrapWithTooltips(point)}</li>
              ))}
            </ul>
          </div>
        )}

        {stepInfo.energyChange && (
          <div className="energy-info">
            <h4>Energy Change:</h4>
            <div className="energy-description">{wrapWithTooltips(stepInfo.energyChange)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;
