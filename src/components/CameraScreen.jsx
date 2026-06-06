import React, { useState, useEffect, useRef } from 'react';
import { STRINGS } from '../constants.js';

const CameraScreen = ({ onPhotoTaken, lang }) => {
    const [countdown, setCountdown] = useState(10);
    const [isCounting, setIsCounting] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        let stream;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1920, height: 1080, facingMode: 'user' } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setIsCounting(true);
                }
            } catch (err) {
                console.error("Error accessing camera: ", err);
                alert("No se pudo acceder a la cámara. Por favor, comprueba los permisos.");
            }
        };
        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (!isCounting) return;

        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            takePhoto();
        }
    }, [countdown, isCounting]);

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            
            // Guardar el contexto actual
            context.save();
            
            // Mover el origen al centro del canvas para rotar
            context.translate(canvas.width / 2, canvas.height / 2);
            
            // Rotar 180 grados (para alinear con la vista previa)
            context.rotate(Math.PI);
            
            // Dibujar la imagen (ajustar posición porque el origen está en el centro)
            context.drawImage(video, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
            
            // Restaurar el contexto
            context.restore();
            
            const dataUrl = canvas.toDataURL('image/jpeg');
            onPhotoTaken(dataUrl);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-8 relative border-[2vw] border-[#276140]">
            <div className="absolute bottom-0 right-0 w-[187px] pb-8 z-[9999]">
                <img src="./src/images/logo_CYA.png" />
            </div>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
                style={{ transform: 'scaleX(-1) rotate(180deg)' }}
            ></video>
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
                 <p className="text-7xl mb-4 px-4 py-2">{STRINGS[lang].screen_camera_title}</p>
                {isCounting && (
                    <div className="text-5xl text-white drop-shadow-lg bg-[#276140] w-96 py-3 mt-6" style={{textShadow: '0 0 20px #06b6d4'}}>
                        {countdown}
                    </div>
                )}
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};

export default CameraScreen;