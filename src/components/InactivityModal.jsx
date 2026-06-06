import React, { useState, useEffect } from 'react';
import { MODAL_COUNTDOWN_S } from '../constants.js';
import { STRINGS } from '../constants.js';

const InactivityModal = ({ onContinue, onTimeout, lang }) => {
    const [countdown, setCountdown] = useState(MODAL_COUNTDOWN_S);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            onTimeout();
        }
    }, [countdown, onTimeout]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in-up z-[9999]" style={{animationDuration: '0.3s'}}>
            <div className="bg-[#5b6760] shadow-2xl p-8 max-w-sm w-full text-center">
                <h2 className="text-5xl text-white mb-4">{STRINGS[lang].screen_inactivity_title}</h2>
                <p className="text-white mb-6 text-2xl">
                    {STRINGS[lang].screen_inactivity_text}
                </p>
                <div className="text-6xl text-white mb-8">{countdown}</div>
                <button
                    onClick={onContinue}
                    className="bg-[#276140] text-white py-3 px-8 text-2xl w-full transform hover:scale-105 transition-transform duration-300"
                >
                    {STRINGS[lang].screen_inactivity_btConfirm}
                </button>
            </div>
        </div>
    );
};

export default InactivityModal;