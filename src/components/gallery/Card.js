import React from 'react';

const Card = ({
  card,
  index,
  isExpanded,
  onCardClick,
  onCollapseRow,
  isFirst,
}) => {
  // This CSS variable is used for the sequential glow animation in an expanded row
  const liStyle = isExpanded ? { '--card-index': index } : {};

  // When the card is clicked, it notifies the parent component.
  const handleClick = (e) => {
    if (onCardClick) {
      onCardClick(e);
    }
  };

  // The collapse button has its own click handler to prevent conflicts.
  const handleCollapseClick = (e) => {
    e.stopPropagation(); // Prevents the card's onClick from firing
    if (onCollapseRow) {
      onCollapseRow(e);
    }
  };

  return (
    <li style={liStyle}>
      <div className="card-glow-wrapper">
        <div
          className="card"
          // The inline style for the stacking effect is only applied when the row is collapsed
          style={!isExpanded ? {
            transform: `translateY(${index * 8}px) scale(${1 - index * 0.05})`,
            zIndex: 10 - index,
          } : {}}
          onClick={handleClick}
        >
          {/* The back arrow only shows on the first card of an expanded row */}
          {isExpanded && isFirst && (
            <div className="back-arrow" onClick={handleCollapseClick}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </div>
          )}

          {/* Card heading - only shows on first card when collapsed */}
          {!isExpanded && isFirst && (
            <div className="card-heading">
              <h3>{card.categoryTitle || 'Event Collection'}</h3>
            </div>
          )}

          <img src={card.imageUrl} alt={card.title} className="card-image" />

          {/* Content that shows within the card on expanded rows */}
          {isExpanded && (
            <div className="card-content-expanded">
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default Card;