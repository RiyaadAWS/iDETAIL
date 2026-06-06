import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import fs from 'fs';

function copyImagesPlugin() {
  return {
    name: 'copy-images-plugin',
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'src/assets/images');
      const destDir1 = path.resolve(__dirname, 'dist/assets');
      const destDir2 = path.resolve(__dirname, 'dist/src/assets/images');

      console.log('Copying images to dist directories...');

      try {
        if (fs.existsSync(srcDir)) {
          // Copy to dist/assets
          fs.mkdirSync(destDir1, { recursive: true });
          fs.cpSync(srcDir, destDir1, { recursive: true });
          console.log(`Copied images successfully to ${destDir1}`);

          // Copy to dist/src/assets/images
          fs.mkdirSync(destDir2, { recursive: true });
          fs.cpSync(srcDir, destDir2, { recursive: true });
          console.log(`Copied images successfully to ${destDir2}`);
        } else {
          console.warn(`Source image directory not found: ${srcDir}`);
        }
      } catch (err) {
        console.error('Error copying images:', err);
      }
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), copyImagesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
