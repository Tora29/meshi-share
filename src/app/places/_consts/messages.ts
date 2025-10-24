/**
 * Place（飯どころ）機能の成功・情報メッセージ
 *
 * ユーザーへのフィードバックメッセージ（成功、情報、確認など）を一元管理します。
 */

/**
 * 検索関連のメッセージ
 */
export const SEARCH_MESSAGES = {
  /** 検索結果なし */
  NO_RESULTS: '該当する店舗が見つかりませんでした',
  /** 検索成功（件数付き） */
  RESULTS_FOUND: (count: number) => `${count}件の候補が見つかりました`,
} as const

/**
 * フォーム操作メッセージ
 */
export const FORM_MESSAGES = {
  /** 店舗情報の自動入力成功 */
  PLACE_INFO_AUTO_FILLED: '店舗情報を自動入力しました',
  /** フォームクリア */
  FORM_CLEARED: 'フォームをクリアしました',
} as const

/**
 * 投稿成功メッセージ
 */
export const SUBMISSION_MESSAGES = {
  /** 店舗投稿成功 */
  PLACE_CREATED: '店舗を投稿しました！',
  /** 店舗更新成功（将来用） */
  PLACE_UPDATED: '店舗情報を更新しました',
  /** 店舗削除成功（将来用） */
  PLACE_DELETED: '店舗を削除しました',
} as const

/**
 * 画像アップロードメッセージ
 */
export const IMAGE_MESSAGES = {
  /** 画像アップロード成功 */
  IMAGES_UPLOADED: (count: number) => `${count}枚の画像をアップロードしました`,
  /** 画像削除成功 */
  IMAGE_DELETED: '画像を削除しました',
} as const

/**
 * 全てのメッセージをまとめたオブジェクト
 */
export const PLACE_MESSAGES = {
  SEARCH: SEARCH_MESSAGES,
  FORM: FORM_MESSAGES,
  SUBMISSION: SUBMISSION_MESSAGES,
  IMAGE: IMAGE_MESSAGES,
} as const
