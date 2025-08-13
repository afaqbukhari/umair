# Screenshots Setup Guide

This guide explains how to add the actual screenshots to the portfolio README.

## 📁 File Structure

```
docs/
└── screenshots/
    ├── hero-light.png      # Hero section in light mode
    ├── hero-dark.png       # Hero section in dark mode
    ├── about-section.png   # About section with code animation
    ├── data-pipeline.png   # Data pipeline visualization
    ├── device-showcase.png # Device showcase section
    └── contact-section.png # Contact and scheduling section
```

## 🖼️ Screenshot Requirements

### Image Specifications
- **Format**: PNG (preferred) or JPG
- **Resolution**: 1920x1080 or higher for desktop screenshots
- **Quality**: High quality, clear text and UI elements
- **File Size**: Optimize for web (< 500KB per image recommended)

### Screenshot Content Mapping

1. **hero-light.png**: Hero section showing:
   - Name and title
   - Tagline
   - Skills badges
   - "View My Work" button
   - Light theme styling

2. **hero-dark.png**: Same hero section but with:
   - Dark theme styling
   - All elements clearly visible

3. **about-section.png**: About section featuring:
   - "Crafting Digital Solutions" heading
   - Code animation component with multiple code files
   - Floating geometric elements
   - Interactive code editor windows

4. **data-pipeline.png**: Data engineering section showing:
   - "Orchestrating Data Pipelines" heading
   - Interactive D3.js flowchart
   - Data flow visualization
   - "Next Step" button
   - Pipeline components (Kafka, Spark, Airflow, etc.)

5. **device-showcase.png**: Device showcase section displaying:
   - "Scalable Data & AI Solutions" heading
   - Device frames (desktop/mobile)
   - Data dashboard mockup
   - Responsive design demonstration

6. **contact-section.png**: Contact section with:
   - "Let's Work Together" heading
   - Email and Schedule Call buttons
   - Social media links
   - Footer information

## 🔧 How to Add Screenshots

### Method 1: Replace Placeholder Files
1. Take screenshots of each section
2. Optimize images for web
3. Replace the placeholder files in `docs/screenshots/` with actual images
4. Keep the same filenames

### Method 2: Update File Paths
1. Add your screenshots to `docs/screenshots/`
2. If using different filenames, update the paths in `README.md`
3. Ensure all image links are working

## 📐 Best Practices

### Taking Screenshots
- Use a consistent browser and screen resolution
- Ensure all animations are in a good state
- Capture full sections, not partial views
- Use browser dev tools to simulate different devices if needed

### Image Optimization
```bash
# Using imageoptim (macOS)
imageoptim docs/screenshots/*.png

# Using tinypng CLI
tinypng docs/screenshots/*.png

# Using sharp-cli
npx sharp-cli -i docs/screenshots/ -o docs/screenshots/ -f png -q 80
```

### Accessibility
- Add descriptive alt text for each image
- Ensure images are meaningful and add value
- Consider users with slow internet connections

## 🚀 Automation (Optional)

You can automate screenshot generation using tools like:

### Playwright
```javascript
// screenshot-generator.js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174');
  
  // Hero section - light mode
  await page.screenshot({ 
    path: 'docs/screenshots/hero-light.png',
    clip: { x: 0, y: 0, width: 1920, height: 1080 }
  });
  
  // Switch to dark mode
  await page.click('[aria-label="Toggle theme"]');
  await page.waitForTimeout(500);
  
  // Hero section - dark mode
  await page.screenshot({ 
    path: 'docs/screenshots/hero-dark.png',
    clip: { x: 0, y: 0, width: 1920, height: 1080 }
  });
  
  await browser.close();
})();
```

### Puppeteer
```javascript
// Similar approach with Puppeteer
const puppeteer = require('puppeteer');
// ... implementation
```

## ✅ Verification

After adding screenshots:
1. Check that all images load in the README
2. Verify images are properly sized and clear
3. Test on different devices/screen sizes
4. Ensure fast loading times
5. Validate accessibility with screen readers

## 📝 Notes

- Screenshots should represent the current state of the application
- Update screenshots when making significant UI changes
- Consider creating a script to automate screenshot updates
- Keep original high-resolution versions for future use