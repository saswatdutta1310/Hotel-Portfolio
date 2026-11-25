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

  test("hotel page shows its name and quick facts", async ({ page }) => {
    await page.goto("/hotels/sample-hotel");

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
  });
});
