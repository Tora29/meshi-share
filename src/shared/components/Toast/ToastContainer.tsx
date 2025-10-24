'use client'

import { getToastStyle } from './toast-styles'
import { useToastContext } from './ToastContext'

/**
 * Toast Container
 *
 * daisyUI の Toast を表示するコンテナ
 * layout.tsx に配置して使用
 *
 * @returns Toast コンテナ要素（Toast がない場合は null）
 */
export function ToastContainer(): React.ReactElement | null {
  const { toasts, removeToast } = useToastContext()

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="toast toast-top toast-center z-50">
      {toasts.map((toast) => (
        <div key={toast.id} className={`alert ${getToastStyle(toast.type)}`}>
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
