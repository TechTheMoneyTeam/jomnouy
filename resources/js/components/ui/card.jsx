
import React from 'react';

const Card = ({ className, children }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className || ''}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ className, children }) => {
  return (
    <div className={`p-4 ${className || ''}`}>
      {children}
    </div>
  );
};

const CardContent = ({ className, children }) => {
  return (
    <div className={`p-4 pt-0 ${className || ''}`}>
      {children}
    </div>
  );
};

const CardFooter = ({ className, children }) => {
  return (
    <div className={`p-4 border-t ${className || ''}`}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardContent, CardFooter };