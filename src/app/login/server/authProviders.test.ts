/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { signInWithGoogleOAuth } from './authProviders'

// Supabase serverクライアントのモック
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('authProviders', () => {
  describe('signInWithGoogleOAuth', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockSupabase: any

    beforeEach(async () => {
      // 各テストの前にモックをリセット
      mockSupabase = {
        auth: {
          signInWithOAuth: vi.fn(),
        },
      }

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockSupabase)
    })

    it('Google認証を実行する', async () => {
      // Arrange: モックの戻り値を設定
      const mockRedirectUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        data: { url: mockRedirectUrl },
        error: null,
      })

      // Act: 関数を実行
      const result = await signInWithGoogleOAuth()

      // Assert: 正しく呼ばれたか検証
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining('/auth/callback'),
        },
      })
      expect(result).toEqual({
        data: { url: mockRedirectUrl },
        error: null,
      })
    })

    it('Supabaseエラー時にエラーオブジェクトを返す', async () => {
      // Arrange: エラーケースのモック
      const mockError = { message: 'OAuth error', status: 500 }
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        data: { url: null },
        error: mockError,
      })

      // Act
      const result = await signInWithGoogleOAuth()

      // Assert: エラーが正しく返されるか
      expect(result).toEqual({
        data: { url: null },
        error: mockError,
      })
    })

    it('redirectToにはホスト名が含まれる', async () => {
      // Arrange
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://example.com' },
        error: null,
      })

      // Act
      await signInWithGoogleOAuth()

      // Assert: redirectToのフォーマットを確認
      const callArgs = mockSupabase.auth.signInWithOAuth.mock.calls[0][0]
      expect(callArgs.options.redirectTo).toMatch(
        /^https?:\/\/.+\/auth\/callback$/
      )
    })
  })
})
