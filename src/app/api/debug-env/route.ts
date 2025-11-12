import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function GET(_request: NextRequest): Promise<NextResponse> {
  // 本番環境では無効化すべきエンドポイント
  if (process.env.NODE_ENV === 'production' && !process.env.LOGDOCK_DEBUG) {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const envStatus = {
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL ? 'true' : 'false',
    logdock: {
      apiUrl: process.env.LOGDOCK_API_URL ? '✓ Set' : '✗ Missing',
      apiKey: process.env.LOGDOCK_API_KEY ? '✓ Set' : '✗ Missing',
      cfAccessId: process.env.CF_ACCESS_CLIENT_ID ? '✓ Set' : '✗ Missing',
      cfAccessSecret: process.env.CF_ACCESS_CLIENT_SECRET ? '✓ Set' : '✗ Missing',
      debug: process.env.LOGDOCK_DEBUG ?? 'not set',
    },
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing',
      serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ Set' : '✗ Missing',
    },
    database: {
      url: process.env.DATABASE_URL ? '✓ Set' : '✗ Missing',
    },
  }

  return NextResponse.json(envStatus)
}