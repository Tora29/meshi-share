import { redirect } from 'next/navigation'

import {
  getGenreMasters,
  getPriceRangeMasters,
} from '@/app/places/_queries/get-place-masters'
import { createClient } from '@/lib/supabase/server'

import { PlacePostForm } from './components/PlacePostForm'

import type { ReactElement } from 'react'

/**
 * 店舗投稿ページ
 *
 * 認証済みユーザーのみがアクセスでき、新しい飯どころを投稿できます。
 */
export default async function PlaceNewPage(): Promise<ReactElement> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // 未認証の場合はログインページへリダイレクト
  if (!user || error) {
    redirect('/login')
  }

  // マスタデータを取得
  const [genres, priceRanges] = await Promise.all([
    getGenreMasters(),
    getPriceRangeMasters(),
  ])

  return (
    <div className="bg-base-200 min-h-screen">
      {/* ヘッダー */}
      <header className="bg-base-100 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-primary text-2xl font-bold">Meshi Share</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <h2 className="text-primary mb-6 text-3xl font-bold">飯どころを投稿</h2>
        <div className="bg-base-100 rounded-lg p-6 shadow-xl">
          <PlacePostForm genres={genres} priceRanges={priceRanges} />
        </div>
      </main>
    </div>
  )
}
