import { NextResponse } from 'next/server'

import { logger } from '@/lib/logger'

import type { NextRequest } from 'next/server'

export async function GET(_request: NextRequest): Promise<NextResponse> {
  // デバッグモードでのみ有効
  if (!process.env.LOGDOCK_DEBUG) {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  try {
    // LogDockにテストログを送信
    await logger.info('Test log from Vercel preview', undefined, {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercel: process.env.VERCEL,
      test: true,
    })

    // LogDockのエンドポイントに直接アクセスしてテスト
    let testResponse: any = { ok: false, error: 'Not executed' }
    try {
      const response = await fetch(`${process.env.LOGDOCK_API_URL}/health`, {
        method: 'GET',
        headers: {
          'CF-Access-Client-Id': process.env.CF_ACCESS_CLIENT_ID ?? '',
          'CF-Access-Client-Secret': process.env.CF_ACCESS_CLIENT_SECRET ?? '',
        },
      })
      testResponse = {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      }
      if (!response.ok) {
        const text = await response.text()
        testResponse.error = text
      }
    } catch (error) {
      testResponse = {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.name : 'UnknownError',
      }
    }

    return NextResponse.json({
      message: 'LogDock test executed',
      logSent: true,
      healthCheck: testResponse.ok
        ? 'LogDock is reachable'
        : 'LogDock unreachable',
      healthCheckDetails: testResponse,
      config: {
        apiUrl: process.env.LOGDOCK_API_URL,
        hasApiKey: Boolean(process.env.LOGDOCK_API_KEY),
        hasCfAccess: Boolean(
          process.env.CF_ACCESS_CLIENT_ID && process.env.CF_ACCESS_CLIENT_SECRET
        ),
      },
    })
  } catch (error) {
    return NextResponse.json({
      message: 'LogDock test failed',
      error: error instanceof Error ? error.message : String(error),
    })
  }
}