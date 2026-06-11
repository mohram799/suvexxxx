import sharp from 'sharp';
import { readdirSync, statSync, renameSync } from 'fs';
import { join, extname, basename } from 'path';

const PUBLIC_DIR = './public';

const files = readdirSync(PUBLIC_DIR).filter(f => {
  const ext = extname(f).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
});

console.log(`\n🔧 Compressing ${files.length} images...\n`);

for (const file of files) {
  const inputPath  = join(PUBLIC_DIR, file);
  const ext        = extname(file).toLowerCase();
  const nameNoExt  = basename(file, ext);
  const tempPath   = join(PUBLIC_DIR, `__temp__${file}`);

  const before = statSync(inputPath).size;

  try {
    if (ext === '.png') {
      // Convert PNG → WebP (90% quality, much smaller)
      const outPath = join(PUBLIC_DIR, `${nameNoExt}.webp`);
      await sharp(inputPath)
        .webp({ quality: 82, effort: 6 })
        .toFile(outPath);
      const after = statSync(outPath).size;
      console.log(`✅ ${file} → ${nameNoExt}.webp  |  ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB  (${Math.round((1-after/before)*100)}% saved)`);

    } else if (['.jpg', '.jpeg'].includes(ext)) {
      // Compress JPG in-place
      await sharp(inputPath)
        .jpeg({ quality: 75, mozjpeg: true, progressive: true })
        .toFile(tempPath);
      const after = statSync(tempPath).size;
      renameSync(tempPath, inputPath);
      console.log(`✅ ${file}  |  ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB  (${Math.round((1-after/before)*100)}% saved)`);

    } else if (ext === '.webp') {
      await sharp(inputPath)
        .webp({ quality: 80, effort: 6 })
        .toFile(tempPath);
      const after = statSync(tempPath).size;
      renameSync(tempPath, inputPath);
      console.log(`✅ ${file}  |  ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB  (${Math.round((1-after/before)*100)}% saved)`);
    }
  } catch (err) {
    console.error(`❌ Error processing ${file}:`, err.message);
  }
}

console.log('\n🎉 Done! All images compressed.\n');
