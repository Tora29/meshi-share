/**
 * Place（飯どころ）機能のエラーメッセージ
 *
 * 店舗投稿・検索・編集に関するエラーメッセージを一元管理します。
 */

/**
 * バリデーションエラーメッセージ
 */
export const VALIDATION_ERROR_MESSAGES = {
  // Google Maps URL関連
  MAP_URL_REQUIRED: 'Google Maps URLを入力してください',
  MAP_URL_INVALID: '有効なURLを入力してください',
  MAP_URL_NOT_GOOGLE_MAPS: 'Google Maps のURLを入力してください',

  // 基本情報
  PLACE_ID_REQUIRED: 'Place IDが必要です',
  NAME_REQUIRED: '店舗名を入力してください',
  ADDRESS_REQUIRED: '住所が必要です',

  // 価格帯
  PRICE_RANGE_INVALID: '価格帯は整数で選択してください',
} as const

/**
 * 検索エラーメッセージ
 */
export const SEARCH_ERROR_MESSAGES = {
  /** 検索キーワード未入力 */
  QUERY_REQUIRED: '検索キーワードを入力してください',
  /** 検索フィールドの必須エラー */
  SEARCH_REQUIRED: '店舗の検索は必須です',
  /** 検索フィールドのプレースホルダー */
  INPUT_PLACEHOLDER: '店舗名またはGoogle Maps URLを入力してください',
  /** 検索失敗 */
  SEARCH_FAILED: '検索に失敗しました',
} as const

/**
 * 作成・更新エラーメッセージ
 */
export const MUTATION_ERROR_MESSAGES = {
  /** 認証エラー */
  AUTH_REQUIRED: '認証エラー: ログインしてください',
  /** バリデーションエラー */
  VALIDATION_FAILED: 'バリデーションエラー',
  /** 重複エラー */
  PLACE_ALREADY_EXISTS: 'この店舗は既に登録されています',
  /** DB保存失敗 */
  CREATE_FAILED: 'データベースエラー: 店舗の保存に失敗しました',
  /** 予期しないエラー */
  UNEXPECTED: '予期しないエラーが発生しました',
} as const

/**
 * 画像アップロードエラーメッセージ
 */
export const IMAGE_ERROR_MESSAGES = {
  /** ファイルサイズ超過 */
  SIZE_EXCEEDED: 'ファイルサイズは5MB以下にしてください',
  /** ファイル形式エラー */
  TYPE_INVALID: 'JPEG, PNG, WebP形式の画像のみアップロードできます',
  /** アップロード失敗 */
  UPLOAD_FAILED: '画像のアップロードに失敗しました',
  /** 削除失敗 */
  DELETE_FAILED: '画像の削除に失敗しました',
  /** 枚数超過 */
  MAX_COUNT_EXCEEDED: '画像は最大5枚までアップロードできます',
} as const

/**
 * 全てのエラーメッセージをまとめたオブジェクト
 */
export const PLACE_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
  ...SEARCH_ERROR_MESSAGES,
  ...MUTATION_ERROR_MESSAGES,
  ...IMAGE_ERROR_MESSAGES,
} as const
