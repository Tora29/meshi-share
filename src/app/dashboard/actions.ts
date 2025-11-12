'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'

/**
 * ログアウト処理
 *
 * ユーザーをログアウトさせ、ログインページにリダイレクトします。
 *
 * @throws ログアウト処理に失敗した場合
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient()

  try {
    // ログアウト前にユーザー情報を取得
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // ログアウト実行
    await supabase.auth.signOut()

    // ログアウト成功ログ
    if (user) {
      logger.info('User logged out successfully', undefined, {
        userId: user.id,
        userName:
          (user.user_metadata.full_name as string | undefined) ?? 'Unknown',
        action: 'logout',
        result: 'success',
      })
    }
  } catch (error) {
    // ログアウト失敗ログ
    logger.error('Logout failed', undefined, {
      action: 'logout',
      result: 'error',
      metadata: {
        errorMessage: error instanceof Error ? error.message : String(error),
      },
    })
    throw error
  }

  // redirect()はtry-catchの外で実行（Next.jsは内部的に例外を使用するため）
  revalidatePath('/', 'layout')
  redirect('/login')
}
