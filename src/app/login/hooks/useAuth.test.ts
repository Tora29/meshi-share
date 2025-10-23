/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useAuth } from './useAuth'

// Server Actionsのモック
vi.mock('../server/authProviders', () => ({
  signInWithGoogleOAuth: vi.fn(),
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // window.location.href をリセット
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).location
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    window.location = { href: '' } as any
  })

  it('初期状態が正しい', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(typeof result.current.signIn).toBe('function')
  })

  it('signIn成功時にリダイレクトURLへ遷移', async () => {
    // Arrange
    const mockRedirectUrl = 'https://accounts.google.com/auth'
    const { signInWithGoogleOAuth } = await import('../server/authProviders')
    vi.mocked(signInWithGoogleOAuth).mockResolvedValue({
      data: { url: mockRedirectUrl },
      error: null,
    })

    const { result } = renderHook(() => useAuth())

    // Act
    const signInPromise = result.current.signIn()

    // Assert: ローディング中
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true)
    })

    // Assert: 成功後
    const response = await signInPromise
    expect(response.success).toBe(true)
    expect(signInWithGoogleOAuth).toHaveBeenCalledWith()
    expect(window.location.href).toBe(mockRedirectUrl)
  })

  it('signIn失敗時にエラーを設定', async () => {
    // Arrange
    const errorMessage = '認証に失敗しました'
    const { signInWithGoogleOAuth } = await import('../server/authProviders')
    vi.mocked(signInWithGoogleOAuth).mockResolvedValue({
      data: { url: null },
      error: { message: errorMessage, status: 500 },
    })

    const { result } = renderHook(() => useAuth())

    // Act
    const response = await result.current.signIn()

    // Assert
    expect(response.success).toBe(false)
    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage)
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('例外発生時にエラーを設定', async () => {
    // Arrange
    const errorMessage = 'Network error'
    const { signInWithGoogleOAuth } = await import('../server/authProviders')
    vi.mocked(signInWithGoogleOAuth).mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useAuth())

    // Act
    const response = await result.current.signIn()

    // Assert
    expect(response.success).toBe(false)
    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage)
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('不明なエラー時にデフォルトメッセージを設定', async () => {
    // Arrange
    const { signInWithGoogleOAuth } = await import('../server/authProviders')
    vi.mocked(signInWithGoogleOAuth).mockRejectedValue({
      code: 'UNKNOWN_ERROR',
    })

    const { result } = renderHook(() => useAuth())

    // Act
    const response = await result.current.signIn()

    // Assert
    expect(response.success).toBe(false)
    await waitFor(() => {
      expect(result.current.error).toBe('予期しないエラーが発生しました')
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('複数回のsignIn呼び出しでエラーがリセットされる', async () => {
    // Arrange
    const { signInWithGoogleOAuth } = await import('../server/authProviders')

    // 最初の呼び出しはエラー
    vi.mocked(signInWithGoogleOAuth).mockResolvedValueOnce({
      data: { url: null },
      error: { message: 'Error 1', status: 500 },
    })

    const { result } = renderHook(() => useAuth())

    // Act: 最初の呼び出し
    await result.current.signIn()
    await waitFor(() => {
      expect(result.current.error).toBe('Error 1')
    })

    // 2回目の呼び出しは成功
    vi.mocked(signInWithGoogleOAuth).mockResolvedValueOnce({
      data: { url: 'https://example.com' },
      error: null,
    })

    // Act: 2回目の呼び出し
    void result.current.signIn()

    // Assert: エラーがリセットされる
    await waitFor(() => {
      expect(result.current.error).toBe(null)
    })
  })
})
