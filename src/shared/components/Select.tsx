import type { ComponentPropsWithoutRef, ReactElement } from 'react'

/**
 * セレクトのサイズ
 */
type SelectSize = 'xs' | 'sm' | 'md' | 'lg'

/**
 * Selectコンポーネントのプロパティ
 */
export type SelectProps = ComponentPropsWithoutRef<'select'> & {
  /** セレクトのサイズ */
  size?: SelectSize
  /** ボーダースタイル（デフォルト: true） */
  bordered?: boolean
  /** エラー状態（デフォルト: false） */
  error?: boolean
}

/**
 * 汎用セレクトコンポーネント
 *
 * daisyUIのセレクトスタイルをラップした純粋なUIコンポーネント。
 * React Hook Form との統合を想定した設計。
 */
export function Select({
  size,
  bordered,
  error,
  className = '',
  children,
  ...props
}: SelectProps): ReactElement {
  // daisyUI クラスのマッピング（静的解析用）
  const sizeMap: Record<SelectSize, string> = {
    xs: 'select-xs',
    sm: 'select-sm',
    md: '',
    lg: 'select-lg',
  }

  // クラスの取得
  const sizeClass = size ? sizeMap[size] : ''
  const borderedClass = bordered !== false ? 'select-bordered' : ''
  const errorClass = error === true ? 'select-error' : ''

  const classes = ['select', sizeClass, borderedClass, errorClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <select className={classes} {...props}>
      {children}
    </select>
  )
}
