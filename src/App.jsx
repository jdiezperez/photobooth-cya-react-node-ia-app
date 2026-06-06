import React, { useState, useEffect, useCallback } from 'react';
import { GameState, PuzzleResult, INACTIVITY_TIMEOUT_MS } from './constants.js';
import { useInactivityTimer } from './hooks/useInactivityTimer.js';
import { generateImageWithGemini } from './services/geminiService.js';
import { addLogoToImage } from './utils.js';
import cyaLogo from './images/logo_CYA.png';
import LanguageScreen from './components/LanguageScreen.jsx';
import IntroScreen from './components/IntroScreen.jsx';
import WelcomeScreen from './components/WelcomeScreen.jsx';
import RouletteScreen from './components/RouletteScreen.jsx';
import CameraScreen from './components/CameraScreen.jsx';
import PuzzleScreen from './components/PuzzleScreen.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import InactivityModal from './components/InactivityModal.jsx';
import { STRINGS } from './constants.js';

const LoadingIcon = () => (
    <svg className="animate-spin h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="#276140" strokeWidth="4"></circle>
        <path fill="#e9e842" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const App = () => {
  const [lang, setLang] = useState('es');
  const [code, setCode] = useState('');
  const [gameState, setGameState] = useState(GameState.Language);
  const [selectedDecoration, setSelectedDecoration] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [puzzleResult, setPuzzleResult] = useState(null);
  const [showInactivityModal, setShowInactivityModal] = useState(false);
  const [processingError, setProcessingError] = useState(null);

  const handleRestart = useCallback(() => {
    setGameState(GameState.Roulette);
    setSelectedDecoration(null);
    setUserPhoto(null);
    setGeneratedImage(null);
    setPuzzleResult(null);
    setShowInactivityModal(false);
    setProcessingError(null);
  }, []);

  useEffect(() => {
    if (puzzleResult !== null) {
        setGameState(GameState.Result);
    }
  }, [puzzleResult]);

  useEffect(() => {
    if (gameState === GameState.Processing && userPhoto && selectedDecoration) {
        const processImage = async () => {
            try {
                setProcessingError(null);
                const resultBase64 = await generateImageWithGemini(userPhoto, selectedDecoration.prompt);
                const imageWithLogoDataUrl = await addLogoToImage(resultBase64, cyaLogo);
                const finalImageBase64 = imageWithLogoDataUrl.split(',')[1];
                setGeneratedImage(finalImageBase64);
                setGameState(GameState.Puzzle);
            } catch (error) {
                setProcessingError(error.message || 'Ocurrió un error desconocido.');
            }
        };
        processImage();
    }
  }, [gameState, userPhoto, selectedDecoration]);

	const handleLanguage = (lang, code) => {
    setLang(lang);
    setCode(code);
    setGameState(GameState.Roulette);
  }

	const handleIntroComplete = () => setGameState(GameState.Welcome);

  const handleTimeout = useCallback(() => {
    setShowInactivityModal(true);
  }, []);
  
  //const timerEnabled = (gameState !== GameState.Language && gameState !== GameState.Intro && gameState !== GameState.Welcome);
  const timerEnabled = (gameState !== GameState.Language && gameState !== GameState.Roulette);
  const { resetTimer } = useInactivityTimer(INACTIVITY_TIMEOUT_MS, handleTimeout, timerEnabled);

  const handleContinue = () => {
    setShowInactivityModal(false);
    resetTimer();
  };
  
  const handleStart = () => setGameState(GameState.Camera);
  
  const handleDecorationSelect = (decoration) => {
    setSelectedDecoration(decoration);
    setTimeout(() => setGameState(GameState.Welcome), 500);
  };
  
  const handlePhotoTaken = (photoDataUrl) => {
    const base64Data = photoDataUrl.split(',')[1];
    setUserPhoto(base64Data);
    setGameState(GameState.Processing);
  };

  const renderGameState = () => {
    switch(gameState) {
      case GameState.Language:
        return <LanguageScreen lang={lang} onStart={handleLanguage} />;
      case GameState.Intro:
        return <IntroScreen onStart={handleIntroComplete} />;
      case GameState.Welcome:
        return <WelcomeScreen lang={lang} onStart={handleStart} />;
      case GameState.Roulette:
        return <RouletteScreen lang={lang} onDecorationSelect={handleDecorationSelect} />;
      case GameState.Camera:
        return <CameraScreen lang={lang} onPhotoTaken={handlePhotoTaken} />;
      case GameState.Processing:
        return (
          <div className="flex flex-col items-center justify-center h-screen text-white p-8">
            {processingError ? (
              <>
                <h2 className="text-5xl font-bold text-red-500 mb-4 text-center">{STRINGS[lang].screen_processing_errortitle}</h2>
                <p className="text-2xl text-center mb-8 text-slate-300 max-w-md">{STRINGS[lang].screen_processing_errortext}</p>
                <button onClick={handleRestart} className="bg-[#276140] text-white py-3 px-8 text-2xl transform hover:scale-105 transition-transform duration-300">
                  {STRINGS[lang].screen_processing_btEmpezar}
                </button>
              </>
            ) : (
              <>
                <LoadingIcon />
                <h2 className="text-7xl mt-6 animate-pulse w-3/5 text-center">{STRINGS[lang].screen_processing_title}</h2>
                <p className="text-4xl mt-16 text-white text-center w-1/2">{STRINGS[lang].screen_processing_text}</p>
              </>
            )}
          </div>
        );
      case GameState.Puzzle:
        return <PuzzleScreen lang={lang} imageSrc={`data:image/png;base64,${generatedImage}`} onWin={() => setPuzzleResult(PuzzleResult.Win)} onLose={() => setPuzzleResult(PuzzleResult.Lose)} />;
      case GameState.Result:
        return <ResultScreen lang={lang} code={code} result={puzzleResult} imageSrc={`data:image/png;base64,${generatedImage}`} onRestart={handleRestart} />;
      default:
        return <RouletteScreen lang={lang} onDecorationSelect={handleDecorationSelect} />;
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#8b9e94]">
      {renderGameState()}
      {showInactivityModal && (
        <InactivityModal lang={lang} onContinue={handleContinue} onTimeout={handleRestart} />
      )}
    </main>
  );
};

export default App;