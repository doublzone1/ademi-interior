export interface DesignRequest {
  roomType: string;
  style: string;
  colorPalette: string;
  customPrompt?: string;
  lighting?: string;
  cameraAngle?: string;
  furnitureDensity?: string;
  material?: string;
  model?: string;
  variants?: number;
  focusArea?: string;
  aspectRatio?: string;
  useImageReference?: boolean;
}

export interface DesignResponse {
  success: boolean;
  imageUrl?: string;
  imageUrls?: string[];
  provider?: string;
  model?: string;
  error?: string;
  processingTime?: number;
}
