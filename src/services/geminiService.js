import { GoogleGenAI, Modality } from '@google/genai';

export const generateImageWithGemini = async (
  userImageBase64,
  prompt
) => {
  const API_KEY = "AIzaSyAPS-x4IyP2Pu7ZblszAvZAitUh--ow2A4"; 
  
  if (!API_KEY || API_KEY === "TU_API_KEY_AQUI") {
    console.error("API_KEY no configurada en services/geminiService.js");
    throw new Error("La clave de API no está configurada. La demonstración no puede continuar.");
  }
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const imagePart = {
    inlineData: {
      data: userImageBase64,
      mimeType: 'image/jpeg',
    },
  };
  const textPart = { text: prompt };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
				role: 'user',
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
        imageConfig: {
        	aspectRatio: "9:16",
        },
        temperature: 0.4,
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error('La API no generó ninguna imagen.');
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Fallo al generar la imagen. Por favor, inténtalo de nuevo.');
  }
};