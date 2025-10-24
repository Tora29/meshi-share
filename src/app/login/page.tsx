'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { IoAlertCircle } from 'react-icons/io5'

import { Button } from '@/shared/components/Button'
import {
  Card,
  CardActions,
  CardBody,
  CardTitle,
} from '@/shared/components/Card'
import loginImage from '@/shared/static/loginImage.png'

import { getAuthErrorMessage } from './_consts/errorMessages'
import { useAuth } from './_hooks/useAuth'

import type { ReactElement } from 'react'

/**
 * ログインページ内部コンポーネント
 */
function LoginPageContent(): ReactElement {
  const searchParams = useSearchParams()
  const { signIn, isLoading, error: authError } = useAuth()

  // URLパラメータのエラーとuseAuthのエラーを統合
  const errorMessage =
    getAuthErrorMessage(searchParams.get('error') ?? undefined) ?? authError

  return (
    <div className="bg-base-200 flex min-h-screen">
      {/* 左側: ログインフォーム (40%) */}
      <div className="flex flex-4 items-center justify-center">
        <Card className="bg-base-100 w-full max-w-md shadow-xl">
          <CardBody className="gap-6 p-8">
            <div className="space-y-2 text-center">
              <CardTitle centered className="text-primary text-3xl">
                Meshi Share
              </CardTitle>
              <p>社内飯どころ共有アプリ</p>
            </div>

            {errorMessage && (
              <div role="alert" className="alert alert-error">
                <IoAlertCircle className="h-6 w-6 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <CardActions className="w-full flex-col gap-3">
              <Button
                onClick={signIn}
                disabled={isLoading}
                color="primary"
                block
              >
                {isLoading ? (
                  'ログイン中...'
                ) : (
                  <>
                    <FcGoogle className="h-6 w-6 shrink-0" /> Googleでログイン
                  </>
                )}
              </Button>
            </CardActions>
          </CardBody>
        </Card>
      </div>

      {/* 右側: 画像 (60%) */}
      <div className="relative hidden flex-6 overflow-hidden lg:flex">
        <Image
          src={loginImage}
          alt="料理の画像"
          fill
          className="object-cover"
          priority
          sizes="60vw"
        />

        {/* ガラスエフェクトオーバーレイ */}
        <div className="absolute inset-0">
          {/* メインのガラスエフェクト */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />
        </div>
      </div>
    </div>
  )
}

/**
 * ログインページ
 *
 * 社員向けGoogle認証ログイン画面を提供します。
 * エラー処理はクエリパラメータで受け取ります。
 */
export default function LoginPage(): ReactElement {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}
