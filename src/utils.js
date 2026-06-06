export const addLogoToImage = (baseImageBase64, logoUrl) => {
  return new Promise((resolve, reject) => {
    const baseImage = new Image();
    const logoImage = new Image();

    const baseImageSrc = `data:image/png;base64,${baseImageBase64}`;
    
    baseImage.crossOrigin = 'Anonymous';
    logoImage.crossOrigin = 'Anonymous';

    const imageLoadedPromise = new Promise(res => { baseImage.onload = res; });
    const logoLoadedPromise = new Promise(res => { logoImage.onload = res; });

    baseImage.src = baseImageSrc;
    logoImage.src = logoUrl; // Usamos la URL del logo que se pasa como argumento

    Promise.all([imageLoadedPromise, logoLoadedPromise])
      .then(() => {
        const canvas = document.createElement('canvas');
        canvas.width = baseImage.width;
        canvas.height = baseImage.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('No se pudo obtener el contexto del canvas.'));
        }

        // 1. Dibujar la imagen principal
        ctx.drawImage(baseImage, 0, 0);

        // 2. Calcular las dimensiones y posición del logo
        const padding = baseImage.width * 0.04; // 4% de padding
        const logoAspectRatio = logoImage.width / logoImage.height;
        let logoWidth = baseImage.width * 0.15; // El logo ocupa un 15% del ancho
        let logoHeight = logoWidth / logoAspectRatio;

        const logoX = canvas.width - logoWidth - padding;
        const logoY = canvas.height - logoHeight - padding;

        // 3. Dibujar el logo encima
        ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);

        // 4. Devolver el resultado como un nuevo data URL
        resolve(canvas.toDataURL('image/png'));
      })
      .catch(err => {
        console.error("Error cargando las imágenes para añadir el logo:", err);
        reject(new Error('No se pudieron cargar las imágenes para añadir el logo.'));
      });
  });
};