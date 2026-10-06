const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// Helper to format bytes
function formatMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
function formatKB(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

async function optimizeImages() {
  console.log('--- STARTING SAFE IMAGE OPTIMIZATION ---');

  const inv = JSON.parse(fs.readFileSync(path.join(__dirname, 'images_inventory.json'), 'utf8'));
  const used = inv.filter(x => x.used);

  let totalOriginalSize = 0;
  let totalOptimizedSavings = 0;
  let previewsCreated = 0;
  let webpCreated = 0;

  const results = [];

  // 1. Process Certificate & Document files (Create -preview.webp, preserve original)
  const certFolders = [
    'images/lamp_certificates',
    'images/steril_certificates',
    'images/kalci_certificates',
    'images/sushka_certificates',
    'images/cotton'
  ];

  for (const item of used) {
    const isCertDoc = certFolders.some(f => item.relPath.startsWith(f));
    const fullPath = path.join(PUBLIC_DIR, item.relPath);

    if (isCertDoc) {
      // Create -preview.webp
      const parsed = path.parse(fullPath);
      const previewFilename = `${parsed.name}-preview.webp`;
      const previewFullPath = path.join(parsed.dir, previewFilename);
      const previewRelPath = path.relative(PUBLIC_DIR, previewFullPath).replace(/\\/g, '/');

      try {
        const meta = await sharp(fullPath).metadata();
        const maxDim = 1200;
        let pipeline = sharp(fullPath);

        if (meta.width > maxDim || meta.height > maxDim) {
          if (meta.width >= meta.height) {
            pipeline = pipeline.resize({ width: maxDim, withoutEnlargement: true });
          } else {
            pipeline = pipeline.resize({ height: maxDim, withoutEnlargement: true });
          }
        }

        await pipeline
          .webp({ quality: 84, effort: 4 })
          .toFile(previewFullPath);

        const previewStat = fs.statSync(previewFullPath);
        const originalStat = fs.statSync(fullPath);
        const savingsBytes = originalStat.size - previewStat.size;

        previewsCreated++;
        results.push({
          relPath: item.relPath,
          previewRelPath,
          type: 'certificate_preview',
          origSize: originalStat.size,
          newSize: previewStat.size,
          savings: savingsBytes,
          width: meta.width,
          height: meta.height
        });

        console.log(`[CERT PREVIEW] ${item.relPath} (${formatMB(originalStat.size)}) -> ${previewRelPath} (${formatKB(previewStat.size)})`);
      } catch (err) {
        console.error(`Error processing cert preview ${item.relPath}:`, err.message);
      }
    }
  }

  // 2. Process Slider Images (images/slider/*.png -> .webp)
  const sliderItems = used.filter(x => x.relPath.startsWith('images/slider/'));
  for (const item of sliderItems) {
    const fullPath = path.join(PUBLIC_DIR, item.relPath);
    const parsed = path.parse(fullPath);
    if (parsed.ext.toLowerCase() === '.png') {
      const webpFilename = `${parsed.name}.webp`;
      const webpFullPath = path.join(parsed.dir, webpFilename);
      const webpRelPath = path.relative(PUBLIC_DIR, webpFullPath).replace(/\\/g, '/');

      try {
        await sharp(fullPath)
          .webp({ quality: 88, effort: 4 })
          .toFile(webpFullPath);

        const newStat = fs.statSync(webpFullPath);
        const origStat = fs.statSync(fullPath);

        webpCreated++;
        results.push({
          relPath: item.relPath,
          webpRelPath,
          type: 'slider_webp',
          origSize: origStat.size,
          newSize: newStat.size,
          savings: origStat.size - newStat.size
        });

        console.log(`[SLIDER WEBP] ${item.relPath} (${formatMB(origStat.size)}) -> ${webpRelPath} (${formatKB(newStat.size)})`);
      } catch (err) {
        console.error(`Error processing slider ${item.relPath}:`, err.message);
      }
    }
  }

  // 3. Process Heavy PNG diagrams and illustrations in images/*.png (> 800 KB)
  const heavyPngs = used.filter(x => {
    return (
      x.relPath.startsWith('images/') &&
      !x.relPath.includes('/') && // root of images/ or check split
      x.format === 'PNG' &&
      x.sizeKB > 800
    ) || (
      x.relPath.startsWith('images/steril/') &&
      x.format === 'PNG' &&
      x.sizeKB > 800
    );
  });

  // Also include root images like images/razrabotka_eng.png, etc.
  const allUsedPngs = used.filter(x => {
    if (x.format !== 'PNG' || x.sizeKB < 600) return false;
    if (x.relPath.startsWith('images/slider/')) return false; // already done
    return true;
  });

  for (const item of allUsedPngs) {
    const fullPath = path.join(PUBLIC_DIR, item.relPath);
    const parsed = path.parse(fullPath);
    const webpFilename = `${parsed.name}.webp`;
    const webpFullPath = path.join(parsed.dir, webpFilename);
    const webpRelPath = path.relative(PUBLIC_DIR, webpFullPath).replace(/\\/g, '/');

    try {
      await sharp(fullPath)
        .webp({ quality: 88, effort: 4 })
        .toFile(webpFullPath);

      const newStat = fs.statSync(webpFullPath);
      const origStat = fs.statSync(fullPath);

      webpCreated++;
      results.push({
        relPath: item.relPath,
        webpRelPath,
        type: 'diagram_webp',
        origSize: origStat.size,
        newSize: newStat.size,
        savings: origStat.size - newStat.size
      });

      console.log(`[DIAGRAM WEBP] ${item.relPath} (${formatMB(origStat.size)}) -> ${webpRelPath} (${formatKB(newStat.size)})`);
    } catch (err) {
      console.error(`Error processing diagram ${item.relPath}:`, err.message);
    }
  }

  // Write optimization results manifest
  fs.writeFileSync(
    path.join(__dirname, 'optimization_results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('--- OPTIMIZATION COMPLETED ---');
  console.log(`Previews created: ${previewsCreated}`);
  console.log(`WebP assets created: ${webpCreated}`);
  const totalSavings = results.reduce((acc, r) => acc + (r.savings > 0 ? r.savings : 0), 0);
  console.log(`Total savings on optimized items: ${formatMB(totalSavings)}`);
}

optimizeImages().catch(console.error);
