import { env } from '../config/env';
import { pollinationsService } from './pollinations.service';
import { ImgbbService } from './imgbb.service';
import type { DesignRequest } from '../types';
import type { ModelId } from '../data/presets';

const imgbb = env.IMGBB_API_KEY ? new ImgbbService(env.IMGBB_API_KEY) : null;

export interface GenerateInput extends DesignRequest {
  imageDataUrl?: string;
}

export interface GenerateOutput {
  imageUrls: string[];
  provider: string;
  model?: string;
}

// Handles Pollinations only. Replicate is handled asynchronously in design.routes.ts.
class DesignService {
  async generate(input: GenerateInput): Promise<GenerateOutput> {
    // Upload the reference image to a public CDN so Pollinations can use it.
    // Falls back gracefully (text-only generation) if CDN is unavailable or not configured.
    let imageReference: string | undefined;
    if (input.imageDataUrl && imgbb) {
      try {
        imageReference = await imgbb.upload(input.imageDataUrl);
        console.log(`📸 Reference image uploaded: ${imageReference}`);
      } catch (err) {
        console.warn('⚠️  CDN upload failed, generating without image reference:', (err as Error).message);
      }
    }

    const urls = await pollinationsService.generateInteriorDesign({
      roomType: input.roomType,
      style: input.style,
      colorPalette: input.colorPalette,
      customPrompt: input.customPrompt,
      lighting: input.lighting,
      cameraAngle: input.cameraAngle,
      furnitureDensity: input.furnitureDensity,
      material: input.material,
      focusArea: input.focusArea,
      model: input.model as ModelId | undefined,
      variants: input.variants,
      imageReference,
      aspectRatio: input.aspectRatio,
    });

    return { imageUrls: urls, provider: 'pollinations', model: input.model ?? 'flux' };
  }

  isImageRequired(): boolean {
    return env.AI_PROVIDER === 'replicate';
  }

  getProviderName(): string {
    return env.AI_PROVIDER;
  }
}

export const designService = new DesignService();
