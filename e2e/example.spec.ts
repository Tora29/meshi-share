import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');

  // ページが正しく読み込まれることを確認
  await expect(page).toHaveTitle(/MeshiShare/i);
});
