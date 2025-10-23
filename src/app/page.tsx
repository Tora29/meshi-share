import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export default async function Home(): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    // 未認証の場合はログインページへ
    redirect('/login')
  }

  // 認証済みの場合はダッシュボード（飯どころ一覧）へ
  // TODO: /dashboard または /restaurants ページを実装後に変更
  redirect('/login') // 一時的にloginへ（ダッシュボード未実装のため）
}
