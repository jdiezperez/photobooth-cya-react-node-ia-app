import React, { useState } from 'react';


const LanguageScreen = ({ onStart }) => {
	const [code, setCode] = useState('');
	const handleCodeChange = (e) => { setCode(e.target.value) }

	return (
    <div className="flex flex-col items-center justify-center h-screen text-white text-center p-8">

			<div className="mb-8 text-2xl">
				Machine Code: <input className="text-2xl text-black p-1 ml-8 w-24 border-2 border-[#276140]" type="text" value={code} onChange={handleCodeChange} />
			</div>
      <button
        onClick={() => {
					if (code != '') onStart('es', code)
				}}
        className="bg-[#276140] text-white py-3 px-8 text-2xl transform hover:scale-105 transition-transform duration-300"
      >
        Español
      </button>
      <button
        onClick={() => {
					if (code != '') onStart('ca', code)
				}}
        className="mt-8 bg-[#276140] text-white py-3 px-8 text-2xl transform hover:scale-105 transition-transform duration-300"
      >
        Català
      </button>
      <button
        onClick={() => {
					if (code != '') onStart('pt', code)
				}}
        className="mt-8 bg-[#276140] text-white py-3 px-8 text-2xl transform hover:scale-105 transition-transform duration-300"
      >
        Português
      </button>
    </div>
  );
};

export default LanguageScreen;