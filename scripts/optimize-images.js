#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * This script optimizes screenshots for web usage by compressing them
 * while maintaining good quality.
 * 
 * Usage:
 *   npm install sharp
 *   node scripts/optimize-images.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
const MAX_WIDTH = 1920;
const QUALITY = 85;

async function optimizeImage(inputPath, outputPath) {
    try {
        const stats = fs.statSync(inputPath);
        const originalSize = stats.size;

        await sharp(inputPath)
            .resize(MAX_WIDTH, null, {
                withoutEnlargement: true,
                fit: 'inside'
            })
            .png({
                quality: QUALITY,
                compressionLevel: 9,
                progressive: true
            })
            .toFile(outputPath);

        const newStats = fs.statSync(outputPath);
        const newSize = newStats.size;
        const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

        console.log(`✅ ${path.basename(inputPath)}: ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${savings}% smaller)`);

    } catch (error) {
        console.error(`❌ Error optimizing ${inputPath}:`, error.message);
    }
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function optimizeAllImages() {
    console.log('🖼️  Starting image optimization...');

    if (!fs.existsSync(SCREENSHOTS_DIR)) {
        console.error(`❌ Screenshots directory not found: ${SCREENSHOTS_DIR}`);
        return;
    }

    const files = fs.readdirSync(SCREENSHOTS_DIR)
        .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
        .filter(file => file !== '.gitkeep');

    if (files.length === 0) {
        console.log('📁 No images found to optimize');
        return;
    }

    console.log(`📊 Found ${files.length} images to optimize`);
    console.log(`🎯 Target: Max width ${MAX_WIDTH}px, Quality ${QUALITY}%\n`);

    for (const file of files) {
        const inputPath = path.join(SCREENSHOTS_DIR, file);
        const outputPath = path.join(SCREENSHOTS_DIR, `optimized_${file}`);

        await optimizeImage(inputPath, outputPath);

        // Replace original with optimized version
        fs.renameSync(outputPath, inputPath);
    }

    console.log('\n🎉 Image optimization complete!');
}

// Run the script
optimizeAllImages().catch(console.error);

export { optimizeAllImages };