import React, { useState, useEffect } from 'react';

const GeneratedImageScreen = ({ imageSrc, onComplete }) => {
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            onComplete();
        }
    }, [countdown, onComplete]);

    return (
        <div className="relative flex flex-col items-center justify-center h-screen bg-black text-white p-8">
            <img src={imageSrc} alt="Generated scene" className="max-h-full max-w-full object-contain" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center">
                <h2 className="text-4xl font-bold mb-4 animate-fade-in-down text-slate-100">¡Aquí está tu creación!</h2>
                <p className="text-2xl mb-6 animate-fade-in-up text-slate-300">El puzle empieza en...</p>
                <div className="text-9xl font-bold text-cyan-400 drop-shadow-lg" style={{textShadow: '0 0 20px #06b6d4'}}>
                    {countdown}
                </div>
            </div>
        </div>
    );
};

export default GeneratedImageScreen;