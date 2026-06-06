import React, { useState, useEffect } from 'react';
import { PuzzleResult } from '../constants.js';
import { STRINGS } from '../constants.js';

// NOTA: Esta función asume la existencia de un bucket de Google Cloud Storage
// que está configurado para ser públicamente escribible. Esto es INSEGURO
// para una aplicación del mundo real, pero se implementa según la solicitud del usuario.
const uploadImageToGCS = async (dataUrl, lang, code) => {
    // Un nombre de bucket ficticio. En un escenario real, esto se configuraría de forma segura.
    const BUCKET_NAME = 'fotos-puzzle-cya-ai'; 
    const fileName = `cya-${code}-${lang}-${Date.now()}.png`;
    
    // Convertir Data URL a Blob para la subida
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${BUCKET_NAME}/o?uploadType=media&name=${fileName}`;

    const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'image/png' },
        body: blob,
    });

    if (!uploadResponse.ok) {
        const errorBody = await uploadResponse.json().catch(() => ({})); // Evitar error si el cuerpo no es JSON
        console.error("Error en la subida a GCS:", errorBody);
        throw new Error(`Error al subir la imagen. Es posible que el bucket público no esté configurado. Código: ${uploadResponse.status}`);
    }

    // Devolver la URL pública del archivo subido
    return `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;
};

const QRCodeDisplay = ({ url }) => {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    return (
        <div className="flex flex-col items-center">
            <img src={qrApiUrl} alt="Código QR para descargar la imagen" className="bg-white p-2 shadow-xl border-8 border-[#e9e842] opacity-0 animate-[fadeIn_1s_ease-out_forwards]" />
        </div>
    );
};

const ResultScreen = ({ result, imageSrc, onRestart, lang, code }) => {
    const isWin = result === PuzzleResult.Win;
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
    const [publicUrl, setPublicUrl] = useState(null);

    useEffect(() => {
        const generateQrCode = async () => {
            setUploadStatus('uploading');
            try {
                const url = await uploadImageToGCS(imageSrc, lang, code);
                setPublicUrl(url);
                setUploadStatus('success');
            } catch (error) {
                console.error(error);
                setUploadStatus('error');
            }
        };

        if (imageSrc) {
            generateQrCode();
        }
    }, [imageSrc]);
    
    const messages = {
        win: { title: STRINGS[lang].screen_result_wintitle, text: STRINGS[lang].screen_result_wintext, icon: "🎉", color: "text-white" },
        lose: { title: STRINGS[lang].screen_result_losetitle, text: STRINGS[lang].screen_result_losetext, icon: "⌛", color: "text-white" }
    };
    
    const currentMessage = isWin ? messages.win : messages.lose;

    return (
        <div className="flex flex-col items-center justify-center h-screen text-white p-4 md:p-8 animate-fade-in-up">
            <div className="absolute bottom-0 right-0 w-[187px] pb-8">
                <img src="./src/images/logo_CYA.png" />
            </div>
            <div className="w-full max-w-5xl items-center justify-center gap-8">
                <div className="w-full flex flex-col items-center text-center">
                    <h1 className={`text-7xl mb-16 ${currentMessage.color}`}>{currentMessage.title}</h1>
                    <p className="text-4xl mb-16 max-w-xl text-white">
                        {currentMessage.text}
                    </p>
                </div>                
                <div className="relative w-full flex justify-center animate-[slideIn_1s_ease-out_forwards]">
                    <img 
                        src={imageSrc} 
                        alt="Resultado final" 
                        className="w-full max-w-lg object-contain border-8 border-[#276140]"
                        style={{maxHeight: '80vh'}}
                    />
                    <div className="w-full flex flex-col absolute translate-x-1/4 top-1/2 -translate-y-1/2">
                        <div className="h-56 flex flex-col items-center justify-center">
                            {uploadStatus === 'uploading' && (
                                <div className="flex flex-col items-center text-white animate-pulse">
                                    <svg className="animate-spin h-8 w-8 text-cyan-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="#276140" strokeWidth="4"></circle>
                                        <path fill="#e9e842" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <p>{STRINGS[lang].screen_result_generatingQR}</p>
                                </div>
                            )}
                            {uploadStatus === 'success' && publicUrl && <QRCodeDisplay url={publicUrl} />}
                            {uploadStatus === 'error' && (
                                <div className="flex flex-col items-center justify-center text-center text-red-400 p-4 bg-red-500/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="">{STRINGS[lang].screen_result_erroruploading1}</p>
                                    <p className="text-sm">{STRINGS[lang].screen_result_erroruploading2}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col items-center text-center mt-8">
                    <div className="flex flex-col w-full justify-center max-w-sm mt-6">
                        <button
                            onClick={onRestart}
                            className="bg-[#276140] text-white py-3 px-6 text-4xl w-96 transform hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2"
                        >
                            {STRINGS[lang].screen_result_btRepeat}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultScreen;