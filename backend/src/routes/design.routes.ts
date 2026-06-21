import { Router, type Request, type Response, type NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { upload } from '../middleware/upload';
import { HttpError } from '../middleware/errorHandler';
import { designService } from '../services/design.service';
import { replicateService } from '../services/replicate.service';
import { QueueFullError } from '../services/pollinations.service';
import { env } from '../config/env';
import {
  STYLES,
  COLOR_PALETTES,
  ROOM_TYPES,
  LIGHTING,
  CAMERA_ANGLES,
  FURNITURE_DENSITY,
  MATERIALS,
  MODELS,
  QUICK_PROMPTS,
} from '../data/presets';

const router = Router();

// ─── In-memory async job store (Replicate only) ───────────────────────────────
interface Job {
  predictionId: string;
  expiresAt: number;
}
const pendingJobs = new Map<string, Job>();
const JOB_TTL_MS = 60 * 60 * 1000; // 1 hour

// Prune expired entries every 10 minutes so the Map doesn't grow unboundedly.
setInterval(() => {
  const now = Date.now();
  for (const [id, job] of pendingJobs) {
    if (job.expiresAt < now) pendingJobs.delete(id);
  }
}, 10 * 60 * 1000).unref(); // .unref() so this timer doesn't keep the process alive

// 60 generation requests per 15 min per IP — applies only to POST /generate
const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later' },
});

// Generous limit for status polling — must not share quota with /generate
const statusLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many status checks, please slow down' },
});

// ─── Input validation ─────────────────────────────────────────────────────────
const designSchema = z.object({
  roomType: z.string().min(1).max(50),
  style: z.string().min(1).max(50),
  colorPalette: z.string().min(1).max(50),
  customPrompt: z.string().max(500).optional(),
  lighting: z.string().max(50).optional(),
  cameraAngle: z.string().max(50).optional(),
  furnitureDensity: z.string().max(50).optional(),
  material: z.string().max(50).optional(),
  model: z.string().max(20).optional(),
  variants: z.coerce.number().int().min(1).max(4).optional(),
  focusArea: z.string().max(200).optional(),
  aspectRatio: z.string().max(20).optional(),
});

// ─── GET /presets ─────────────────────────────────────────────────────────────
router.get('/presets', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      styles: Object.keys(STYLES),
      colorPalettes: Object.keys(COLOR_PALETTES),
      roomTypes: Object.keys(ROOM_TYPES),
      lighting: Object.keys(LIGHTING),
      cameraAngles: Object.keys(CAMERA_ANGLES),
      furnitureDensity: Object.keys(FURNITURE_DENSITY),
      materials: Object.keys(MATERIALS),
      models: MODELS,
      quickPrompts: QUICK_PROMPTS,
      provider: designService.getProviderName(),
      imageRequired: designService.isImageRequired(),
    },
  });
});

// ─── POST /generate ───────────────────────────────────────────────────────────
router.post(
  '/generate',
  generateLimiter,
  upload.single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    const startedAt = Date.now();

    try {
      if (designService.isImageRequired() && !req.file) {
        throw new HttpError(400, 'Image file is required');
      }

      const parsed = designSchema.safeParse(req.body);
      if (!parsed.success) {
        const issues = parsed.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; ');
        throw new HttpError(400, `Invalid input: ${issues}`);
      }

      let imageDataUrl: string | undefined;
      if (req.file) {
        const base64 = req.file.buffer.toString('base64');
        imageDataUrl = `data:${req.file.mimetype};base64,${base64}`;
      }

      // ── Replicate: async flow ─────────────────────────────────────────────
      if (env.AI_PROVIDER === 'replicate') {
        if (!imageDataUrl) throw new HttpError(400, 'Image file is required for Replicate');

        const predictionId = await replicateService.startPrediction({
          roomType: parsed.data.roomType,
          style: parsed.data.style,
          colorPalette: parsed.data.colorPalette,
          customPrompt: parsed.data.customPrompt,
          imageUrl: imageDataUrl,
        });

        const jobId = randomUUID();
        pendingJobs.set(jobId, { predictionId, expiresAt: Date.now() + JOB_TTL_MS });

        return res.json({
          success: true,
          status: 'processing',
          jobId,
          provider: 'replicate',
        });
      }

      // ── Pollinations: sync flow ───────────────────────────────────────────
      const result = await designService.generate({
        ...parsed.data,
        imageDataUrl,
      });

      res.json({
        success: true,
        status: 'done',
        imageUrl: result.imageUrls[0],
        imageUrls: result.imageUrls,
        provider: result.provider,
        model: result.model,
        processingTime: Date.now() - startedAt,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (error instanceof QueueFullError) {
        return next(new HttpError(503, error.message));
      }
      if (env.AI_PROVIDER === 'replicate') {
        if (/401|Unauthenticated|authentication token/i.test(message)) {
          return next(
            new HttpError(401, 'Replicate отверг токен. Используйте AI_PROVIDER=pollinations бесплатно.')
          );
        }
        if (/402|payment|billing/i.test(message)) {
          return next(
            new HttpError(402, 'На аккаунте Replicate нужен биллинг. Используйте AI_PROVIDER=pollinations.')
          );
        }
      }
      if (/429|rate limit/i.test(message)) {
        return next(new HttpError(429, 'Слишком много запросов. Подождите минуту.'));
      }

      next(error);
    }
  }
);

// ─── GET /status/:jobId ───────────────────────────────────────────────────────
router.get(
  '/status/:jobId',
  statusLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    const job = pendingJobs.get(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found or expired' });
    }

    try {
      const state = await replicateService.getPredictionStatus(job.predictionId);

      if (state.status === 'succeeded') {
        pendingJobs.delete(req.params.jobId);
        return res.json({
          success: true,
          status: 'done',
          imageUrl: state.imageUrl,
          imageUrls: [state.imageUrl],
          provider: 'replicate',
        });
      }

      if (state.status === 'failed') {
        pendingJobs.delete(req.params.jobId);
        return res.status(500).json({ success: false, error: state.error });
      }

      // Still running
      return res.json({
        success: true,
        status: 'processing',
        jobId: req.params.jobId,
        provider: 'replicate',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
