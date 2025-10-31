import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';

const sizes = [320, 560, 768, 1024, 1200];
const qualities = { 
  webp: { small: 75, medium: 80, large: 70 }, 
  jpeg: { small: 80, medium: 85, large: 75 } 
};

async function optimizeImages() {
  const images = await glob('public/images/**/*.{jpg,jpeg,png}');
  
  // Create a manifest for convenience
  const manifest: Record<string, any> = {};
  
  for (const imagePath of images) {
    const { name, dir } = path.parse(imagePath);
    
    if (name.includes('-') && (name.includes('w.webp') || name.includes('fallback'))) {
      continue;
    }
    
    console.log(`Processing: ${name}`);
    
    // Get original sizes
    const metadata = await sharp(imagePath).metadata();
    
    // Generate WebP versions 
    for (const size of sizes) {
      // Select quality based on size
      let quality;
      if (size <= 320) quality = qualities.webp.small;
      else if (size <= 768) quality = qualities.webp.medium;
      else quality = qualities.webp.large;
      
      const outputPath = path.join(dir, `${name}-${size}w.webp`);
      await sharp(imagePath)
        .resize(size, null, { 
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3 // Best resize quality
        })
        .webp({ 
          quality,
          effort: 6, // Maximum compression
          smartSubsample: true
        })
        .toFile(outputPath);
    }
    
    // Optimized fallback
    await sharp(imagePath)
      .jpeg({ 
        quality: qualities.jpeg.medium,
        progressive: true,
        mozjpeg: true
      })
      .toFile(path.join(dir, `${name}-fallback.jpg`));
    
    // Add to manifest
    manifest[name] = {
      original: { width: metadata.width, height: metadata.height },
      variants: sizes.map(size => `${name}-${size}w.webp`),
      fallback: `${name}-fallback.jpg`
    };
  }
  
  // Save manifest
  await fs.writeFile(
    'public/images/manifest.json', 
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('✅ Optimization complete!');
  console.log('📄 Manifest saved to public/images/manifest.json');
}

optimizeImages().catch(console.error);
