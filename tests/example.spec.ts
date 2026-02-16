import { test, expect } from "@playwright/test";

/**
 * Example E2E test file
 *
 * These tests verify the basic functionality of the site.
 * Add more tests as you build out features.
 */

test.describe("Homepage", () => {
  test("should load successfully", async ({ page }) => {
    // Navigate to homepage
    await page.goto("/");

    // Verify page loaded (check for any content)
    await expect(page.locator("body")).toBeVisible();
  });

  test("should have a title", async ({ page }) => {
    await page.goto("/");

    // Check the page has a title (update regex to match your actual title)
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });
});

test.describe("Accessibility", () => {
  test("should have no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForTimeout(1000);

    // Log errors for debugging but don't fail (optional: change to expect)
    if (errors.length > 0) {
      console.log("Console errors found:", errors);
    }
  });
});
