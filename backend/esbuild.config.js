const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/index.js',
  format: 'cjs',
  sourcemap: true,
  minify: process.env.NODE_ENV === 'production',
  external: [
    // Native modules that can't be bundled
  ],
}).then(() => {
  console.log('Build complete');
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
