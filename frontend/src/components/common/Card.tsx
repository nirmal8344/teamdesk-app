import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-card text-card-foreground border border-border rounded-2xl shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;