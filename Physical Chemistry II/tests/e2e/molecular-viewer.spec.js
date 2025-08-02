import { test, expect } from '@playwright/test';

test.describe('Molecular Dynamics Viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to load
    await page.waitForSelector('canvas', { timeout: 10000 });
  });

  test('should load the application successfully', async ({ page }) => {
    // Check if main components are visible
    await expect(page.locator('h1')).toContainText('Molecular Dynamics Visualization');
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('select')).toBeVisible(); // Reaction selector
  });

  test('should display SN2 reaction by default', async ({ page }) => {
    // Check if SN2 is selected by default
    const selector = page.locator('select');
    await expect(selector).toHaveValue('sn2');
    
    // Check if step information is displayed
    await expect(page.locator('.step-info')).toBeVisible();
    await expect(page.locator('.step-info')).toContainText('Step 1');
  });

  test('should switch between reactions', async ({ page }) => {
    // Switch to E2 reaction
    await page.selectOption('select', 'e2');
    
    // Wait for the scene to update
    await page.waitForTimeout(1000);
    
    // Check if step information updates
    await expect(page.locator('.step-info')).toContainText('Step 1');
    
    // Switch back to SN2
    await page.selectOption('select', 'sn2');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('.step-info')).toContainText('Step 1');
  });

  test('should control animation playback', async ({ page }) => {
    // Find the play button
    const playButton = page.locator('button').filter({ hasText: /Play|Pause/ });
    
    // Initially should show "Play"
    await expect(playButton).toContainText('Play');
    
    // Click play
    await playButton.click();
    
    // Should change to "Pause"
    await expect(playButton).toContainText('Pause');
    
    // Click pause
    await playButton.click();
    
    // Should change back to "Play"
    await expect(playButton).toContainText('Play');
  });

  test('should navigate through steps manually', async ({ page }) => {
    // Get all step buttons
    const stepButtons = page.locator('button').filter({ hasText: /Step \d+/ });
    
    // Should have multiple step buttons
    await expect(stepButtons).toHaveCount(4); // SN2 has 4 steps
    
    // Click on Step 2
    await stepButtons.nth(1).click();
    
    // Check if step info updates
    await expect(page.locator('.step-info')).toContainText('Step 2');
    
    // Click on Step 3
    await stepButtons.nth(2).click();
    
    // Check if step info updates
    await expect(page.locator('.step-info')).toContainText('Step 3');
  });

  test('should toggle electron visibility', async ({ page }) => {
    // Find the electron toggle button
    const electronButton = page.locator('button').filter({ hasText: /Show Electrons|Hide Electrons/ });
    
    // Initially should show "Show Electrons"
    await expect(electronButton).toContainText('Show Electrons');
    
    // Click to show electrons
    await electronButton.click();
    
    // Should change to "Hide Electrons"
    await expect(electronButton).toContainText('Hide Electrons');
    
    // Click to hide electrons
    await electronButton.click();
    
    // Should change back to "Show Electrons"
    await expect(electronButton).toContainText('Show Electrons');
  });

  test('should control zoom functionality', async ({ page }) => {
    // Find zoom controls
    const zoomInButton = page.locator('button').filter({ hasText: '+' });
    const zoomOutButton = page.locator('button').filter({ hasText: '-' });
    const zoomLevel = page.locator('span').filter({ hasText: /\d+%/ });
    
    // Check initial zoom level
    await expect(zoomLevel).toContainText('100%');
    
    // Test zoom in
    await zoomInButton.click();
    await expect(zoomLevel).toContainText('110%');
    
    // Test zoom out
    await zoomOutButton.click();
    await expect(zoomLevel).toContainText('100%');
    
    // Test multiple zoom operations
    await zoomOutButton.click();
    await expect(zoomLevel).toContainText('90%');
  });

  test('should display reaction information', async ({ page }) => {
    // Check if reaction description is visible
    await expect(page.locator('.reaction-description')).toBeVisible();
    
    // Switch reactions and check if description updates
    await page.selectOption('select', 'e2');
    await page.waitForTimeout(500);
    
    await expect(page.locator('.reaction-description')).toBeVisible();
    await expect(page.locator('.reaction-description')).toContainText('elimination');
  });

  test('should handle complete SN2 reaction workflow', async ({ page }) => {
    // Ensure SN2 is selected
    await page.selectOption('select', 'sn2');
    
    // Show electrons
    const electronButton = page.locator('button').filter({ hasText: /Show Electrons/ });
    await electronButton.click();
    
    // Start animation
    const playButton = page.locator('button').filter({ hasText: 'Play' });
    await playButton.click();
    
    // Wait for animation to progress
    await page.waitForTimeout(2000);
    
    // Pause animation
    await page.locator('button').filter({ hasText: 'Pause' }).click();
    
    // Navigate to final step
    const stepButtons = page.locator('button').filter({ hasText: /Step \d+/ });
    await stepButtons.last().click();
    
    // Verify we're at the final step
    await expect(page.locator('.step-info')).toContainText('Step 4');
    
    // Test zoom during final step
    const zoomInButton = page.locator('button').filter({ hasText: '+' });
    await zoomInButton.click();
    
    const zoomLevel = page.locator('span').filter({ hasText: /\d+%/ });
    await expect(zoomLevel).toContainText('110%');
  });

  test('should handle complete E2 reaction workflow', async ({ page }) => {
    // Switch to E2 reaction
    await page.selectOption('select', 'e2');
    await page.waitForTimeout(1000);
    
    // Show electrons
    const electronButton = page.locator('button').filter({ hasText: /Show Electrons/ });
    await electronButton.click();
    
    // Navigate through all steps
    const stepButtons = page.locator('button').filter({ hasText: /Step \d+/ });
    const stepCount = await stepButtons.count();
    
    for (let i = 0; i < stepCount; i++) {
      await stepButtons.nth(i).click();
      await page.waitForTimeout(500);
      await expect(page.locator('.step-info')).toContainText(`Step ${i + 1}`);
    }
    
    // Test animation from final step
    const playButton = page.locator('button').filter({ hasText: 'Play' });
    await playButton.click();
    
    await page.waitForTimeout(1000);
    
    // Pause and verify
    await page.locator('button').filter({ hasText: 'Pause' }).click();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if main components are still visible and functional
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
    
    // Test basic functionality on mobile
    const playButton = page.locator('button').filter({ hasText: /Play/ });
    await playButton.click();
    await expect(page.locator('button').filter({ hasText: /Pause/ })).toBeVisible();
    
    // Test electron toggle on mobile
    const electronButton = page.locator('button').filter({ hasText: /Show Electrons/ });
    await electronButton.click();
    await expect(page.locator('button').filter({ hasText: /Hide Electrons/ })).toBeVisible();
  });

  test('should handle rapid user interactions', async ({ page }) => {
    // Rapid reaction switching
    for (let i = 0; i < 3; i++) {
      await page.selectOption('select', 'e2');
      await page.waitForTimeout(100);
      await page.selectOption('select', 'sn2');
      await page.waitForTimeout(100);
    }
    
    // Rapid step navigation
    const stepButtons = page.locator('button').filter({ hasText: /Step \d+/ });
    for (let i = 0; i < 3; i++) {
      await stepButtons.nth(1).click();
      await stepButtons.nth(2).click();
      await stepButtons.nth(0).click();
    }
    
    // Rapid zoom operations
    const zoomInButton = page.locator('button').filter({ hasText: '+' });
    const zoomOutButton = page.locator('button').filter({ hasText: '-' });
    
    for (let i = 0; i < 5; i++) {
      await zoomInButton.click();
      await zoomOutButton.click();
    }
    
    // Verify app is still functional
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('.step-info')).toBeVisible();
  });
});