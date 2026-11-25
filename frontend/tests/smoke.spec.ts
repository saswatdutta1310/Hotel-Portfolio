import { test, expect } from "@playwright/test";

test.describe("Frontend Smoke Tests", () => {
  test("home page loads and links to directory", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Hotel Portfolio/);
    await expect(
      page.getByRole("heading", { name: "Find your next serene stay" })
    ).toBeVisible();

    const exploreLink = page.getByRole("link", { name: "Explore Hotels" });
    await expect(exploreLink).toBeVisible();
  });

  test("directory lists two hotels", async ({ page }) => {
    await page.goto("/hotels");
    await expect(page.getByRole("heading", { name: "Hotel Directory" })).toBeVisible();

    const sampleHotelHeading = page.getByRole("heading", {
      name: "The Grand Pine Hotel",
    });
    const sampleGuesthouseHeading = page.getByRole("heading", {
      name: "Riverstone Retreat Guest House",
    });

    await expect(sampleHotelHeading).toBeVisible();
    await expect(sampleGuesthouseHeading).toBeVisible();
  });

  test("hotel page shows Rooms, FAQ, Gallery, and quick facts", async ({ page }) => {
    await page.goto("/hotels/sample-hotel");

    // Hotel name and details
    await expect(
      page.getByRole("heading", { name: "The Grand Pine Hotel" })
    ).toBeVisible();
    await expect(
      page.getByText("Mountain tranquility and refined pine valley comfort")
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Quick Facts" })).toBeVisible();
    await expect(
      page.getByText("Shimla, Himachal Pradesh", { exact: true })
    ).toBeVisible();

    // Section Nav links
    await expect(page.getByRole("link", { name: "Rooms" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Amenities" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Policies & Rules" })).toBeVisible();
    await expect(page.getByRole("link", { name: "FAQs" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Gallery" })).toBeVisible();

    // Rooms section
    await expect(
      page.getByRole("heading", { name: "Rooms & Suites" })
    ).toBeVisible();
    await expect(page.getByText("Deluxe Pine View")).toBeVisible();
    await expect(page.getByText("Valley Family Suite")).toBeVisible();

    // FAQ section and native details/summary
    await expect(
      page.getByRole("heading", { name: "Frequently Asked Questions" })
    ).toBeVisible();
    await expect(page.getByText("Is parking available on site?")).toBeVisible();

    // Gallery section
    await expect(
      page.getByRole("heading", { name: "Photo Gallery" })
    ).toBeVisible();

    // Check that no visible text contains "TODO"
    const visibleBodyText = await page.innerText("body");
    expect(visibleBodyText).not.toContain("TODO");
  });

  test("hotel gallery lightbox opens and closes with Escape", async ({ page }) => {
    await page.goto("/hotels/sample-hotel");

    const firstGalleryButton = page
      .getByRole("button", { name: /View enlarged photo/i })
      .first();
    await expect(firstGalleryButton).toBeVisible();

    // Click to open lightbox
    await firstGalleryButton.click();

    // Lightbox modal dialog should be visible
    const lightboxDialog = page.getByRole("dialog", {
      name: "Photo Gallery Lightbox",
    });
    await expect(lightboxDialog).toBeVisible();

    // Press Escape to close
    await page.keyboard.press("Escape");
    await expect(lightboxDialog).not.toBeVisible();
  });
});
