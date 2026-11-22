import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, payload } = body;

    if (!provider || !payload) {
      return NextResponse.json({ error: 'Missing provider or payload' }, { status: 400 });
    }

    // Add eventId if not present (simulate unique transaction ID from gateway)
    if (!payload.eventId) {
      payload.eventId = crypto.randomUUID();
    }

    const secret = process.env.PAYMENT_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Webhook secret not configured on server' }, { status: 500 });
    }

    const signature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    const response = await fetch(`${apiUrl}/payment/webhook/${provider}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': signature,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Mock webhook proxy error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
