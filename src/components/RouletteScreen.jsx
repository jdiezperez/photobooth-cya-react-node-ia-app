import React, { useState } from 'react';
import { DECORATIONS, STRINGS } from '../constants.js';

// Colores de la ruleta (ajustables)
const COLORS = {
    background: '#6b8e6b',      // Fondo verde apagado
    centerCircle: '#d3d3d3',     // Círculo central gris claro
    highlightBorder: '#ffd700'   // Borde amarillo brillante para iluminación
};

const RULETTE_SIZE = 500; // Tamaño de la ruleta en píxeles
const CENTER_RADIUS = 30; // Radio del círculo central
const SEGMENTS_COUNT = 6;

// Orden de los segmentos (sentido horario desde arriba-derecha): montaña (invierno), otoño, parque, parís, tormenta, ny (nocturna)
// Índices de DECORATIONS: mountain(2), autumn(3), amusement(5), paris(1), storm(4), ny(0)
const SEGMENT_ORDER = [2, 3, 5, 1, 4, 0];

// Configuración de vista para cada segmento (ajustable)
// Cada configuración permite: rotación (grados), posición (x, y), zoom/scale, espejo horizontal
// Puedes ajustar estos valores para mejorar el punto de vista de cada imagen
const SEGMENT_VIEW_CONFIG = [
    { // 0: Montaña (invierno) - segmento superior derecho
        rotation: 0,
        x: 60,
        y: -110,  // Mover hacia arriba para centrar mejor
        scale: .7,  // Zoom para ver mejor
        flipHorizontal: false
    },
    { // 1: Otoño
        rotation: 0,
        x: 178,
        y: -20,  // Mover hacia arriba
        scale: .7,  // Más zoom
        flipHorizontal: false
    },
    { // 2: Parque de atracciones - corregir inversión
        rotation: 0,
        x: -70,
        y: 200,
        scale: .7,
        flipHorizontal: true  // Solo espejo horizontal para corregir
    },
    { // 3: París
        rotation: 0,
        x: -90,
        y: 180,  // Mover hacia arriba
        scale: .7,
        flipHorizontal: false
    },
    { // 4: Tormenta
        rotation: 0,
        x: -120,
        y: -0,  // Mover hacia arriba
        scale: .7,
        flipHorizontal: false
    },
    { // 5: NY (nocturna)
        rotation: 0,
        x: -100,
        y: -180,  // Mover hacia arriba
        scale: .7,
        flipHorizontal: false
    }
];

const RouletteScreen = ({ onDecorationSelect, lang }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [finalIndex, setFinalIndex] = useState(null);

    // Función para crear el path de un segmento (quesito)
    const getSegmentPath = (index) => {
        const angleStep = 360 / SEGMENTS_COUNT;
        const startAngle = (index * angleStep - 90) * (Math.PI / 180);
        const endAngle = ((index + 1) * angleStep - 90) * (Math.PI / 180);
        const radius = RULETTE_SIZE / 2;
        const center = RULETTE_SIZE / 2;
        
        const x1 = center + radius * Math.cos(startAngle);
        const y1 = center + radius * Math.sin(startAngle);
        const x2 = center + radius * Math.cos(endAngle);
        const y2 = center + radius * Math.sin(endAngle);
        
        // El flag 0 indica arco menor a 180 grados (correcto para 60 grados)
        // El flag 1 indica dirección horaria (sweep-flag)
        return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
    };

    const spin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setFinalIndex(null);
        let spinCount = 0;
        const totalSpins = Math.floor(Math.random() * 5) + 20; // Número aleatorio de pasos
        const targetIndex = Math.floor(Math.random() * SEGMENTS_COUNT);
        
        const interval = setInterval(() => {
            setSelectedIndex(prev => (prev + 1) % SEGMENTS_COUNT);
            spinCount++;
            if (spinCount > totalSpins && spinCount % SEGMENTS_COUNT === targetIndex) {
                clearInterval(interval);
                setIsSpinning(false);
                setFinalIndex(targetIndex);
                setSelectedIndex(targetIndex);
            }
        }, 100);
    };

    const handleSelect = () => {
        if (finalIndex !== null) {
            const decorationIndex = SEGMENT_ORDER[finalIndex];
            onDecorationSelect(DECORATIONS[decorationIndex]);
        }
    };

    // Obtener la imagen para cada segmento
    const getSegmentImage = (segmentIndex) => {
        const decorationIndex = SEGMENT_ORDER[segmentIndex];
        return DECORATIONS[decorationIndex]?.image || '/src/images/amusement_small.jpg';
    };

    // Obtener el nombre del segmento para el texto final
    const getSegmentName = (segmentIndex) => {
        const decorationIndex = SEGMENT_ORDER[segmentIndex];
        return STRINGS[lang]['screen_roulette_name_' + (decorationIndex + 1)] || '';
    };

    const getSegmentDescription = (segmentIndex) => {
        const decorationIndex = SEGMENT_ORDER[segmentIndex];
        return STRINGS[lang]['screen_roulette_description_' + (decorationIndex + 1)] || '';
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen text-white p-8 overflow-hidden">
            <div className="absolute bottom-0 right-0 w-[150px] pb-8">
                <img src="./src/images/logo_CYA.png" alt="Logo CYA" />
            </div>
            <div className="absolute top-0 left-0 w-[250px] pt-24 pl-24">
                <img src="./src/images/drops.png" alt="Drops" />
            </div>
            <h1 className="text-7xl w-3/4 text-center mb-8 z-10 leading-[1.2]">{STRINGS[lang].screen_roulette_title}</h1>
            <p className="text-4xl mb-12 animate-fade-in-up text-center z-10">{STRINGS[lang].screen_roulette_text}</p>
            
            {/* Ruleta circular */}
            <div className="relative my-8" style={{ width: RULETTE_SIZE, height: RULETTE_SIZE }}>
                <svg width={RULETTE_SIZE} height={RULETTE_SIZE} style={{ position: 'absolute', top: 0, left: 0 }}>
                    <defs>
                        {/* Definir todos los clipPaths */}
                        {Array.from({ length: SEGMENTS_COUNT }).map((_, index) => (
                            <clipPath key={`clip-${index}`} id={`segment-${index}`}>
                                <path d={getSegmentPath(index)} />
                            </clipPath>
                        ))}
                    </defs>
                    {/* Segmentos de la ruleta */}
                    {Array.from({ length: SEGMENTS_COUNT }).map((_, index) => {
                        const isHighlighted = selectedIndex === index;
                        const isFinal = finalIndex === index;
                        const segmentPath = getSegmentPath(index);
                        const viewConfig = SEGMENT_VIEW_CONFIG[index];
                        const center = RULETTE_SIZE / 2;
                        
                        // Calcular transformaciones para la imagen
                        // En SVG las transformaciones se aplican de derecha a izquierda
                        // Queremos: mover imagen -> escalar -> rotar -> centrar
                        const scaleX = viewConfig.flipHorizontal ? -viewConfig.scale : viewConfig.scale;
                        const transform = [
                            `translate(${center}, ${center})`, // Paso 4: Mover el centro al origen de la transformación
                            `rotate(${viewConfig.rotation})`, // Paso 3: Rotar
                            `scale(${scaleX}, ${viewConfig.scale})`, // Paso 2: Escalar (con flip si es necesario)
                            `translate(${-center + viewConfig.x}, ${-center + viewConfig.y})` // Paso 1: Mover la imagen
                        ].join(' ');
                        
                        return (
                            <g key={index}>
                                {/* Imagen de fondo del segmento con clip-path */}
                                <g clipPath={`url(#segment-${index})`}>
                                    <image
                                        href={getSegmentImage(index)}
                                        x="0"
                                        y="0"
                                        width={RULETTE_SIZE}
                                        height={RULETTE_SIZE}
                                        transform={transform}
                                        preserveAspectRatio="xMidYMid slice"
                                        opacity={isHighlighted || isFinal ? 1 : 0.8}
                                        style={{ transition: 'opacity 0.2s' }}
                                    />
                                </g>
                                {/* Borde de iluminación */}
                                {(isHighlighted || isFinal) && (
                                    <path
                                        d={segmentPath}
                                        fill="none"
                                        stroke={COLORS.highlightBorder}
                                        strokeWidth="4"
                                        style={{ 
                                            filter: 'drop-shadow(0 0 8px ' + COLORS.highlightBorder + ')',
                                            transition: 'all 0.2s'
                                        }}
                                    />
                                )}
                            </g>
                        );
                    })}
                </svg>
                
                {/* Círculo central gris */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: CENTER_RADIUS * 2,
                        height: CENTER_RADIUS * 2,
                        backgroundColor: COLORS.background,
                        borderRadius: '50%',
                        zIndex: 10
                    }}
                />
            </div>

            <div className="h-24 text-center z-10">
                {finalIndex !== null ? (
                    <div className="animate-fade-in-up mt-2">
                        <p className="text-4xl">{getSegmentName(finalIndex)}</p>
                    </div>
                ) : (
                    <p className="">{STRINGS[lang].screen02_info}</p>
                )}
            </div>

            {finalIndex === null ? (
                <button 
                    onClick={spin} 
                    disabled={isSpinning} 
                    className="bg-[#276140] text-white py-3 px-16 text-4xl transform hover:scale-105 transition-transform duration-300 mt-4 z-10"
                >
                    {isSpinning ? STRINGS[lang].screen_roulette_btGirando : STRINGS[lang].screen_roulette_btGirar}
                </button>
            ) : (
                <button 
                    onClick={handleSelect} 
                    className="bg-[#276140] text-white py-3 px-16 text-4xl transform hover:scale-105 transition-transform duration-300 mt-4 animate-fade-in-up z-10"
                >
                    {STRINGS[lang].screen_roulette_btFoto}
                </button>
            )}
        </div>
    );
};

export default RouletteScreen;