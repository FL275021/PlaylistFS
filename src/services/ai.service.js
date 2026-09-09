// Generates a short "vibe" description for a playlist from its genre and tracks.
// Per the assignment, AI unavailability must never break the app - the caller
// (playlistController.generateVibe) always wraps this in try/catch and falls
// back to fallbackVibeSummary() below on any failure.
const DEFAULT_MODEL = 'claude-sonnet-4-6';

exports.generateVibeSummary = async ({ genreName, trackTitles }) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const trackList = trackTitles.length ? trackTitles.slice(0, 15).join(', ') : 'no tracks yet';

  const prompt = `You are helping describe a music playlist. Genre: "${genreName}". Tracks: ${trackList}. Write ONE short, catchy sentence (max 25 words) describing the vibe/mood of this playlist. Respond with only the sentence, no quotes, no preamble.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      max_tokens: 60,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`AI provider responded with status ${response.status}`);
  }

  const data = await response.json();
  const textBlock = (data.content || []).find((block) => block.type === 'text');

  if (!textBlock) {
    throw new Error('AI provider returned no text content');
  }

  return textBlock.text.trim();
};

exports.fallbackVibeSummary = (genreName) => `A curated mix of ${genreName} tracks.`;
