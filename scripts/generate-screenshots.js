import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
const BASE_URL = 'http://localhost:5174';

// Ensure directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function takeScreenshots() {
    console.log('🚀 Starting simple screenshot generation...');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Set viewport
        await page.setViewportSize({ width: 1920, height: 1080 });

        // Go to the page
        await page.goto(BASE_URL, { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        // 1. Hero section - light mode
        console.log('📸 Taking hero-light screenshot...');
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, 'hero-light.png'),
            fullPage: false,
            clip: { x: 0, y: 0, width: 1920, height: 1080 }
        });

        // 2. Switch to dark mode and take hero screenshot
        console.log('📸 Taking hero-dark screenshot...');
        await page.click('button[aria-label="Toggle theme"]');
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, 'hero-dark.png'),
            fullPage: false,
            clip: { x: 0, y: 0, width: 1920, height: 1080 }
        });

        // Switch back to light mode for other screenshots
        await page.click('button[aria-label="Toggle theme"]');
        await page.waitForTimeout(1000);

        // 3. About section with code animation
        console.log('📸 Taking about-section screenshot...');
        await page.evaluate(() => window.scrollTo(0, 1000));
        await page.waitForTimeout(2000);
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, 'about-section.png'),
            fullPage: false,
            clip: { x: 0, y: 0, width: 1920, height: 1080 }
        });

        // 4. Data pipeline section
        console.log('📸 Taking data-pipeline screenshot...');
        await page.evaluate(() => window.scrollTo(0, 2000));
        await page.waitForTimeout(2000);
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, 'data-pipeline.png'),
            fullPage: false,
            clip: { x: 0, y: 0, width: 1920, height: 1080 }
        });

        // 5. Device showcase section
        console.log('📸 Taking device-showcase screenshot...');
        await page.evaluate(() => window.scrollTo(0, 3500));
        await page.waitForTimeout(2000);
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, 'device-showcase.png'),
            fullPage: false,
            clip: { x: 0, y: 0, width: 1920, height: 1080 }
        });

        // 6. Contact section
        console.log('📸 Taking contact-section screenshot...');
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 1080));
        await page.waitForTimeout(2000);
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, 'contact-section.png'),
            fullPage: false,
            clip: { x: 0, y: 0, width: 1920, height: 1080 }
        });

        console.log('✅ All screenshots generated successfully!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await browser.close();
    }
}

takeScreenshots();