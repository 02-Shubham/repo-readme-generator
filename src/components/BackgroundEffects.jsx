import React from 'react';

const BackgroundEffects = () => {
  return (
    <>
      {/* Grid Texture */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Uplight Glow */}
      <div className="fixed bottom-0 left-0 right-0 h-[80vh] z-0 pointer-events-none bg-gradient-to-t from-gray-800/70 via-black/10 to-transparent"></div>
    </>
  );
};

export default BackgroundEffects;