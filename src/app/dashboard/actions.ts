'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

/**
 * ログアウト処理
 *
 * ユーザーをログアウトさせ、ログインページにリダイレクトします。
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // キャッシュをクリアしてログインページへリダイレクト
  revalidatePath('/', 'layout')
  redirect('/login')
}
