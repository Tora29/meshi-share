import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import LoginPage from './page'

import type { ReadonlyURLSearchParams } from 'next/navigation'

// Next.js のモック
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}))

// カスタムフックのモック
vi.mock('./_hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

describe('LoginPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks()

    // デフォルトのuseSearchParamsモック
    const { useSearchParams } = await import('next/navigation')
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    } as unknown as ReadonlyURLSearchParams)

    // デフォルトのuseAuthモック
    const { useAuth } = await import('./_hooks/useAuth')
    vi.mocked(useAuth).mockReturnValue({
      signIn: vi.fn(),
      isLoading: false,
      error: null,
    })
  })

  describe('基本レンダリング', () => {
    it('タイトルと説明文が正しくレンダリングされる', () => {
      render(<LoginPage />)

      expect(screen.getByText('Meshi Share')).toBeInTheDocument()
      expect(screen.getByText('社内飯どころ共有アプリ')).toBeInTheDocument()
    })

    it('ログインボタンが正しくレンダリングされる', () => {
      render(<LoginPage />)

      const button = screen.getByRole('button', { name: /google.*ログイン/i })
      expect(button).toBeInTheDocument()
    })

    it('プライマリバリアントが適用される', () => {
      render(<LoginPage />)

      const button = screen.getByRole('button', { name: /google.*ログイン/i })
      expect(button).toHaveClass('btn-primary')
    })

    it('カードレイアウトが正しく構成される', () => {
      const { container } = render(<LoginPage />)

      // min-h-screen と flex が適用されたコンテナが存在する
      const wrapper = container.querySelector('.min-h-screen.flex')
      expect(wrapper).toBeInTheDocument()

      // max-w-md のカードが存在する
      const card = container.querySelector('.max-w-md')
      expect(card).toBeInTheDocument()
    })
  })

  describe('エラー表示 - URLパラメータ経由', () => {
    it('エラーがない場合、エラーメッセージが表示されない', () => {
      render(<LoginPage />)

      // エラーメッセージのテキストが存在しないことを確認
      expect(
        screen.queryByText('認証コードが見つかりませんでした')
      ).not.toBeInTheDocument()
      expect(screen.queryByText('認証に失敗しました')).not.toBeInTheDocument()
      expect(
        screen.queryByText('予期しないエラーが発生しました')
      ).not.toBeInTheDocument()
    })

    it('エラーがある場合、エラーメッセージが表示される', async () => {
      const { useSearchParams } = await import('next/navigation')
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn().mockReturnValue('auth_failed'),
      } as unknown as ReadonlyURLSearchParams)

      render(<LoginPage />)

      expect(screen.getByText('認証に失敗しました')).toBeInTheDocument()
    })

    it('未知のエラーコードの場合、エラーメッセージが表示されない', async () => {
      const { useSearchParams } = await import('next/navigation')
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn().mockReturnValue('unknown_error'),
      } as unknown as ReadonlyURLSearchParams)

      render(<LoginPage />)

      // エラーメッセージのテキストが存在しないことを確認
      expect(
        screen.queryByText('認証コードが見つかりませんでした')
      ).not.toBeInTheDocument()
      expect(screen.queryByText('認証に失敗しました')).not.toBeInTheDocument()
      expect(
        screen.queryByText('予期しないエラーが発生しました')
      ).not.toBeInTheDocument()
    })

    it('すべてのエラーコードが正しくマッピングされる', async () => {
      const { useSearchParams } = await import('next/navigation')

      // no_code
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn().mockReturnValue('no_code'),
      } as unknown as ReadonlyURLSearchParams)
      const { rerender } = render(<LoginPage />)
      expect(
        screen.getByText('認証コードが見つかりませんでした')
      ).toBeInTheDocument()

      // auth_failed
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn().mockReturnValue('auth_failed'),
      } as unknown as ReadonlyURLSearchParams)
      rerender(<LoginPage />)
      expect(screen.getByText('認証に失敗しました')).toBeInTheDocument()

      // unexpected
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn().mockReturnValue('unexpected'),
      } as unknown as ReadonlyURLSearchParams)
      rerender(<LoginPage />)
      expect(
        screen.getByText('予期しないエラーが発生しました')
      ).toBeInTheDocument()
    })
  })

  describe('エラー表示 - useAuth経由', () => {
    it('useAuthのエラーが表示される', async () => {
      const errorMessage = '認証処理でエラーが発生しました'
      const { useAuth } = await import('./_hooks/useAuth')
      vi.mocked(useAuth).mockReturnValue({
        signIn: vi.fn(),
        isLoading: false,
        error: errorMessage,
      })

      render(<LoginPage />)

      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    it('URLパラメータのエラーがuseAuthのエラーより優先される', async () => {
      const { useSearchParams } = await import('next/navigation')
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn().mockReturnValue('auth_failed'),
      } as unknown as ReadonlyURLSearchParams)

      const { useAuth } = await import('./_hooks/useAuth')
      vi.mocked(useAuth).mockReturnValue({
        signIn: vi.fn(),
        isLoading: false,
        error: 'useAuthのエラー',
      })

      render(<LoginPage />)

      // URLパラメータのエラーが表示される
      expect(screen.getByText('認証に失敗しました')).toBeInTheDocument()
      // useAuthのエラーは表示されない
      expect(screen.queryByText('useAuthのエラー')).not.toBeInTheDocument()
    })
  })

  describe('ボタンの動作', () => {
    it('クリック時にsignIn関数が呼ばれる', async () => {
      const mockSignIn = vi.fn()
      const { useAuth } = await import('./_hooks/useAuth')
      vi.mocked(useAuth).mockReturnValue({
        signIn: mockSignIn,
        isLoading: false,
        error: null,
      })

      const user = userEvent.setup()
      render(<LoginPage />)

      const button = screen.getByRole('button', { name: /google.*ログイン/i })
      await user.click(button)

      expect(mockSignIn).toHaveBeenCalledTimes(1)
    })

    it('ローディング中はボタンが無効化される', async () => {
      const { useAuth } = await import('./_hooks/useAuth')
      vi.mocked(useAuth).mockReturnValue({
        signIn: vi.fn(),
        isLoading: true,
        error: null,
      })

      render(<LoginPage />)

      const button = screen.getByRole('button', { name: /ログイン中/i })
      expect(button).toBeDisabled()
      expect(screen.getByText(/ログイン中/i)).toBeInTheDocument()
    })
  })
})
