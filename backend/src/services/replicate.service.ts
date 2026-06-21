import Replicate from 'replicate';
import { env } from '../config/env';
import { buildPrompt, NEGATIVE_PROMPT } from '../data/presets';
import type { DesignRequest } from '../types';

const replicate = new Replicate({ auth: env.REPLICATE_API_TOKEN ?? '' });

const MODEL_VERSION =
  '76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38';

export interface GenerateOptions extends DesignRequest {
  imageUrl: string;
}

export type PredictionState =
  | { status: 'processing' }
  | { status: 'succeeded'; imageUrl: string }
  | { status: 'failed'; error: string };

export class ReplicateService {
  /**
   * Starts an async prediction and returns the prediction ID immediately.
   * The caller should poll `getPredictionStatus` until done.
   */
  async startPrediction(options: GenerateOptions): Promise<string> {
    const prompt = buildPrompt({
      roomType: options.roomType,
      style: options.style,
      colorPalette: options.colorPalette,
      customPrompt: options.customPrompt,
    });

    console.log('🚀 Starting Replicate prediction (async):', prompt.slice(0, 80) + '…');

    const prediction = await replicate.predictions.create({
      version: MODEL_VERSION,
      input: {
        image: options.imageUrl,
        prompt,
        negative_prompt: NEGATIVE_PROMPT,
        num_inference_steps: 50,
        guidance_scale: 15,
        prompt_strength: 0.8,
        seed: Math.floor(Math.random() * 1_000_000),
      },
    });

    console.log(`📋 Prediction ID: ${prediction.id}`);
    return prediction.id;
  }

  /**
   * Checks the current state of a prediction.
   */
  async getPredictionStatus(predictionId: string): Promise<PredictionState> {
    const prediction = await replicate.predictions.get(predictionId);

    if (prediction.status === 'succeeded') {
      const imageUrl = this.normalizeOutput(prediction.output);
      if (!imageUrl) return { status: 'failed', error: 'Replicate returned empty output' };
      console.log(`✅ Replicate prediction succeeded: ${imageUrl}`);
      return { status: 'succeeded', imageUrl };
    }

    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      const err = String((prediction as { error?: unknown }).error ?? 'Prediction failed');
      console.error(`❌ Replicate prediction ${prediction.status}: ${err}`);
      return { status: 'failed', error: err };
    }

    // 'starting' | 'processing'
    return { status: 'processing' };
  }

  private normalizeOutput(output: unknown): string | null {
    if (typeof output === 'string') return output;

    if (Array.isArray(output) && output.length > 0) {
      const first = output[0];
      return typeof first === 'string' ? first : null;
    }

    if (output && typeof output === 'object' && 'url' in output) {
      const value = (output as { url: unknown }).url;
      if (typeof value === 'function') {
        try {
          const result = (value as () => unknown).call(output);
          if (result instanceof URL) return result.toString();
          if (typeof result === 'string') return result;
        } catch {
          // ignore
        }
      }
      if (value instanceof URL) return value.toString();
      if (typeof value === 'string') return value;
    }

    return null;
  }
}

export const replicateService = new ReplicateService();
