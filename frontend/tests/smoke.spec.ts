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
    await expect(page.getByRole("link", { name: "Enquire" })).toBeVisible();

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

  test("enquiry form validation errors and focus handling", async ({ page }) => {
    await page.goto("/hotels/sample-hotel");

    const enquiryHeading = page.getByRole("heading", {
      name: "Send an Enquiry",
    });
    await expect(enquiryHeading).toBeVisible();

    const submitBtn = page.getByRole("button", { name: "Submit Enquiry" });
    await expect(submitBtn).toBeVisible();

    // Submitting empty form triggers validation error
    await submitBtn.click();

    const nameInput = page.getByLabel(/Your Full Name/i);
    await expect(nameInput).toBeFocused();
    await expect(page.getByText("Name is required.")).toBeVisible();
    await expect(
      page.getByText("Please provide at least a phone number or email address.").first()
    ).toBeVisible();
  });

  test("enquiry form success flow in mock mode", async ({ page }) => {
    await page.goto("/hotels/sample-hotel");

    // Fill valid enquiry form
    await page.getByLabel(/Your Full Name/i).fill("Test Visitor");
    await page.getByLabel(/Phone Number/i).fill("+91 9876543210");
    await page.getByLabel(/Email Address/i).fill("visitor@example.com");
    await page.getByLabel(/Special Requests or Questions/i).fill("Looking for a mountain view room.");

    const submitBtn = page.getByRole("button", { name: "Submit Enquiry" });
    await submitBtn.click();

    // Verify submission success state
    await expect(
      page.getByRole("heading", { name: "Enquiry Sent Successfully" })
    ).toBeVisible({ timeout: 5000 });
    await expect(
      page.getByText("The host has received your details and will get in touch")
    ).toBeVisible();
  });

  test("honeypot field is off-screen and not keyboard reachable", async ({ page }) => {
    await page.goto("/hotels/sample-hotel");

    const honeypot = page.locator('input[name="website"]');
    await expect(honeypot).toHaveAttribute("tabindex", "-1");

    // Tab through elements and ensure honeypot never receives focus
    await page.getByLabel(/Your Full Name/i).focus();
    await page.keyboard.press("Tab");

    const isHoneypotFocused = await honeypot.evaluate((el) => el === document.activeElement);
    expect(isHoneypotFocused).toBe(false);
  });
});
