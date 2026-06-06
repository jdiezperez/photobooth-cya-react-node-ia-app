import React from 'react';

const IntroScreen = ({ onStart }) => {
  return (
    <div 
      className="flex flex-col items-center justify-center h-screen text-white text-center p-8 cursor-pointer"
      onClick={onStart}
    >
      <div className="animate-fade-in-down">
        <h1 className="text-6xl mb-4">The Iconic Puffer</h1>
      </div>
    </div>
  );
};

export default IntroScreen;