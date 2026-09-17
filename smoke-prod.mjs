import { chromium } from "playwright";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();

// Simulate: build happened when DB was empty (already true), now visit /login BEFORE setup exists
await page.goto("http://localhost:3100/login", { waitUntil: "networkidle" });
console.log("Visiting /login before setup exists -> URL:", page.url());
console.log("Should be /setup:", page.url().includes("/setup"));

// Complete setup
await page.fill('#fullName', "Prod Admin");
await page.fill('#email', "admin@fameterra.com");
await page.fill('#password', "Password123!");
await page.click('button:has-text("Create Super Admin account")');
await page.waitForTimeout(2000);
console.log("After setup submit, URL:", page.url());

// THE CRITICAL TEST: visit /login again in a FRESH context (simulating a different user/browser)
// This is the exact bug scenario - does /login now correctly show the login form
// instead of a frozen redirect to /setup?
const page2 = await browser.newPage();
await page2.goto("http://localhost:3100/login", { waitUntil: "networkidle" });
console.log("Fresh visit to /login AFTER setup complete -> URL:", page2.url());
console.log("BUG WOULD SHOW: /setup. FIXED SHOULD SHOW: /login");
const body = await page2.textContent("body");
console.log("Shows login form (Sign in):", body.includes("Sign in"));
console.log("Shows setup form (wrongly):", body.includes("First-time setup"));

// Also verify /setup now correctly blocks re-setup
await page2.goto("http://localhost:3100/setup", { waitUntil: "networkidle" });
console.log("\nFresh visit to /setup after complete -> URL:", page2.url());
console.log("Should auto-redirect to /login:", page2.url().includes("/login"));

// Now actually log in
await page2.goto("http://localhost:3100/login", { waitUntil: "networkidle" });
await page2.fill('input[name="email"]', "admin@fameterra.com");
await page2.fill('input[name="password"]', "Password123!");
await page2.click('button[type="submit"]');
await page2.waitForLoadState("networkidle");
await page2.waitForTimeout(1000);
console.log("\nAfter real login, URL:", page2.url());

await browser.close();
