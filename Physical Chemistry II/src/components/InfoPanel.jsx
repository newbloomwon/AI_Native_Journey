import React from 'react';

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
        <p>{stepInfo.description}</p>
      </div>
      
      <div className="reaction-details">
        {stepInfo.keyPoints && stepInfo.keyPoints.length > 0 && (
          <div className="key-points">
            <h4>Key Points:</h4>
            <ul>
              {stepInfo.keyPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}
        
        {stepInfo.energyChange && (
          <div className="energy-info">
            <h4>Energy Change:</h4>
            <p>{stepInfo.energyChange}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;