// Mirrors backend/src/data/presets.ts — keep in sync if backend prompt strings change.

const STYLE_PROMPTS: Record<string, string> = {
  modern: 'modern contemporary style, clean lines, minimalist furniture, sleek surfaces',
  minimalist: 'minimalist style, simple, uncluttered, neutral tones, functional design',
  scandinavian: 'scandinavian style, light wood, white walls, cozy textiles, hygge atmosphere',
  industrial: 'industrial style, exposed brick, metal pipes, concrete floors, edison bulbs',
  bohemian: 'bohemian style, eclectic patterns, layered textiles, plants, warm earthy tones',
  midcentury: 'mid-century modern style, retro furniture, walnut wood, geometric patterns',
  farmhouse: 'modern farmhouse style, shiplap walls, rustic wood, vintage decor, cozy',
  luxury: 'luxury style, marble, gold accents, velvet upholstery, crystal chandeliers',
  coastal: 'coastal style, white and blue palette, natural light, beach inspired decor',
  japanese: 'japandi style, zen aesthetic, tatami, shoji screens, natural materials',
  artdeco: 'art deco style, geometric patterns, brass fixtures, bold colors, glamorous',
  rustic: 'rustic style, exposed wooden beams, stone fireplace, warm earthy palette',
  tropical: 'tropical style, lush plants, rattan furniture, natural fibers, vibrant accents',
  classic: 'classic traditional style, ornate moldings, rich woods, elegant fabrics',
  mediterranean: 'mediterranean style, terracotta tiles, arched doorways, whitewashed walls, warm stone',
  wabi_sabi: 'wabi-sabi style, natural imperfections, aged wood, wabi textures, muted earthy tones, serene',
  cottagecore: 'cottagecore style, floral patterns, vintage furniture, cozy garden aesthetic, soft pastels',
  maximalist: 'maximalist style, bold colors, layered patterns, ornate decor, eclectic mix of textures, vibrant',
};

const PALETTE_PROMPTS: Record<string, string> = {
  warm_neutrals: 'warm neutral colors, beige, cream, taupe, soft browns',
  cool_neutrals: 'cool neutral colors, grays, silver, soft whites',
  earth_tones: 'earth tones, terracotta, ochre, olive green, sandy beige',
  monochrome: 'monochromatic black and white palette with subtle gray accents',
  pastel: 'soft pastel colors, blush pink, mint green, baby blue, lavender',
  jewel_tones: 'rich jewel tones, emerald green, sapphire blue, ruby red, amethyst',
  ocean_blue: 'ocean blue palette, navy, teal, aqua, with white accents',
  forest_green: 'forest green palette, deep greens, sage, moss with wood accents',
  warm_sunset: 'warm sunset palette, terracotta, burnt orange, coral, golden yellow',
  cool_lavender: 'cool lavender palette, purple, lilac, soft gray, white',
  bold_red: 'bold red palette, crimson, burgundy, with cream and gold accents',
  charcoal_gold: 'charcoal and gold palette, dark gray, black, brass and gold accents',
  sage_terracotta: 'sage green and terracotta palette, natural earthy with cream',
  navy_brass: 'navy and brass palette, deep blue with warm metallic accents',
  blush_gold: 'blush and gold palette, soft pink with rose gold accents',
  emerald_gold: 'emerald green and gold palette, luxurious with cream accents',
};

const ROOM_PROMPTS: Record<string, string> = {
  living_room: 'living room',
  bedroom: 'bedroom',
  kitchen: 'kitchen',
  bathroom: 'bathroom',
  dining_room: 'dining room',
  home_office: 'home office',
  kids_room: 'children bedroom',
  hallway: 'hallway',
  studio: 'studio apartment',
  outdoor: 'outdoor patio',
  gym: 'home gym and fitness room',
  sunroom: 'sunroom with glass walls and natural light',
  nursery: 'baby nursery and children nursery room',
  garage: 'converted garage workshop and creative space',
};

const LIGHTING_PROMPTS: Record<string, string> = {
  natural_day: 'bright natural daylight streaming through large windows',
  golden_hour: 'warm golden hour lighting, sunset glow',
  evening: 'cozy evening lighting, warm lamps, soft glow',
  night: 'moody night atmosphere, accent lighting, ambient glow',
  bright: 'bright even lighting, well-lit, no shadows',
};

const CAMERA_PROMPTS: Record<string, string> = {
  wide: 'wide angle shot, full room view, architectural photography',
  standard: 'standard view, eye level perspective',
  corner: 'corner perspective, showing two walls',
  detail: 'close-up detail shot, focus on furniture composition',
};

const DENSITY_PROMPTS: Record<string, string> = {
  minimal: 'sparse furniture, minimal decor, lots of empty space',
  balanced: 'well balanced furniture arrangement, comfortable spacing',
  rich: 'fully furnished, rich decor, layered textiles and accessories',
};

const MATERIAL_PROMPTS: Record<string, string> = {
  default: '',
  wood: 'natural wood textures, oak, walnut',
  marble: 'marble surfaces, polished stone',
  concrete: 'concrete walls and surfaces',
  fabric: 'soft fabric textures, linen, velvet',
  glass: 'glass surfaces, transparent elements',
};

export interface PromptOptions {
  roomType: string;
  style: string;
  colorPalette: string;
  lighting?: string;
  cameraAngle?: string;
  furnitureDensity?: string;
  material?: string;
  customPrompt?: string;
}

export function buildFrontendPrompt(p: PromptOptions): string {
  const room = ROOM_PROMPTS[p.roomType] ?? p.roomType;
  const style = STYLE_PROMPTS[p.style] ?? p.style;
  const palette = PALETTE_PROMPTS[p.colorPalette] ?? p.colorPalette;

  const parts: string[] = [`A beautiful ${room} interior`, style, palette];

  if (p.lighting && LIGHTING_PROMPTS[p.lighting]) parts.push(LIGHTING_PROMPTS[p.lighting]);
  if (p.cameraAngle && CAMERA_PROMPTS[p.cameraAngle]) parts.push(CAMERA_PROMPTS[p.cameraAngle]);
  if (p.furnitureDensity && DENSITY_PROMPTS[p.furnitureDensity]) parts.push(DENSITY_PROMPTS[p.furnitureDensity]);
  if (p.material && MATERIAL_PROMPTS[p.material]) parts.push(MATERIAL_PROMPTS[p.material]);

  parts.push(
    'professional interior design photography',
    'photorealistic, high quality, 8k, sharp focus',
    'magazine quality, well-composed, detailed textures',
  );

  if (p.customPrompt?.trim()) parts.push(p.customPrompt.trim());

  return parts.join(', ');
}
