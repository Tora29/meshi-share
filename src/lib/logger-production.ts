/**
 * 本番環境用のログ設定
 * LogDockがプライベートネットワークにある場合の代替案
 */

interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  userId?: string
  metadata?: Record<string, any>
}

class ProductionLogger {
  info(message: string, userId?: string, metadata?: Record<string, any>): void {
    this.log('info', message, userId, metadata)
  }

  warn(message: string, userId?: string, metadata?: Record<string, any>): void {
    this.log('warn', message, userId, metadata)
  }

  error(message: string, userId?: string, metadata?: Record<string, any>): void {
    this.log('error', message, userId, metadata)
  }

  debug(message: string, userId?: string, metadata?: Record<string, any>): void {
    if (process.env.NODE_ENV === 'development' || process.env.LOGDOCK_DEBUG) {
      this.log('debug', message, userId, metadata)
    }
  }

  private log(
    level: LogEntry['level'],
    message: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    const entry: LogEntry = {
      level,
      message,
      userId,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      },
    }

    // コンソールに出力（Vercelのログに記録される）
    if (level === 'error') {
      console.error('[ProductionLogger]', JSON.stringify(entry))
    } else if (level === 'warn') {
      console.warn('[ProductionLogger]', JSON.stringify(entry))
    } else {
      console.log('[ProductionLogger]', JSON.stringify(entry))
    }

    // 将来的にはここで外部サービスに送信
    // 例: Datadog, CloudWatch, Sentry, etc.
  }
}

export const productionLogger = new ProductionLogger()