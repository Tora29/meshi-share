/**
 * Toast設定の型
 */
export type ToastConfig = {
  /** Toastの種類 */
  type: string
  /** daisyUIのalertクラス */
  style: string
  /** 表示時間（ミリ秒）。Infinityで自動で消えない */
  duration: number
}

/**
 * デフォルトのToast設定
 *
 * 新しいToastタイプを追加する場合は、この配列に追加してください。
 * 既存のコードを修正する必要はありません。
 */
export const DEFAULT_TOAST_CONFIGS: ToastConfig[] = [
  {
    type: 'success',
    style: 'alert-success',
    duration: 3000, // 3秒
  },
  {
    type: 'error',
    style: 'alert-error',
    duration: 5000, // エラーは長めに表示
  },
  {
    type: 'info',
    style: 'alert-info',
    duration: 3000,
  },
  {
    type: 'warning',
    style: 'alert-warning',
    duration: 4000, // 警告はやや長めに表示
  },
  // 将来の拡張用コメント：
  // {
  //   type: 'loading',
  //   style: 'alert-neutral',
  //   duration: Infinity, // ローディング中は自動で消えない
  // },
]

/**
 * Toast設定のマップを作成
 *
 * @param configs - Toast設定の配列
 * @returns Toast設定のMap（key: type, value: config）
 */
export function createToastConfigMap(
  configs: ToastConfig[]
): Map<string, ToastConfig> {
  return new Map(configs.map((config) => [config.type, config]))
}
