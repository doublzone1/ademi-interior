import type { DesignParams, DesignResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const POLL_INTERVAL_MS = 3_000; // 3 s between status checks
const POLL_MAX_MS = 3 * 60_000;  // give up after 3 minutes

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ProviderInfo {
  provider: 'pollinations' | 'replicate';
  imageRequired: boolean;
}

export async function getProviderInfo(): Promise<ProviderInfo> {
  try {
    const res = await fetch(`${API_URL}/api/design/presets`);
    const json = await res.json();
    return {
      provider: json.data?.provider ?? 'pollinations',
      imageRequired: json.data?.imageRequired ?? false,
    };
  } catch {
    return { provider: 'pollinations', imageRequired: false };
  }
}

// ─── Async job polling (used when Replicate returns status:'processing') ──────

type AsyncResponse = DesignResponse & { status?: string; jobId?: string };

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function pollJobStatus(jobId: string, signal?: AbortSignal): Promise<DesignResponse> {
  const deadline = Date.now() + POLL_MAX_MS;

  while (Date.now() < deadline) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

    await sleep(POLL_INTERVAL_MS);

    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

    let response: Response;
    try {
      response = await fetch(`${API_URL}/api/design/status/${jobId}`, { signal });
    } catch (err) {
      if (signal?.aborted) throw err;
      throw new ApiError(0, 'network');
    }

    let payload: AsyncResponse;
    try {
      payload = (await response.json()) as AsyncResponse;
    } catch {
      throw new ApiError(response.status, 'serverBad');
    }

    if (!response.ok || !payload.success) {
      throw new ApiError(response.status, payload.error || 'generic');
    }

    if (payload.status !== 'processing') {
      // 'done' — return the full response
      return payload;
    }
    // Still running — loop again
  }

  throw new ApiError(408, 'timeout');
}

// ─── Main generate function ───────────────────────────────────────────────────

export async function generateDesign(
  imageFile: File | null,
  params: DesignParams,
  signal?: AbortSignal
): Promise<DesignResponse> {
  const formData = new FormData();
  if (imageFile) formData.append('image', imageFile);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, String(value));
    }
  });

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/design/generate`, {
      method: 'POST',
      body: formData,
      signal,
    });
  } catch (err) {
    if (signal?.aborted) throw err;
    throw new ApiError(0, 'network');
  }

  let payload: AsyncResponse;
  try {
    payload = (await response.json()) as AsyncResponse;
  } catch {
    throw new ApiError(response.status, 'serverBad');
  }

  if (!response.ok || !payload.success) {
    throw new ApiError(response.status, payload.error || 'generic');
  }

  // Replicate async: server started the job, now poll until done
  if (payload.status === 'processing' && payload.jobId) {
    return pollJobStatus(payload.jobId, signal);
  }

  return payload;
}
