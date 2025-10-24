import type { ComponentPropsWithoutRef, ReactElement } from 'react'

/**
 * テキストエリアのサイズ
 */
type TextareaSize = 'xs' | 'sm' | 'md' | 'lg'

/**
 * Textareaコンポーネントのプロパティ
 */
export type TextareaProps = ComponentPropsWithoutRef<'textarea'> & {
  /** テキストエリアのサイズ */
  size?: TextareaSize
  /** ボーダースタイル */
  bordered?: boolean
  /** エラー状態 */
  error?: boolean
}

/**
 * 汎用テキストエリアコンポーネント
 *
 * daisyUIのテキストエリアスタイルをラップした純粋なUIコンポーネント。
 * React Hook Form との統合を想定した設計。
 */
export function Textarea({
  size,
  bordered = true,
  error = false,
  className = '',
  ...props
}: TextareaProps): ReactElement {
  // daisyUI クラスのマッピング（静的解析用）
  const sizeMap: Record<TextareaSize, string> = {
    xs: 'textarea-xs',
    sm: 'textarea-sm',
    md: '',
    lg: 'textarea-lg',
  }

  // クラスの取得
  const sizeClass = size ? sizeMap[size] : ''
  const borderedClass = bordered ? 'textarea-bordered' : ''
  const errorClass = error ? 'textarea-error' : ''
  const primaryClass = !error ? 'textarea-primary' : '' // エラー時以外はprimary

  const classes = [
    'textarea',
    sizeClass,
    borderedClass,
    errorClass,
    primaryClass,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <textarea className={classes} {...props} />
}
