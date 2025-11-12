import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function GET(_request: NextRequest): Promise<NextResponse> {
  // デバッグモードでのみ有効
  if (!process.env.LOGDOCK_DEBUG) {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const results: Record<string, any> = {}

  // 1. LogDock API直接アクセス（Cloudflare Accessなし）
  try {
    const response = await fetch(process.env.LOGDOCK_API_URL ?? '', {
      method: 'GET',
    })
    results.directAccess = {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
    }
  } catch (error) {
    results.directAccess = {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }

  // 2. LogDock API with Cloudflare Access
  try {
    const response = await fetch(
      `${process.env.LOGDOCK_API_URL}/health` ?? '',
      {
        method: 'GET',
        headers: {
          'CF-Access-Client-Id': process.env.CF_ACCESS_CLIENT_ID ?? '',
          'CF-Access-Client-Secret': process.env.CF_ACCESS_CLIENT_SECRET ?? '',
        },
      }
    )
    results.withCloudflareAccess = {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
    }
  } catch (error) {
    results.withCloudflareAccess = {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }

  // 3. LogDock POST test (actual log endpoint)
  try {
    const response = await fetch(`${process.env.LOGDOCK_API_URL}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.LOGDOCK_API_KEY ?? '',
        'CF-Access-Client-Id': process.env.CF_ACCESS_CLIENT_ID ?? '',
        'CF-Access-Client-Secret': process.env.CF_ACCESS_CLIENT_SECRET ?? '',
      },
      body: JSON.stringify({
        app: 'meshi-share',
        level: 'info',
        message: 'Connection test from Vercel',
        userId: 'test',
        timestamp: new Date().toISOString(),
      }),
    })
    results.postLog = {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
    }
    if (!response.ok) {
      const text = await response.text()
      results.postLog.responseBody = text
    }
  } catch (error) {
    results.postLog = {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      errorType: error instanceof Error ? error.name : 'UnknownError',
    }
  }

  // 4. Test external connectivity
  try {
    const response = await fetch('https://api.github.com/zen')
    results.externalConnectivity = {
      ok: response.ok,
      status: response.status,
      message: 'External connectivity works',
    }
  } catch (error) {
    results.externalConnectivity = {
      ok: false,
      error: 'Cannot reach external services',
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    logdockUrl: process.env.LOGDOCK_API_URL,
    tests: results,
  })
}