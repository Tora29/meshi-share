import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react'

/**
 * Cardコンポーネントのプロパティ
 */
export type CardProps = ComponentPropsWithoutRef<'div'> & {
  /** カードの内容 */
  children: ReactNode
  /** ボーダー付きスタイル */
  bordered?: boolean
  /** コンパクトなパディング */
  compact?: boolean
  /** サイドレイアウト */
  side?: boolean
}

/**
 * CardBodyコンポーネントのプロパティ
 */
export type CardBodyProps = ComponentPropsWithoutRef<'div'> & {
  /** 内容 */
  children: ReactNode
}

/**
 * CardTitleコンポーネントのプロパティ
 */
export type CardTitleProps = ComponentPropsWithoutRef<'h2'> & {
  /** タイトルテキスト */
  children: ReactNode
  /** テキスト配置 */
  align?: 'start' | 'center' | 'end'
  centered?: boolean
}

/**
 * CardActionsコンポーネントのプロパティ
 */
export type CardActionsProps = ComponentPropsWithoutRef<'div'> & {
  /** アクション（ボタンなど） */
  children: ReactNode
  /** 中央配置 */
  justify?: 'start' | 'center' | 'end'
}

/**
 * 汎用カードコンポーネント
 *
 * daisyUIのカードスタイルをラップした純粋なUIコンポーネント。
 * ビジネスロジックは含まず、見た目とHTML属性の管理のみを担当。
 */
export function Card({
  children,
  bordered = false,
  compact = false,
  side = false,
  className = '',
  ...props
}: CardProps): ReactElement {
  const borderedClass = bordered ? 'card-bordered' : ''
  const compactClass = compact ? 'card-compact' : ''
  const sideClass = side ? 'card-side' : ''

  const classes = ['card', borderedClass, compactClass, sideClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

/**
 * カードボディコンポーネント
 *
 * カードのメインコンテンツ領域を表示します。
 */
export function CardBody({
  children,
  className = '',
  ...props
}: CardBodyProps): ReactElement {
  const classes = ['card-body', className].filter(Boolean).join(' ')

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

/**
 * カードのタイトル部分を表示
 */
export function CardTitle({
  children,
  className = '',
  centered = false,
  align = centered ? 'center' : 'start',
  ...props
}: CardTitleProps): ReactElement {
  // テキスト配置のクラスを適用
  // 中央・右寄せの場合はcard-titleクラスより強いスタイルを適用
  const alignClass =
    align === 'center'
      ? 'text-center justify-center w-full [&]:text-center'
      : align === 'end'
        ? 'text-right justify-end w-full [&]:text-right'
        : ''

  const classes = ['card-title', alignClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <h2 className={classes} {...props}>
      {children}
    </h2>
  )
}

/**
 * カードアクションコンポーネント
 *
 * カードのアクションエリア（ボタンなど）を表示します。
 */
export function CardActions({
  children,
  justify = 'start',
  className = '',
  ...props
}: CardActionsProps): ReactElement {
  const justifyClass = `justify-${justify}`
  const classes = ['card-actions', justifyClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
