'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react'

import {
  DEFAULT_TOAST_CONFIGS,
  createToastConfigMap,
  type ToastConfig,
} from './ToastConfig'

import type { ReactNode } from 'react'

/**
 * Toast の種類
 *
 * @deprecated 動的なToast設定を使用するため、この型は文字列リテラル型から string に変更されました
 */
export type ToastType = string

/**
 * Toast メッセージの型
 */
export type ToastMessage = {
  id: string
  type: ToastType
  message: string
}

/**
 * Toast コンテキストの型
 */
type ToastContextType = {
  toasts: ToastMessage[]
  showToast: (type: ToastType, message: string) => void
  removeToast: (id: string) => void
}

const TOAST_CONTEXT = createContext<ToastContextType | undefined>(undefined)

/**
 * Toast Provider
 *
 * アプリケーション全体でToast通知を管理するプロバイダー
 *
 * @param children - 子要素
 * @param configs - Toast設定の配列（省略時はデフォルト設定）
 */
export function ToastProvider({
  children,
  configs = DEFAULT_TOAST_CONFIGS,
}: {
  children: ReactNode
  configs?: ToastConfig[]
}): React.ReactElement {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Toast設定のMapを作成（パフォーマンス最適化のためuseMemoを使用）
  const configMap = useMemo(() => createToastConfigMap(configs), [configs])

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      const config = configMap.get(type)

      if (!config) {
        console.warn(`Unknown toast type: "${type}". Toast will not be shown.`)
        return
      }

      const id = `${Date.now()}-${Math.random()}`
      const newToast: ToastMessage = { id, type, message }

      setToasts((prev) => [...prev, newToast])

      // 設定されたdurationを使用
      if (config.duration !== Infinity) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== id))
        }, config.duration)
      }
    },
    [configMap]
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <TOAST_CONTEXT.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </TOAST_CONTEXT.Provider>
  )
}

/**
 * useToast フック
 *
 * Toast 通知を表示するためのフック
 *
 * @example
 * const toast = useToast()
 * toast.success('保存しました')
 * toast.error('エラーが発生しました')
 */
export function useToast(): {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
} {
  const context = useContext(TOAST_CONTEXT)

  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }

  const { showToast } = context

  return {
    success: (message: string) => showToast('success', message),
    error: (message: string) => showToast('error', message),
    info: (message: string) => showToast('info', message),
    warning: (message: string) => showToast('warning', message),
  }
}

/**
 * useToastContext フック
 *
 * Toast コンテキスト全体にアクセスするためのフック
 * （主に ToastContainer で使用）
 *
 * @returns Toast コンテキスト
 * @throws {Error} ToastProvider の外で使用された場合
 */
export function useToastContext(): ToastContextType {
  const context = useContext(TOAST_CONTEXT)

  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider')
  }

  return context
}
