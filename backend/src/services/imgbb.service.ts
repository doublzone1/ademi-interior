const IMGBB_URL = 'https://api.imgbb.com/1/upload';
const UPLOAD_TIMEOUT_MS = 10_000;

export class ImgbbService {
  constructor(private readonly apiKey: string) {}

  async upload(imageDataUrl: string): Promise<string> {
    // Strip "data:image/...;base64," prefix — imgbb expects raw base64.
    const base64 = imageDataUrl.includes(',')
      ? imageDataUrl.split(',')[1]
      : imageDataUrl;

    const body = new URLSearchParams({
      key: this.apiKey,
      image: base64,
      expiration: '600', // 10-minute TTL — enough for a session
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

    try {
      const res = await fetch(IMGBB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`imgbb responded ${res.status} ${res.statusText}`);
      }

      const json = (await res.json()) as { success: boolean; data?: { url?: string } };
      const url = json.data?.url;
      if (!json.success || !url) {
        throw new Error('imgbb: unexpected response shape');
      }

      return url;
    } finally {
      clearTimeout(timer);
    }
  }
}
