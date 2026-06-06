export const GameState = {
  Language: 'Language',
  Intro: 'Intro',
  Welcome: 'Welcome',
  Roulette: 'Roulette',
  Camera: 'Camera',
  Processing: 'Processing',
  Puzzle: 'Puzzle',
  Result: 'Result',
};

export const PuzzleResult = {
    Win: 'Win',
    Lose: 'Lose'
};

export const DECORATIONS = [
  {
    id: 'ny',
    image: '/src/images/ny_small.jpg',
    prompt:
      "Use the person exactly as seen in the input image — preserve face, pose, and outfit fully. Adjust perspective and framing slightly to create a more photogenic composition. Place them on a New York–style city street at night with illuminated shop windows, reflections, and yellow taxis. Modify only environment lighting, reflections, and depth to harmonize realism. Follow the cinematic, lifestyle tone typical of C&A urban campaigns with balanced contrast, correct scale, and realistic ground shadows.",
  },
  {
    id: 'paris',
    image: '/src/images/paris_small.jpg',
    prompt:
      "Use the person exactly as seen in the input image — preserve face, pose, and outfit fully. Adjust perspective and framing slightly to create a more photogenic composition. Place them in a Paris-style city environment during daylight, surrounded by cafés, architecture, and tourists. Modify only environment lighting, reflections, and depth to harmonize realism. Follow the clean, warm daylight tone typical of C&A travel campaigns with proper scale, soft shadows, and natural reflections.",
  },
  {
    id: 'mountain',
    image: '/src/images/mountain_small.jpg',
    prompt:
      "Use the person exactly as seen in the input image — preserve face, pose, and outfit fully. Adjust perspective and framing slightly to create a more photogenic composition. Place them in a snowy mountain or countryside environment with soft winter light. Modify only environment lighting, reflections, and depth to harmonize realism. Follow the natural, bright outdoor tone typical of C&A winter campaigns with proper scale and realistic ground shadows.",
  },
  {
    id: 'storm',
    image: '/src/images/badweather_small.jpg',
    prompt:
      "Use the person exactly as seen in the input image — preserve face, pose, and outfit fully. Adjust perspective and framing slightly to create a more photogenic composition. Place them in a stormy natural environment with gray clouds, trees moving in the wind, and puddles of rain. Modify only environment lighting, reflections, and depth to harmonize realism. Follow the moody, textured outdoor tone typical of C&A weatherwear campaigns with correct scale and natural reflections.",
  },
  {
    id: 'amusement',
    image: '/src/images/amusement_small.jpg',
    prompt:
      "Use the person exactly as seen in the input image — preserve face, pose, and outfit fully. Adjust perspective and framing slightly to create a more photogenic composition. Place them in a colorful amusement park environment with rides, lights, and outdoor activity. Modify only environment lighting, reflections, and depth to harmonize realism. Follow the bright, cheerful tone typical of C&A outdoor campaigns with accurate scale, soft shadows, and clean integration.",
  },
  {
    id: 'autumn',
    image: '/src/images/autumn_small.jpg',
    prompt:
      "Use the person exactly as seen in the input image — preserve face, pose, and outfit fully. Adjust perspective and framing slightly to create a more photogenic composition. Place them in an autumn park environment with fallen leaves, golden trees, and warm afternoon light. Modify only environment lighting, reflections, and depth to harmonize realism. Follow the soft, natural lifestyle tone typical of C&A fall campaigns with proper scale and realistic ground shadows.",
  },
];

export const PUZZLE_ROWS = 3;
export const PUZZLE_COLS = 2;
export const PUZZLE_PIECES_COUNT = PUZZLE_ROWS * PUZZLE_COLS;
export const PUZZLE_TIMER_S = 30;

export const INACTIVITY_TIMEOUT_MS = 60 * 1000;
export const MODAL_COUNTDOWN_S = 10;

export const STRINGS = 
  {
    es: 
		{
			screen_welcome_title: '¡Abrígate!',
			screen_welcome_text1: '', 
			screen_welcome_text2: '¡Tu foto perfecta te espera!',
			screen_welcome_btEmpezar: '¡Hacer foto!',

			screen_roulette_title: '¡Abrígate, participa y gana 10 € por compras superiores a 50 €!',
			screen_roulette_text: 'Descubre el escenario perfecto de tu Iconic Puffer',
			screen_roulette_btGirar: 'Comenzar',
			screen_roulette_btGirando: 'Girando...',
			screen_roulette_btFoto: 'Hacer foto',
			screen_roulette_name_1: 'NY de noche',
			screen_roulette_description_1: '',
			screen_roulette_name_2: '',
			screen_roulette_description_2: '',
			screen_roulette_name_3: 'Montaña',
			screen_roulette_description_3: '',
			screen_roulette_name_4: 'Otoño',
			screen_roulette_description_4: '',
			screen_roulette_name_5: 'Borrasca',
			screen_roulette_description_5: '',
			screen_roulette_name_6: 'Parque de atracciones',
			screen_roulette_description_6: '',

			screen_camera_title: '¡A posar!',

			screen_processing_title: 'Casi listo para conquistar el frío...',
			screen_processing_text: 'La IA está haciendo su magia, eso puede tardar unos segundos. ¡Espera un momento!',

			screen_puzzle_title: '¡Completa el puzzle!',

			screen_result_wintitle: '¡Felicidades!',
			screen_result_wintext: 'Has completado el puzzle. ¡Escanea el código QR para descargar la foto!',
			screen_result_losetitle: '¡Tiempo!',
			screen_result_losetext: 'Se acabo el tiempo… ¡no te rindas y prueba de nuevo!',
			screen_result_generatingQR: 'Generando código QR...',
			screen_result_erroruploading1: 'Error de subida',
			screen_result_erroruploading2: 'No se pudo generar el código QR para compartir.',
			screen_result_btRepeat: '¡Abrígate de nuevo!',

			screen_inactivity_title: '¿Sigues ahí?',
			screen_inactivity_text: 'La aplicación se reiniciará por inactividad en...',
			screen_inactivity_btConfirm: '¡Sigo aquí!',

			screen_processing_errortitle: '¡Oh no! Algo salió mal.',
			screen_processing_errortext: 'Fallo al generar la imagen. Por favor, inténtalo de nuevo.',
			screen_processing_btEmpezar: 'Volver a empezar',

		},
    pt:
		{
            screen_welcome_title: 'Aqueça-se!',
            screen_welcome_text1: '', 
            screen_welcome_text2: 'A sua foto perfeita está à sua espera!',
            screen_welcome_btEmpezar: 'Tirar foto!',

            screen_roulette_title: 'Aqueça-se, participe e ganhe 10 € em compras superiores a 50 €!',
            screen_roulette_text: 'Descubra o cenário perfeito para o seu Iconic Puffer',
            screen_roulette_btGirar: 'Começar',
            screen_roulette_btGirando: 'Girando...',
            screen_roulette_btFoto: 'Tirar foto',
            screen_roulette_name_1: 'NY à noite',
            screen_roulette_description_1: '',
            screen_roulette_name_2: '',
            screen_roulette_description_2: '',
            screen_roulette_name_3: 'Montanha',
            screen_roulette_description_3: '',
            screen_roulette_name_4: 'Outono',
            screen_roulette_description_4: '',
            screen_roulette_name_5: 'Tempestade',
            screen_roulette_description_5: '',
            screen_roulette_name_6: 'Parque de diversões',
            screen_roulette_description_6: '',

            screen_camera_title: 'Hora de posar!',

            screen_processing_title: 'Quase pronto para conquistar o frio…!',
            screen_processing_text: 'A IA está fazendo a sua mágica, isso pode levar alguns segundos. Aguarde um momento!',

            screen_puzzle_title: 'Complete o puzzle!',

            screen_result_wintitle: 'Parabéns!',
            screen_result_wintext: 'Você completou o puzzle. Escaneie o código QR para baixar a foto!',
            screen_result_losetitle: 'Tempo!',
            screen_result_losetext: 'O tempo acabou… não desista e tente novamente!',
            screen_result_generatingQR: 'Gerando código QR...',
            screen_result_erroruploading1: 'Erro de envio',
            screen_result_erroruploading2: 'Não foi possível gerar o código QR para compartilhar.',
            screen_result_btRepeat: 'Aqueça-se novamente!',

            screen_inactivity_title: 'Ainda está aí??',
            screen_inactivity_text: 'O aplicativo será reiniciado por inatividade em...',
            screen_inactivity_btConfirm: 'Ainda estou aqui!',

			screen_processing_errortitle: 'Oh não! Algo deu errado.',
			screen_processing_errortext: 'A geração da imagem falhou. Tente novamente.',
			screen_processing_btEmpezar: 'Recomeçar',
		},
    ca:
		{
            screen_welcome_title: 'Abriga’t!',
            screen_welcome_text1: '',
            screen_welcome_text2: 'La teva foto perfecta t’espera!',
            screen_welcome_btEmpezar: 'Fer foto!',

            screen_roulette_title: 'Abriga’t, participa i guanya 10 € en compres superiors a 50 €!',
            screen_roulette_text: 'Descobreix l’escenari perfecte per al teu Iconic Puffer',
            screen_roulette_btGirar: 'Comença',
            screen_roulette_btGirando: 'Girant...',
            screen_roulette_btFoto: 'Fer foto',
            screen_roulette_name_1: 'NY de nit',
            screen_roulette_description_1: '',
            screen_roulette_name_2: '',
            screen_roulette_description_2: '',
            screen_roulette_name_3: 'Muntanya',
            screen_roulette_description_3: '',
            screen_roulette_name_4: 'Tardor',
            screen_roulette_description_4: '',
            screen_roulette_name_5: 'Borrasca',
            screen_roulette_description_5: '',
            screen_roulette_name_6: 'Parc d’atraccions',
            screen_roulette_description_6: '',

            screen_camera_title: '¡Hora de fer-se la foto!',

            screen_processing_title: 'A punt de conquerir el fred…',
            screen_processing_text: 'La IA està fent la seva màgia, això pot trigar uns segons. Espera un moment',
                        
            screen_puzzle_title: 'Completa el trencaclosques!',

            screen_result_wintitle: '¡Enhorabona!',
            screen_result_wintext: 'Has completat el trencaclosques. Escaneja el codi QR per descarregar la foto!',
            screen_result_losetitle: 'Temps!',
            screen_result_losetext: 'El temps s’ha acabat… no et rendeixis i prova de nou!',
            screen_result_generatingQR: 'Generant codi QR...',
            screen_result_erroruploading1: 'Error de pujada',
            screen_result_erroruploading2: 'No se pudo generar el código QR para compartir.',
            screen_result_btRepeat: 'Abriga’t de nou!',

            screen_inactivity_title: 'Encara hi ets??',
            screen_inactivity_text: "L'aplicació es reiniciarà per inactivitat en...",
            screen_inactivity_btConfirm: 'Encara hi soc!',

			screen_processing_errortitle: 'Oh no! Alguna cosa va sortir malament.',
			screen_processing_errortext: 'Fallada en generar la imatge. Si us plau, torna-ho a intentar.',
			screen_processing_btEmpezar: 'Tornar a començar',
		}
	};
