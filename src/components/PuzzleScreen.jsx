import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PUZZLE_ROWS, PUZZLE_COLS, PUZZLE_TIMER_S } from '../constants.js';
import { STRINGS } from '../constants.js';

const PuzzleScreen = ({ imageSrc, onWin, onLose, lang }) => {
    const [pieces, setPieces] = useState([]);
    const [timeLeft, setTimeLeft] = useState(PUZZLE_TIMER_S);
    const [dragState, setDragState] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0, pieceWidth: 0, pieceHeight: 0 });
    const containerRef = useRef(null);
    const pointerPositionRef = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef(null);

    const shufflePieces = useCallback((piecesToShuffle, containerWidth, containerHeight) => {
        return piecesToShuffle.map(p => {
             if (p.isPlaced) return p;
             const newLeft = Math.random() * (containerWidth - dimensions.pieceWidth);
             const newTop = Math.random() * (containerHeight - dimensions.pieceHeight);
             return { ...p, currentLeft: newLeft, currentTop: newTop, zIndex: Math.floor(Math.random() * 100) };
        });
    }, [dimensions.pieceWidth, dimensions.pieceHeight]);

    useEffect(() => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;
            const aspectRatio = image.width / image.height;
            let boardWidth = Math.min(containerWidth * 0.9, 600);
            let boardHeight = boardWidth / aspectRatio;
            
            if (boardHeight > containerHeight * 0.8) {
                boardHeight = containerHeight * 0.8;
                boardWidth = boardHeight * aspectRatio;
            }

            const pieceWidth = boardWidth / PUZZLE_COLS;
            const pieceHeight = boardHeight / PUZZLE_ROWS;
            setDimensions({ width: boardWidth, height: boardHeight, pieceWidth, pieceHeight });

            const newPieces = [];
            for (let row = 0; row < PUZZLE_ROWS; row++) {
                for (let col = 0; col < PUZZLE_COLS; col++) {
                    newPieces.push({
                        id: row * PUZZLE_COLS + col,
                        imgX: col * pieceWidth,
                        imgY: row * pieceHeight,
                        correctCol: col,
                        correctRow: row,
                        isPlaced: false,
                    });
                }
            }
            setPieces(shufflePieces(newPieces, containerWidth, containerHeight));
        };
    }, [imageSrc, shufflePieces]);

    useEffect(() => {
        if (pieces.length === 0) {
            return;
        }

        const allPlaced = pieces.every(p => p.isPlaced);
        if (allPlaced) {
            onWin();
        } else if (timeLeft <= 0) {
            onLose();
        }
    }, [pieces, timeLeft, onWin, onLose]);

    useEffect(() => {
        if (pieces.length > 0 && timeLeft > 0) {
            const timerId = setTimeout(() => {
                setTimeLeft(t => t - 1);
            }, 1000);
            
            return () => clearTimeout(timerId);
        }
    }, [timeLeft, pieces.length]); // Depende de pieces.length, que solo cambia una vez. Esta es la clave.

    const handleMouseDown = (e, pieceId) => {
        e.preventDefault();
        const piece = pieces.find(p => p.id === pieceId);
        if (piece.isPlaced) return;
        
        const event = e.touches ? e.touches[0] : e;
        const offsetX = event.clientX - piece.currentLeft;
        const offsetY = event.clientY - piece.currentTop;
        
        setPieces(prev => prev.map(p => p.id === pieceId ? {...p, zIndex: 1000} : {...p, zIndex: p.zIndex !== 1000 ? p.zIndex : p.zIndex -1}));
        setDragState({ pieceId, offsetX, offsetY });
    };

    const handleMouseMove = useCallback((e) => {
        if (!dragState) return;
        e.preventDefault();
        const event = e.touches ? e.touches[0] : e;
        pointerPositionRef.current = { x: event.clientX, y: event.clientY };
    }, [dragState]);

    const handleMouseUp = useCallback(() => {
        if (!dragState) return;
        const piece = pieces.find(p => p.id === dragState.pieceId);
        const boardRect = containerRef.current.querySelector('.puzzle-board').getBoundingClientRect();
        
        const snapThreshold = 25;
        const correctLeft = boardRect.left + piece.correctCol * dimensions.pieceWidth;
        const correctTop = boardRect.top + piece.correctRow * dimensions.pieceHeight;
        
        if (Math.abs(piece.currentLeft - correctLeft) < snapThreshold && Math.abs(piece.currentTop - correctTop) < snapThreshold) {
            setPieces(prev => prev.map(p => p.id === dragState.pieceId ? { ...p, currentLeft: correctLeft, currentTop: correctTop, isPlaced: true, zIndex: 1 } : p));
        }
        setDragState(null);
    }, [dragState, pieces, dimensions.pieceWidth, dimensions.pieceHeight]);

    useEffect(() => {
        if (!dragState) return;
        
        const animationLoop = () => {
            if (!dragState) return;
            const { pieceId, offsetX, offsetY } = dragState;
            const { x, y } = pointerPositionRef.current;
            const newLeft = x - offsetX;
            const newTop = y - offsetY;

            setPieces(prev => prev.map(p =>
                p.id === pieceId ? { ...p, currentLeft: newLeft, currentTop: newTop } : p
            ));
            animationFrameRef.current = requestAnimationFrame(animationLoop);
        };
        animationFrameRef.current = requestAnimationFrame(animationLoop);
        
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [dragState]);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleMouseMove);
        window.addEventListener('touchend', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    const timerColor = timeLeft <= 5 ? 'text-red-500' : 'text-white';

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-center h-screen text-white p-4 overflow-hidden relative">
            <div className="absolute bottom-0 right-0 w-[187px] pb-8">
                <img src="./src/images/logo_CYA.png" />
            </div>
            <h1 className="text-7xl text-center z-[9999]">{STRINGS[lang].screen_puzzle_title}</h1>
            <div className="text-5xl bg-[#276140]/50 w-32 text-center px-4 py-2 mt-8 mb-48 z-[9999]">
                <span className={`${timerColor} transition-colors duration-300`}>{timeLeft} s</span>
            </div>            
            <div 
              className="puzzle-board relative shadow-lg bg-[#276140]"
              style={{
                width: dimensions.width,
                height: dimensions.height,
              }}
            >
              <img src={imageSrc} alt="Puzzle reference" className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none" />
              {Array.from({length: PUZZLE_ROWS * PUZZLE_COLS}).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute border border-[#276140]" 
                  style={{
                    width: dimensions.pieceWidth, 
                    height: dimensions.pieceHeight,
                    top: Math.floor(i / PUZZLE_COLS) * dimensions.pieceHeight,
                    left: (i % PUZZLE_COLS) * dimensions.pieceWidth,
                  }}
                ></div>
              ))}
            </div>

            {pieces.map(piece => (
                <div
                    key={piece.id}
                    onMouseDown={(e) => handleMouseDown(e, piece.id)}
                    onTouchStart={(e) => handleMouseDown(e, piece.id)}
                    className="absolute cursor-grab active:cursor-grabbing"
                    style={{
                        left: piece.currentLeft,
                        top: piece.currentTop,
                        width: dimensions.pieceWidth,
                        height: dimensions.pieceHeight,
                        backgroundImage: `url(${imageSrc})`,
                        backgroundPosition: `-${piece.imgX}px -${piece.imgY}px`,
                        backgroundSize: `${dimensions.width}px ${dimensions.height}px`,
                        zIndex: piece.zIndex,
                        transition: dragState?.pieceId === piece.id ? 'none' : 'all 0.2s ease',
                        outline: piece.isPlaced ? 'none' : '2px solid #276140',
                        outlineOffset: '-2px',
                    }}
                ></div>
            ))}
        </div>
    );
};

export default PuzzleScreen;