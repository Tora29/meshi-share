import { DEFAULT_TOAST_CONFIGS } from './ToastConfig'

/**
 * Toastタイプごとのスタイル設定
 *
 * @deprecated 動的なToast設定を使用するため、この定数は非推奨です。
 * ToastConfig から取得してください。
 */
export const TOAST_STYLES = DEFAULT_TOAST_CONFIGS.reduce(
  (acc, config) => {
    acc[config.type] = config.style
    return acc
  },
  {} as Record<string, string>
)

/**
 * 指定されたToastタイプのスタイルを取得
 *
 * @param type - Toastタイプ
 * @returns daisyUI alertクラス（デフォルト: 'alert-info'）
 */
export function getToastStyle(type: string): string {
  return TOAST_STYLES[type] ?? 'alert-info'
}
