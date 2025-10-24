import Image from 'next/image'
import { redirect } from 'next/navigation'
import { IoRestaurant, IoHeart, IoChatbubbles } from 'react-icons/io5'

import { createClient } from '@/lib/supabase/server'
import { Button } from '@/shared/components/Button'
import { Card, CardBody, CardTitle } from '@/shared/components/Card'

import { signOut } from './actions'

import type { ReactElement } from 'react'

/**
 * ダッシュボードページ
 *
 * ログイン後のメインページ。
 * ユーザー情報、統計情報、最近の活動を表示します。
 */
export default async function DashboardPage(): Promise<ReactElement> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // 未認証の場合はログインページへリダイレクト
  if (!user || error) {
    redirect('/login')
  }

  // ユーザー情報を取得
  const userName =
    (user.user_metadata.full_name as string | undefined) ??
    user.email?.split('@')[0] ??
    'Unknown'
  const userEmail = user.email ?? ''
  const avatarUrl = user.user_metadata.avatar_url as string | undefined

  return (
    <div className="bg-base-200 min-h-screen">
      {/* ヘッダー */}
      <header className="bg-base-100 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-primary text-2xl font-bold">Meshi Share</h1>
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="sm">
                ログアウト
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        {/* ユーザー情報セクション */}
        <Card className="bg-base-100 mb-8 shadow-xl">
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <div className="avatar">
                  <div className="w-16 rounded-full">
                    <Image
                      src={avatarUrl}
                      alt={userName}
                      width={64}
                      height={64}
                    />
                  </div>
                </div>
              ) : (
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content w-16 rounded-full">
                    <span className="text-2xl">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold">{userName}</h2>
                <p className="text-base-content/70">{userEmail}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 統計情報セクション */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {/* 投稿数 */}
          <Card className="bg-base-100 shadow-xl">
            <CardBody className="items-center p-6 text-center">
              <IoRestaurant className="text-primary mb-2 h-12 w-12" />
              <CardTitle>投稿した飯どころ</CardTitle>
              <p className="text-4xl font-bold">0</p>
              <p className="text-base-content/70 text-sm">件</p>
            </CardBody>
          </Card>

          {/* レビュー数 */}
          <Card className="bg-base-100 shadow-xl">
            <CardBody className="items-center p-6 text-center">
              <IoChatbubbles className="text-secondary mb-2 h-12 w-12" />
              <CardTitle>書いたレビュー</CardTitle>
              <p className="text-4xl font-bold">0</p>
              <p className="text-base-content/70 text-sm">件</p>
            </CardBody>
          </Card>

          {/* お気に入り数 */}
          <Card className="bg-base-100 shadow-xl">
            <CardBody className="items-center p-6 text-center">
              <IoHeart className="text-accent mb-2 h-12 w-12" />
              <CardTitle>お気に入り</CardTitle>
              <p className="text-4xl font-bold">0</p>
              <p className="text-base-content/70 text-sm">件</p>
            </CardBody>
          </Card>
        </div>

        {/* 最近の活動セクション */}
        <Card className="bg-base-100 shadow-xl">
          <CardBody className="p-6">
            <CardTitle className="mb-4">最近の活動</CardTitle>
            <div className="text-base-content/70 py-8 text-center">
              <p>まだ活動がありません</p>
              <p className="mt-2 text-sm">
                飯どころを投稿して、レビューを書いてみましょう！
              </p>
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  )
}
