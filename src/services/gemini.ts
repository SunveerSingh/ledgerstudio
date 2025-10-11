import { GoogleGenAI } from '@google/genai';

export interface GeneratedImage {
  url: string;
  prompt: string;
  revisedPrompt?: string;
}

export type CoverArtType = 'single' | 'album-front' | 'album-back' | 'tracklist' | 'cd-disc' | 'vinyl';

export interface TrackInfo {
  number: number;
  title: string;
  featuring?: string;
  duration?: string;
}

export interface GenerationOptions {
  lyrics: string;
  additionalPrompt?: string;
  genre?: string;
  style?: string;
  mood?: string;
  songTitle?: string;
  artistName?: string;
  featuredArtist?: string;
  numberOfImages?: number;
  size?: '1024x1024' | '1024x1792' | '1792x1024';
  quality?: 'standard' | 'hd';
  coverType?: CoverArtType;
  tracklist?: TrackInfo[];
  albumTitle?: string;
}

class GeminiService {
  private apiKey: string | null = null;
  private genAI: GoogleGenAI | null = null;

  constructor() {
    this.loadApiKey();
  }

  private loadApiKey() {
    this.apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY || null;
    if (this.apiKey) {
      this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  validateApiKey(): boolean {
    this.loadApiKey();
    return !!this.apiKey && this.apiKey.length > 0;
  }

  private buildPrompt(options: GenerationOptions): string {
    const {
      lyrics,
      additionalPrompt,
      genre,
      style,
      mood,
      songTitle,
      artistName,
      featuredArtist,
      coverType = 'single',
      tracklist,
      albumTitle,
    } = options;

    let prompt = '';

    // Special handling for GTA style
    const isGTAStyle = style?.toLowerCase() === 'gta';
    const effectiveStyle = isGTAStyle ? 'Rockstar Games loading screen, comic book panel layout with bold black outlines, stylized illustrated characters' : style;

    if (coverType === 'tracklist') {
      prompt = `Create a minimal, clean album back cover with the following tracks listed:\n\n`;

      if (tracklist && tracklist.length > 0) {
        tracklist.forEach((track) => {
          prompt += `${track.number}. ${track.title}`;
          if (track.featuring) prompt += ` feat. ${track.featuring}`;
          if (track.duration) prompt += ` ${track.duration}`;
          prompt += '\n';
        });
        prompt += '\n';
      }

      prompt += `Album: "${albumTitle}"\n`;
      prompt += `Artist: ${artistName}\n\n`;

      const styleHints = [];
      if (mood) styleHints.push(mood.toLowerCase());
      if (genre) styleHints.push(genre.toLowerCase());
      if (effectiveStyle) styleHints.push(effectiveStyle.toLowerCase());

      if (styleHints.length > 0) {
        prompt += `Aesthetic: ${styleHints.join(' ')} style\n\n`;
      }

      prompt += 'STRICT RULES:\n';
      prompt += '1. Display ONLY the track list, album title, and artist name shown above\n';
      prompt += '2. Use simple, clean typography - no fancy decorative fonts\n';
      prompt += '3. Abstract background ONLY (solid colors, gradients, simple geometric shapes)\n';
      prompt += '4. Match the color palette from the front cover\n';
      prompt += '5. DO NOT add any other text, words, lyrics, or labels\n';
      prompt += '6. DO NOT repeat any text multiple times\n';
      prompt += '7. Keep design minimal and professional\n';
      prompt += '8. NO photorealistic people or characters - use illustrations, abstract art, or objects only\n';
    } else if (coverType === 'album-front') {
      prompt = `Design a professional album cover for ${genre || 'music'} in ${effectiveStyle || 'contemporary'} style.\n\n`;

      prompt += `Album title: "${albumTitle}"\n`;
      prompt += `Artist name: ${artistName}\n`;
      prompt += 'Display these prominently with artistic typography.\n\n';

      if (lyrics) {
        const lyricSample = lyrics.substring(0, 200).replace(/\n+/g, ' ').trim();
        prompt += `Mood and theme inspiration (for visual concept only, DO NOT display this text): ${lyricSample}\n\n`;
      }

      const visualDesc = [];
      if (mood) visualDesc.push(`${mood.toLowerCase()} mood`);
      if (genre) visualDesc.push(`${genre.toLowerCase()} genre aesthetic`);
      if (visualDesc.length > 0) {
        prompt += `Visual direction: ${visualDesc.join(', ')}\n\n`;
      }

      prompt += 'Design requirements:\n';
      prompt += '- Bold central imagery or abstract design\n';
      prompt += '- Strong color palette that captures the mood\n';
      prompt += '- Clean, impactful typography for album and artist name\n';
      prompt += '- Composition suitable for square format (album cover)\n';
      prompt += '- Professional, high-end aesthetic\n';
      prompt += '- NO photorealistic people or characters - use illustrations, abstract art, or objects only\n';
      prompt += '- CRITICAL: Only show the album title and artist name - NO other text, NO lyrics, NO random words\n';
    } else {
      prompt = 'Design a professional music cover art:\n\n';
      prompt += 'TEXT REQUIREMENTS (mandatory):\n';
      const textElements = [];
      if (songTitle) textElements.push(`Song: "${songTitle}"`);
      if (artistName) textElements.push(`Artist: ${artistName}`);
      if (featuredArtist) textElements.push(`feat. ${featuredArtist}`);
      prompt += textElements.join(' | ') + '\n';
      prompt += 'All text must be clearly visible and readable.\n\n';

      const styleDetails = [];
      if (genre) styleDetails.push(`Genre: ${genre}`);
      if (mood) styleDetails.push(`Mood: ${mood}`);
      if (effectiveStyle) styleDetails.push(`Style: ${effectiveStyle}`);

      if (styleDetails.length > 0) {
        prompt += 'VISUAL DIRECTION:\n' + styleDetails.join(' | ') + '\n\n';
      }

      if (lyrics) {
        const lyricSample = lyrics.substring(0, 200).replace(/\n+/g, ' ').trim();
        prompt += `Mood inspiration (for visual concept only, DO NOT display this text): ${lyricSample}\n\n`;
      }

      prompt += 'DESIGN REQUIREMENTS:\n';
      if (isGTAStyle) {
        prompt += '- Comic book panel layout with multiple scene boxes\n';
        prompt += '- Bold black outlines around all elements\n';
        prompt += '- Stylized illustrated characters in urban/street scenes\n';
        prompt += '- Saturated, vibrant colors with strong contrast\n';
        prompt += '- Hand-drawn aesthetic with clean line work\n';
        prompt += '- Central bold text with thick white outline\n';
        prompt += '- NO photorealistic people - stylized cartoon/illustration only\n';
      } else {
        prompt += '- Professional typography matching genre\n';
        prompt += '- Striking visual composition\n';
        prompt += '- Color palette reflecting mood\n';
        prompt += '- Streaming platform ready\n';
        prompt += '- NO photorealistic people or characters - use illustrations, abstract art, or objects only\n';
      }
    }

    if (additionalPrompt) {
      prompt += `\nCUSTOM REQUESTS: ${additionalPrompt}`;
    }

    return prompt;
  }

  async generateImagePrompt(options: GenerationOptions): Promise<string> {
    if (!this.validateApiKey() || !this.genAI) {
      throw new Error('Google AI API key is not configured. Please add VITE_GOOGLE_AI_API_KEY to your .env file.');
    }

    try {
      const prompt = this.buildPrompt(options);
      return prompt;
    } catch (error: any) {
      console.error('Prompt generation error:', error);
      throw new Error(error.message || 'Failed to generate image prompt');
    }
  }

  async generateImage(prompt: string): Promise<string> {
    if (!this.validateApiKey() || !this.genAI) {
      throw new Error('Google AI API key is not configured. Please add VITE_GOOGLE_AI_API_KEY to your .env file.');
    }

    try {
      const response = await this.genAI.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
          numberOfImages: 1,
        },
      });

      const images = response.generatedImages;
      if (!images || images.length === 0) {
        throw new Error('No images were generated. The prompt may have been blocked.');
      }

      const base64ImageBytes = images[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      return imageUrl;
    } catch (error: any) {
      console.error('Imagen API error:', error);

      if (error.message?.includes('quota')) {
        throw new Error('Google AI API quota exceeded. Please check your API limits at https://aistudio.google.com/app/apikey');
      }

      if (error.message?.includes('API key') || error.message?.includes('not found')) {
        throw new Error('Invalid Google AI API key or insufficient permissions. Please check your configuration.');
      }

      throw new Error(error.message || 'Failed to generate image');
    }
  }

  async generateAlbumPairs(options: GenerationOptions & { numberOfPairs: number }): Promise<GeneratedImage[]> {
    if (!this.validateApiKey() || !this.genAI) {
      throw new Error('Google AI API key is not configured. Please add VITE_GOOGLE_AI_API_KEY to your .env file.');
    }

    const { numberOfPairs } = options;
    const images: GeneratedImage[] = [];

    const variations = [
      'vibrant and bold colors',
      'dark and moody atmosphere',
      'minimalist and clean design',
      'dynamic and energetic composition'
    ];

    try {
      for (let i = 0; i < numberOfPairs; i++) {
        const variationStyle = variations[i % variations.length];

        // Generate front cover
        const frontPrompt = this.buildPrompt({ ...options, coverType: 'album-front' });
        const frontFinalPrompt = `${frontPrompt}\n\nVariation style: ${variationStyle}`;

        try {
          const frontUrl = await this.generateImage(frontFinalPrompt);
          images.push({
            url: frontUrl,
            prompt: frontFinalPrompt,
            revisedPrompt: frontFinalPrompt
          });

          // Generate matching tracklist with same style
          const tracklistPrompt = this.buildPrompt({ ...options, coverType: 'tracklist' });
          const tracklistFinalPrompt = `${tracklistPrompt}\n\nVariation style: ${variationStyle}\n\nIMPORTANT: Match the visual style, colors, and design language of the front cover exactly.`;

          const tracklistUrl = await this.generateImage(tracklistFinalPrompt);
          images.push({
            url: tracklistUrl,
            prompt: tracklistFinalPrompt,
            revisedPrompt: tracklistFinalPrompt
          });
        } catch (error) {
          console.error(`Failed to generate pair ${i + 1}:`, error);
          const frontPlaceholder = this.generatePlaceholderImage(
            options.albumTitle || 'Untitled',
            options.artistName || 'Artist',
            i * 2 + 1
          );
          const tracklistPlaceholder = this.generatePlaceholderImage(
            options.albumTitle || 'Untitled',
            options.artistName || 'Artist',
            i * 2 + 2
          );
          images.push({
            url: frontPlaceholder,
            prompt: frontFinalPrompt,
            revisedPrompt: frontFinalPrompt
          });
          images.push({
            url: tracklistPlaceholder,
            prompt: tracklistFinalPrompt,
            revisedPrompt: tracklistFinalPrompt
          });
        }
      }

      return images;
    } catch (error: any) {
      console.error('Album pair generation error:', error);
      throw error;
    }
  }

  async generateMultipleVariations(options: GenerationOptions): Promise<GeneratedImage[]> {
    if (!this.validateApiKey() || !this.genAI) {
      throw new Error('Google AI API key is not configured. Please add VITE_GOOGLE_AI_API_KEY to your .env file.');
    }

    const numberOfImages = options.numberOfImages || 4;
    const images: GeneratedImage[] = [];

    try {
      const basePrompt = this.buildPrompt(options);

      const variations = [
        'vibrant and bold colors',
        'dark and moody atmosphere',
        'minimalist and clean design',
        'dynamic and energetic composition'
      ];

      for (let i = 0; i < numberOfImages; i++) {
        const variationStyle = variations[i % variations.length];
        const finalPrompt = `${basePrompt}\n\nVariation style: ${variationStyle}`;

        try {
          const imageUrl = await this.generateImage(finalPrompt);
          images.push({
            url: imageUrl,
            prompt: finalPrompt,
            revisedPrompt: finalPrompt
          });
        } catch (error) {
          console.error(`Failed to generate variation ${i + 1}:`, error);
          const placeholderUrl = this.generatePlaceholderImage(
            options.songTitle || 'Untitled',
            options.artistName || 'Artist',
            i + 1
          );
          images.push({
            url: placeholderUrl,
            prompt: finalPrompt,
            revisedPrompt: finalPrompt
          });
        }
      }

      return images;
    } catch (error: any) {
      console.error('Image generation error:', error);
      throw error;
    }
  }

  private generatePlaceholderImage(title: string, artist: string, variant: number): string {
    const colors = [
      ['667eea', '764ba2'],
      ['f093fb', 'f5576c'],
      ['4facfe', '00f2fe'],
      ['43e97b', '38f9d7']
    ];

    const [color1, color2] = colors[variant - 1] || colors[0];

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, `#${color1}`);
    gradient.addColorStop(1, `#${color2}`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 100 + 50;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const titleY = canvas.height / 2 - 40;
    const artistY = canvas.height / 2 + 40;

    ctx.fillText(title.substring(0, 20), canvas.width / 2, titleY);

    ctx.font = '40px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(artist.substring(0, 20), canvas.width / 2, artistY);

    ctx.font = '24px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(`Variation ${variant}`, canvas.width / 2, canvas.height - 50);

    return canvas.toDataURL('image/png');
  }
}

export const GeminiServiceInstance = new GeminiService();
