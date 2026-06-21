import { buildPrompt, MODELS, type ModelId, type PromptOptions } from '../data/presets';

/**
 * Pollinations.ai — бесплатный генератор изображений без ключа.
 * Документация: https://github.com/pollinations/pollinations/blob/master/APIDOCS.md
 *
 * У сервиса есть ограничение: 1 запрос на IP в очереди. При `variants > 1`
 * мы шлём запросы последовательно, иначе получим 402 «Queue full».
 */
const POLLINATIONS_BASE = 'https://image.pollinations.ai/prompt';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2_000;

export interface PollinationsOptions extends PromptOptions {
  model?: ModelId;
  variants?: number;
  imageReference?: string;
  aspectRatio?: string;
}

const ASPECT_DIMS: Record<string, { w: number; h: number }> = {
  auto:      { w: 1024, h: 768  },
  square:    { w: 1024, h: 1024 },
  landscape: { w: 1280, h: 720  },
  portrait:  { w: 768,  h: 1024 },
  wide:      { w: 1536, h: 640  },
};

export class QueueFullError extends Error {
  constructor() {
    super('Pollinations сейчас перегружен. Попробуйте через минуту или уменьшите количество вариантов.');
    this.name = 'QueueFullError';
  }
}

export class PollinationsService {
  async generateInteriorDesign(options: PollinationsOptions): Promise<string[]> {
    const prompt = buildPrompt(options);
    const model: ModelId = MODELS.includes(options.model as ModelId)
      ? (options.model as ModelId)
      : 'flux';
    const count = Math.max(1, Math.min(options.variants ?? 1, 4));

    console.log(`🎨 Pollinations[${model}] x${count}: ${prompt.slice(0, 100)}…`);

    const urls: string[] = [];
    // ВАЖНО: Pollinations ограничивает 1 запрос в очереди на IP — поэтому строго последовательно.
    for (let i = 0; i < count; i++) {
      const seed = Math.floor(Math.random() * 1_000_000);
      const url = await this.generateOneWithRetry(prompt, model, seed, options.imageReference, options.aspectRatio);
      urls.push(url);
    }

    console.log(`✅ Pollinations completed (${urls.length} variants)`);
    return urls;
  }

  private async generateOneWithRetry(
    prompt: string,
    model: ModelId,
    seed: number,
    imageRef?: string,
    aspectRatio?: string
  ): Promise<string> {
    let lastErr: unknown;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        return await this.generateOne(prompt, model, seed, imageRef, aspectRatio);
      } catch (err) {
        lastErr = err;
        const isQueueFull = err instanceof QueueFullError;
        const shouldRetry = isQueueFull && attempt < MAX_RETRIES;
        if (!shouldRetry) break;
        const delay = RETRY_DELAY_MS * attempt;
        console.warn(`⏳ Pollinations queue full, retry ${attempt}/${MAX_RETRIES} in ${delay}ms`);
        await this.sleep(delay);
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error('Pollinations request failed');
  }

  private async generateOne(
    prompt: string,
    model: ModelId,
    seed: number,
    imageRef?: string,
    aspectRatio?: string
  ): Promise<string> {
    const dims = ASPECT_DIMS[aspectRatio ?? ''] ?? ASPECT_DIMS.auto;
    const params = new URLSearchParams({
      width: String(dims.w),
      height: String(dims.h),
      seed: String(seed),
      model,
      nologo: 'true',
      enhance: 'true',
    });
    if (imageRef && imageRef.startsWith('http')) {
      params.set('image', imageRef);
    }

    const url = `${POLLINATIONS_BASE}/${encodeURIComponent(prompt)}?${params.toString()}`;
    const res = await fetch(url, { method: 'GET' });

    if (res.status === 402) {
      // 402 у Pollinations = «Queue full», к биллингу не имеет отношения.
      throw new QueueFullError();
    }
    if (res.status === 429) {
      throw new QueueFullError();
    }
    if (!res.ok) {
      throw new Error(`Pollinations вернул ${res.status} ${res.statusText}`);
    }

    // Прогреваем кеш: дочитываем тело, чтобы CDN сохранил картинку.
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.startsWith('image/')) {
      const text = await res.text();
      throw new Error(`Pollinations вернул некорректный ответ: ${text.slice(0, 120)}`);
    }
    await res.arrayBuffer();
    return url;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }
}

export const pollinationsService = new PollinationsService();
