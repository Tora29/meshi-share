import type { ComponentPropsWithoutRef, ReactElement } from 'react'

/**
 * ボタンの色バリアント（daisyUI カラー）
 * @see https://daisyui.com/components/button/#buttons-colors
 */
type ButtonColor =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'

/**
 * ボタンのサイズ
 * @see https://daisyui.com/components/button/#buttons-sizes
 */
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * ボタンの形状
 * @see https://daisyui.com/components/button/#buttons-shapes
 */
type ButtonShape = 'square' | 'circle'

/**
 * ボタンのスタイル修飾子
 * @see https://daisyui.com/components/button/
 */
type ButtonStyle = 'outline' | 'ghost' | 'link' | 'dash' | 'soft'

/**
 * Buttonコンポーネントのプロパティ
 */
export type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'style'> & {
  /** ボタンの色バリアント */
  color?: ButtonColor
  /** ボタンのサイズ */
  size?: ButtonSize
  /** ボタンの形状 */
  shape?: ButtonShape
  /** ボタンのスタイル修飾子 */
  style?: ButtonStyle
  /** ワイド（幅いっぱい） */
  wide?: boolean
  /** ブロック（幅100%） */
  block?: boolean
  /** アクティブ状態 */
  active?: boolean
  /** ローディング状態 */
  loading?: boolean
}

/**
 * 汎用ボタンコンポーネント
 *
 * daisyUIのボタンスタイルをラップした純粋なUIコンポーネント。
 * ビジネスロジックは含まず、見た目とHTML属性の管理のみを担当。
 *
 * @see https://daisyui.com/components/button/
 */
export function Button({
  color,
  size,
  shape,
  style: buttonStyle,
  wide = false,
  block = false,
  active = false,
  loading = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps): ReactElement {
  // daisyUI クラスのマッピング（静的解析用）
  const colorMap: Record<ButtonColor, string> = {
    neutral: 'btn-neutral',
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    info: 'btn-info',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error',
  }

  const sizeMap: Record<ButtonSize, string> = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
    xl: 'btn-xl',
  }

  const shapeMap: Record<ButtonShape, string> = {
    square: 'btn-square',
    circle: 'btn-circle',
  }

  const styleMap: Record<ButtonStyle, string> = {
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    link: 'btn-link',
    dash: 'btn-dash',
    soft: 'btn-soft',
  }

  // クラスの取得
  const colorClass = color ? colorMap[color] : ''
  const sizeClass = size ? sizeMap[size] : ''
  const shapeClass = shape ? shapeMap[shape] : ''
  const styleClass = buttonStyle ? styleMap[buttonStyle] : ''
  const wideClass = wide ? 'btn-wide' : ''
  const blockClass = block ? 'btn-block' : ''
  const activeClass = active ? 'btn-active' : ''
  const loadingClass = loading ? 'loading' : ''

  const classes = [
    'btn',
    colorClass,
    sizeClass,
    shapeClass,
    styleClass,
    wideClass,
    blockClass,
    activeClass,
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
