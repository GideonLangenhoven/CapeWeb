import React from 'react';
import '../styles/TitleStack.css';

const TitleStack = ({
  as: Component = 'h2',
  lines,
  className = '',
  variant = 'default',
  align = 'left',
  reveal = true,
  ...rest
}) => {
  const composedClass = [
    'title-stack',
    `title-stack--${variant}`,
    `title-stack--${align}`,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component
      className={composedClass}
      data-scroll-reveal={reveal ? '' : undefined}
      {...rest}
    >
      {lines.map((line, index) => (
        <span key={`${line}-${index}`} className="title-stack__line" style={{ '--line-index': index }}>
          <span className="title-stack__text">{line}</span>
        </span>
      ))}
    </Component>
  );
};

export default TitleStack;
