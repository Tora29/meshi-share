import type { ComponentPropsWithoutRef, ReactElement } from 'react'

/**
 * インプットのサイズ
 */
type InputSize = 'xs' | 'sm' | 'md' | 'lg'

/**
 * Inputコンポーネントのプロパティ
 */
export type InputProps = ComponentPropsWithoutRef<'input'> & {
  /** インプットのサイズ */
  size?: InputSize
  /** ボーダースタイル（デフォルト: true） */
  bordered?: boolean
  /** エラー状態（デフォルト: false） */
  error?: boolean
}

/**
 * 汎用インプットコンポーネント
 *
 * daisyUIのインプットスタイルをラップした純粋なUIコンポーネント。
 * React Hook Form との統合を想定した設計。
 */
export function Input({
  size,
  bordered,
  error,
  className = '',
  ...props
}: InputProps): ReactElement {
  // daisyUI クラスのマッピング（静的解析用）
  const sizeMap: Record<InputSize, string> = {
    xs: 'input-xs',
    sm: 'input-sm',
    md: '',
    lg: 'input-lg',
  }

  // クラスの取得
  const sizeClass = size ? sizeMap[size] : ''
  const borderedClass = bordered !== false ? 'input-bordered' : ''
  const errorClass = error === true ? 'input-error' : ''
  const primaryClass = error !== true ? 'input-primary' : '' // エラー時以外はprimary

  const classes = [
    'input',
    sizeClass,
    borderedClass,
    errorClass,
    primaryClass,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <input className={classes} {...props} />
}
