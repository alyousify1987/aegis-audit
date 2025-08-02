// src/services/ocr.service.ts

import Tesseract from 'tesseract.js';

class OcrService {
  public isReady = true;

  constructor() {
    console.log("OCR Service is configured for direct, on-demand recognition.");
  }

  async recognize(file: File, logger?: (m: any) => void): Promise<string> {
    console.log(`Starting OCR task for ${file.name}`);
    
    try {
      // --- START OF THE FIX ---
      
      // 1. Create a base options object.
      const options: Tesseract.RecognizeOptions = {};
      
      // 2. Only add the logger to the options if it was actually provided.
      if (logger) {
        options.logger = logger;
      }

      // 3. Pass the conditionally-built options object to Tesseract.
      const { data: { text } } = await Tesseract.recognize(
        file,
        'eng',
        options 
      );
      
      // --- END OF THE FIX ---
      
      console.log(`OCR task for ${file.name} finished successfully.`);
      return text;
      
    } catch (e) {
      console.error(`OCR task failed for file ${file.name}:`, e);
      return `OCR failed for file: ${file.name}`;
    }
  }
}

export const ocrService = new OcrService();