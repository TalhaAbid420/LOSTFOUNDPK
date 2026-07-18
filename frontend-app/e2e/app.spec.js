import { test, expect } from '@playwright/test';

const BACKEND = 'http://localhost:8000';
const UNIQUE = Date.now();

// ─── Home Page ────────────────────────────────────────────────────────

test.describe('Home Page', () => {
  test('loads and displays hero content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=LostFoundPK').first()).toBeVisible();
    await expect(page.locator('text=Reunite with what you')).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Browse');
    await expect(page).toHaveURL(/\/browse/);

    await page.click('text=Report');
    await expect(page).toHaveURL(/\/report/);
  });
});

// ─── Signup Flow ──────────────────────────────────────────────────────

test.describe('Signup', () => {
  test('signup page renders without social buttons', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('text=Create your account')).toBeVisible();
    await expect(page.locator('text=Create Account')).toBeVisible();
    await expect(page.locator('button:has-text("Google")')).toHaveCount(0);
    await expect(page.locator('button:has-text("Phone")')).toHaveCount(0);
  });

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/signup');
    await page.click('button:has-text("Create Account")');
    await expect(page.locator('text=Full name is required')).toBeVisible();
  });

  test('successfully signs up a new user and redirects to login', async ({ page }) => {
    const email = `e2e-user-${UNIQUE}@test.com`;
    await page.goto('/signup');

    await page.fill('#fullName', 'E2E Test User');
    await page.fill('#email', email);
    await page.fill('#password', 'SecureP@ss123');
    await page.check('input[type="checkbox"]');
    await page.click('button:has-text("Create Account")');

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    await expect(page.locator('text=Account created')).toBeVisible();
  });
});

// ─── Login Flow ───────────────────────────────────────────────────────

test.describe('Login', () => {
  const email = `e2e-login-${UNIQUE}@test.com`;
  const password = 'TestPass123!';

  test.beforeAll(async () => {
    // Create a user to login with
    await fetch(`${BACKEND}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Login Test', email, password }),
    });
  });

  test('login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=Welcome back')).toBeVisible();
    await expect(page.locator('button:has-text("Sign in")')).toBeVisible();
  });

  test('shows error for wrong credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', email);
    await page.fill('#password', 'WrongPassword123');
    await page.click('button:has-text("Sign in")');
    await expect(page.locator('text=Incorrect email or password')).toBeVisible({ timeout: 10000 });
  });

  test('logs in successfully and redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('button:has-text("Sign in")');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });
});

// ─── Browse Page ──────────────────────────────────────────────────────

test.describe('Browse', () => {
  test('loads and shows filter bar', async ({ page }) => {
    await page.goto('/browse');
    await expect(page.locator('text=Find what')).toBeVisible();
    await expect(page.locator('text=All Categories')).toBeVisible();
    await expect(page.locator('text=All Cities')).toBeVisible();
  });

  test('category filters use correct backend values', async ({ page }) => {
    await page.goto('/browse');
    await expect(page.locator('button:has-text("CNIC")')).toBeVisible();
    await expect(page.locator('button:has-text("Wallet")')).toBeVisible();
    await expect(page.locator('button:has-text("Phone")')).toBeVisible();
    await expect(page.locator('button:has-text("Pet")')).toBeVisible();
    await expect(page.locator('button:has-text("Other")')).toBeVisible();
  });

  test('search input works', async ({ page }) => {
    await page.goto('/browse');
    await page.fill('input[placeholder*="Black leather wallet"]', 'phone');
    await expect(page.locator('input[placeholder*="Black leather wallet"]')).toHaveValue('phone');
  });
});

// ─── Report Item ──────────────────────────────────────────────────────

test.describe('Report Item', () => {
  test('renders report form with all steps', async ({ page }) => {
    await page.goto('/report');
    await expect(page.locator('text=Step 1: Select Category')).toBeVisible();
    await expect(page.locator('text=Step 2: Item Details')).toBeVisible();
    await expect(page.locator('text=Step 3: Visual Evidence')).toBeVisible();
  });

  test('shows validation error for empty category', async ({ page }) => {
    await page.goto('/report');
    await page.fill('textarea', 'This is a valid description with enough chars');
    await page.selectOption('select', 'Karachi');
    await page.fill('input[type="date"]', '2026-07-15');
    await page.click('button:has-text("Post Report")');
    await expect(page.locator('text=Please select a category')).toBeVisible({ timeout: 5000 });
  });

  test('shows validation error for short description', async ({ page }) => {
    await page.goto('/report');
    await page.click('button:has-text("Phone")');
    await page.fill('textarea', 'Short');
    await page.selectOption('select', 'Karachi');
    await page.fill('input[type="date"]', '2026-07-15');
    await page.click('button:has-text("Post Report")');
    await expect(page.locator('text=at least 10 characters')).toBeVisible({ timeout: 5000 });
  });
});

// ─── Protected Routes ─────────────────────────────────────────────────

test.describe('Auth Guard', () => {
  test('redirects unauthenticated user to login from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});

// ─── Page Smoke Tests ─────────────────────────────────────────────────

test.describe('Page Loads', () => {
  const pages = ['/', '/login', '/signup', '/browse', '/report', '/forgot-password'];

  for (const path of pages) {
    test(`${path} loads without console errors`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (err) => errors.push(err.message));
      await page.goto(path, { waitUntil: 'networkidle' });
      expect(errors).toEqual([]);
    });
  }
});
