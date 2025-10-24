import type { ComponentPropsWithoutRef, ReactElement } from 'react'

/**
 * バッジのバリアント（daisyUI のスタイル）
 */
type BadgeVariant =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'ghost'

/**
 * バッジのサイズ
 */
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg'

/**
 * Badgeコンポーネントのプロパティ
 */
export type BadgeProps = ComponentPropsWithoutRef<'span'> & {
  /** バッジのバリアント（daisyUI スタイル） */
  variant?: BadgeVariant
  /** バッジのサイズ */
  size?: BadgeSize
  /** アウトラインスタイル */
  outline?: boolean
}

/**
 * 汎用バッジコンポーネント
 *
 * daisyUIのバッジスタイルをラップした純粋なUIコンポーネント。
 * タグ、ラベル、ステータス表示などに使用。
 */
export function Badge({
  variant,
  size,
  outline = false,
  className = '',
  children,
  ...props
}: BadgeProps): ReactElement {
  // daisyUI クラスのマッピング（静的解析用）
  const variantMap: Record<BadgeVariant, string> = {
    neutral: 'badge-neutral',
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
    info: 'badge-info',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    ghost: 'badge-ghost',
  }

  const sizeMap: Record<BadgeSize, string> = {
    xs: 'badge-xs',
    sm: 'badge-sm',
    md: '',
    lg: 'badge-lg',
  }

  // クラスの取得
  const variantClass = variant ? variantMap[variant] : ''
  const sizeClass = size ? sizeMap[size] : ''
  const outlineClass = outline ? 'badge-outline' : ''

  const classes = ['badge', variantClass, sizeClass, outlineClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  )
}
