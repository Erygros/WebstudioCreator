import { calculate, configurationSchema } from '@/lib/pricing';
import { readLimitedBody } from '@/lib/http';
export async function POST(request: Request) {
  let raw: string;
  try {
    raw = new TextDecoder().decode(await readLimitedBody(request, 12000));
  } catch {
    return Response.json({ error: 'Payload too large' }, { status: 413 });
  }
  try {
    return Response.json(calculate(configurationSchema.parse(JSON.parse(raw))), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return Response.json(
      { error: 'Invalid configuration or outdated price version' },
      { status: 400 },
    );
  }
}
