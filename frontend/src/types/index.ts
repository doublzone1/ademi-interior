export interface DesignParams {
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

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface PaletteOption {
  id: string;
  name: string;
  colors: string[];
}

export interface RoomOption {
  id: string;
  name: string;
  icon: string;
}

export interface SimpleOption {
  id: string;
  name: string;
  icon?: string;
}
