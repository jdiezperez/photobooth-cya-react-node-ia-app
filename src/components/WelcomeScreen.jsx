import React from 'react';
import { STRINGS } from '../constants.js';

const WelcomeScreen = ({ onStart, lang }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white text-center p-8">
			<div className="absolute bottom-0 right-0 w-[187px] pb-8">
				<img src="./src/images/logo_CYA.png" />
			</div>
      <h1 className="text-7xl my-8 animate-fade-in-down">{STRINGS[lang].screen_welcome_title}</h1>
      <p className="text-4xl mb-16 max-w-2xl animate-fade-in-up">{STRINGS[lang].screen_welcome_text2}</p>
      <button
        onClick={onStart}
        className="bg-[#276140] text-white py-3 px-16 text-4xl transform hover:scale-105 transition-transform duration-300"
      >
        {STRINGS[lang].screen_welcome_btEmpezar}
      </button>
      <div className="w-1/2 mt-8">
          <img className="w-full" src="/src/images/air.png" />
        </div>
    </div>
  );
};

export default WelcomeScreen;