// src/services/ml.service.ts

import { InferenceSession, Tensor } from 'onnxruntime-web';


// Loads the ONNX model from the public directory (public/add.onnx)


class OnnxModelRunnerService {
  private session: InferenceSession | null = null;
  public isReady = false; // A flag to indicate if the model is loaded

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {

      // Load the ONNX model from the public directory
      this.session = await InferenceSession.create('add.onnx');

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