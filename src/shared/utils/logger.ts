/**
 * ロギングユーティリティ
 *
 * アプリケーション全体で統一されたログ出力を提供します。
 * 開発環境ではconsoleを使用し、本番環境では外部サービスへの送信を拡張可能です。
 */

import { serializeError } from './error'

/**
 * ログレベル
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

/**
 * ログコンテキスト（追加のメタデータ）
 */
export type LogContext = Record<string, unknown>

/**
 * ログエントリー
 */
export interface LogEntry {
  level: LogLevel
  message: string
  context?: LogContext
  timestamp: string
}

/**
 * 環境判定
 */
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'

/**
 * ログレベルの優先度
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

/**
 * 現在の最小ログレベル（これ以下は出力しない）
 * 環境変数で制御可能
 * テスト環境では全てのログを出力
 */
const MIN_LOG_LEVEL: LogLevel =
  (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel | undefined) ??
  (isTest ? 'debug' : isDevelopment ? 'debug' : 'info')

/**
 * ログを出力すべきか判定
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[MIN_LOG_LEVEL]
}

/**
 * コンソールにログを出力（開発環境用）
 */
function logToConsole(entry: LogEntry): void {
  const { level, message, context } = entry

  const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`
  const logMessage = `${prefix} ${message}`

  switch (level) {
    case 'debug':
      console.debug(logMessage, context ?? '')
      break
    case 'info':
      console.info(logMessage, context ?? '')
      break
    case 'warn':
      console.warn(logMessage, context ?? '')
      break
    case 'error':
      console.error(logMessage, context ?? '')
      break
  }
}

/**
 * 外部サービスにログを送信（本番環境用）
 * TODO: Sentry, Datadog, CloudWatch等との統合を実装
 */
function logToExternalService(entry: LogEntry): void {
  // 将来の実装箇所
  // 例: Sentryへの送信
  // if (level === 'error') {
  //   Sentry.captureException(context?.error, { extra: context })
  // }

  // 現在は何もしない（console出力は別途行われる）
  void entry
}

/**
 * ログエントリーを作成
 */
function createLogEntry(
  level: LogLevel,
  message: string,
  context?: LogContext
): LogEntry {
  return {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  }
}

/**
 * 内部ログ処理
 */
function log(level: LogLevel, message: string, context?: LogContext): void {
  if (!shouldLog(level)) {
    return
  }

  const entry = createLogEntry(level, message, context)

  // 開発環境・テスト環境では常にコンソール出力
  if (isDevelopment || isTest) {
    logToConsole(entry)
  }

  // 本番環境ではコンソール + 外部サービス
  if (isProduction) {
    logToConsole(entry)
    logToExternalService(entry)
  }
}

/**
 * ロガー
 */
export const logger = {
  /**
   * デバッグログ（開発時の詳細情報）
   */
  debug(message: string, context?: LogContext): void {
    log('debug', message, context)
  },

  /**
   * 情報ログ（一般的な情報）
   */
  info(message: string, context?: LogContext): void {
    log('info', message, context)
  },

  /**
   * 警告ログ（注意が必要だが致命的ではない）
   */
  warn(message: string, context?: LogContext): void {
    log('warn', message, context)
  },

  /**
   * エラーログ（エラー発生時）
   */
  error(message: string, error?: unknown, context?: LogContext): void {
    const errorInfo = error ? serializeError(error) : undefined
    log('error', message, {
      ...context,
      error: errorInfo,
    })
  },
}

/**
 * デフォルトエクスポート
 */
export default logger
