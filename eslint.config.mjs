import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { FlatCompat } from '@eslint/eslintrc'
import importPlugin from 'eslint-plugin-import'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  {
    languageOptions: {
      parser: (await import('@typescript-eslint/parser')).default,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      // 【必須】基本的な型安全性
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // 【推奨】厳格な型チェック
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',

      // 【オプション】コード品質向上
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/no-unnecessary-condition': 'warn',

      // モダンな構文推奨
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      // インポート管理
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js組み込みモジュール
            'external', // npmパッケージ
            'internal', // プロジェクト内の絶対パス
            'parent', // 親ディレクトリ
            'sibling', // 同階層
            'index', // index.ts
            'object',
            'type', // 型インポート
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-cycle': ['error', { maxDepth: 10 }],

      // 命名規則
      '@typescript-eslint/naming-convention': [
        'error',
        // 変数・関数: camelCase
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          filter: {
            regex: '^(__filename|__dirname)$',
            match: false,
          },
        },
        // ESM互換性のための例外: __filename, __dirname
        {
          selector: 'variable',
          format: null,
          filter: {
            regex: '^(__filename|__dirname)$',
            match: true,
          },
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'], // Reactコンポーネント対応
          filter: {
            regex: '^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)$',
            match: false,
          },
        },
        // Next.js Route Handlers: HTTPメソッド名（大文字）を許可
        {
          selector: 'function',
          format: null,
          filter: {
            regex: '^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)$',
            match: true,
          },
        },
        // React Component: PascalCase
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        // 型・インターフェース・クラス: PascalCase
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        // パラメータ: camelCase
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
      ],

      // 関数戻り値型の明示
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true, // 式の場合は省略可
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
        },
      ],
    },
  },
]

export default eslintConfig
