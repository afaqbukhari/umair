import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
const README_PATH = path.join(__dirname, '..', 'README.md');

const requiredScreenshots = [
    'hero-light.png',
    'hero-dark.png',
    'about-section.png',
    'data-pipeline.png',
    'device-showcase.png',
    'contact-section.png'
];

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function verifyScreenshots() {
    console.log('🔍 Verifying screenshots...\n');

    let allValid = true;
    let totalSize = 0;

    for (const screenshot of requiredScreenshots) {
        const filePath = path.join(SCREENSHOTS_DIR, screenshot);

        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const size = stats.size;
            totalSize += size;

            console.log(`✅ ${screenshot}: ${formatBytes(size)}`);

            // Check if file is not empty
            if (size < 1000) {
                console.log(`   ⚠️  Warning: File seems very small (${formatBytes(size)})`);
                allValid = false;
            }
        } else {
            console.log(`❌ ${screenshot}: Missing`);
            allValid = false;
        }
    }

    console.log(`\n📊 Total size: ${formatBytes(totalSize)}`);

    // Check README references
    console.log('\n🔍 Checking README references...');

    if (fs.existsSync(README_PATH)) {
        const readmeContent = fs.readFileSync(README_PATH, 'utf8');

        for (const screenshot of requiredScreenshots) {
            const imagePath = `docs/screenshots/${screenshot}`;
            if (readmeContent.includes(imagePath)) {
                console.log(`✅ README references ${screenshot}`);
            } else {
                console.log(`❌ README missing reference to ${screenshot}`);
                allValid = false;
            }
        }
    } else {
        console.log('❌ README.md not found');
        allValid = false;
    }

    console.log('\n' + '='.repeat(50));

    if (allValid) {
        console.log('🎉 All screenshots are valid and properly referenced!');
        console.log('\n📋 Next steps:');
        console.log('1. Review the screenshots in your file explorer');
        console.log('2. Check how they look in the README on GitHub');
        console.log('3. Commit and push the changes');
    } else {
        console.log('⚠️  Some issues found. Please review and fix them.');
    }
}

verifyScreenshots();