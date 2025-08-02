// src/services/ml.service.ts

import { InferenceSession, Tensor } from 'onnxruntime-web';

// This is the entire add.onnx model, encoded as a Base64 string.
const modelAsBase64 = "CAISBgoGZGVmYXVsdAiqAgoSCgpmb2F0X2lucHV0EgFCEgoBQiABGAFCBggAiQEaQQoBIgEwGgIgASIAQTQAEkAKATYaAiABEgBBNgASCgFDIAEYAUIINgACCAEaQQoBIgEyGgIgASIAQTQAEkAKATQaAiABEgBBNgASUAoGcGx1Z2luIhtvbm54cnVudGltZS5jb250cmliLndlYnBsdWdpbgpaChhodGVuc29yZmxvd190b19vbm54XzE4NjgyEjQKMjAyMy0wMy0xN1QxNzo0MTozMS41MDc2MjctMDc6MDAaC29ubng6OmFkZGl0GgVBREQtMVAAagxPTk5YIFZFUlNJT04YASgBMAA=";

// A helper function to convert the Base64 string back into binary data (ArrayBuffer)
async function base64toBuffer(base64: string): Promise<ArrayBuffer> {
    const dataUrl = `data:application/octet-stream;base64,${base64}`;
    const response = await fetch(dataUrl);
    return response.arrayBuffer();
}


class OnnxModelRunnerService {
  private session: InferenceSession | null = null;
  public isReady = false; // A flag to indicate if the model is loaded

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // 1. Convert our Base64 string back into the binary model data.
      const modelBuffer = await base64toBuffer(modelAsBase64);

      // 2. Create the ONNX session directly from the binary data in memory.
      // This requires no external file loading.
      this.session = await InferenceSession.create(modelBuffer);

      this.isReady = true;
      console.log("ONNX Model Runner Service initialized successfully FROM EMBEDDED DATA.");
    } catch (e) {
      console.error(`Failed to initialize ONNX Model Runner from embedded data: ${e}`);
    }
  }

  // This method to run the model is unchanged.
  async runAddModel(inputA: number, inputB: number): Promise<number | null> {
    if (!this.isReady || !this.session) {
      console.error("ONNX session is not ready.");
      return null;
    }

    try {
      const tensorA = new Tensor('float32', [inputA], [1]);
      const tensorB = new Tensor('float32', [inputB], [1]);
      const feeds = { float_input: tensorA, B: tensorB };

      const results = await this.session.run(feeds);
      
      const outputTensor = results.C;
      const sum = (outputTensor.data as Float32Array)[0];
      
      return sum;
    } catch (e) {
      console.error(`Failed to run ONNX model: ${e}`);
      return null;
    }
  }
}

export const mlService = new OnnxModelRunnerService();