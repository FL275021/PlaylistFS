import iaModel from '../config/ia.config.js';

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Genera una descripción corta del ambiente/vibe de una playlist usando Gemini.
 *
 * Si Gemini falla temporalmente, reintenta con espera progresiva.
 * Si se agotan los intentos, devuelve una descripción por defecto para que
 * la aplicación nunca devuelva un error por culpa del servicio de IA.
 */
export const generarVibePlaylist = async (
  { genreName, trackTitles },
  maximumAttempts = 2
) => {
  const listaCanciones = trackTitles.length
    ? trackTitles.slice(0, 15).join(', ')
    : 'sin canciones por ahora';

  const prompt = `
Género: "${genreName}". Canciones: ${listaCanciones}.
Escribe UNA frase corta y atractiva (máximo 25 palabras) que describa el vibe o ambiente de esta playlist.
Devuelve únicamente la frase, sin comillas ni introducciones.
  `.trim();

  for (let intento = 1; intento <= maximumAttempts; intento++) {
    try {
      const result = await iaModel.generateContent(prompt);
      const texto = result.response.text().trim();
      return texto || vibeDefault(genreName);
    } catch (error) {
      console.error(`Error de IA. Intento ${intento}/${maximumAttempts}:`, error.message);

      const esReintenTable =
        error.message?.includes('429') ||
        error.message?.includes('500') ||
        error.message?.includes('503');

      if (esReintenTable && intento < maximumAttempts) {
        const delay = intento * 1000;
        console.log(`Reintentando petición a Gemini en ${delay} ms...`);
        await esperar(delay);
        continue;
      }

      console.warn('Gemini no disponible. Se usa descripción por defecto.');
      return vibeDefault(genreName);
    }
  }

  return vibeDefault(genreName);
};

export const vibeDefault = (genreName) =>
  `Una selección curada de lo mejor del ${genreName}.`;
