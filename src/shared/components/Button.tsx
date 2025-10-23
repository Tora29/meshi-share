import type { ComponentPropsWithoutRef, ReactElement } from 'react'

/**
 * ボタンのバリアント（daisyUI のスタイル）
 */
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'ghost'
  | 'link'

/**
 * ボタンのサイズ
 */
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

/**
 * Buttonコンポーネントのプロパティ
 */
export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  /** ボタンのバリアント（daisyUI スタイル） */
  variant?: ButtonVariant
  /** ボタンのサイズ */
  size?: ButtonSize
  /** アウトラインスタイル */
  outline?: boolean
  /** ワイド（幅いっぱい） */
  wide?: boolean
  /** ブロック（幅100%） */
  block?: boolean
  /** ローディング状態 */
  loading?: boolean
}

/**
 * 汎用ボタンコンポーネント
 *
 * daisyUIのボタンスタイルをラップした純粋なUIコンポーネント。
 * ビジネスロジックは含まず、見た目とHTML属性の管理のみを担当。
 */
export function Button({
  variant,
  size,
  outline = false,
  wide = false,
  block = false,
  loading = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps): ReactElement {
  // daisyUI クラスの組み立て
  const variantClass = variant ? `btn-${variant}` : ''
  const sizeClass = size ? `btn-${size}` : ''
  const outlineClass = outline ? 'btn-outline' : ''
  const wideClass = wide ? 'btn-wide' : ''
  const blockClass = block ? 'btn-block' : ''
  const loadingClass = loading ? 'loading' : ''

  const classes = [
    'btn',
    variantClass,
    sizeClass,
    outlineClass,
    wideClass,
    blockClass,
    loadingClass,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classes}
      disabled={Boolean(disabled) || loading}
      {...props}
    >
      {children}
    </button>
  )
}
