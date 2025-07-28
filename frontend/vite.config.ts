import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [tailwindcss()],
    root: 'src',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        target: 'esnext', // evita builds legacy
        sourcemap: false, // acelera build e reduz artefatos
        minify: 'esbuild',
    },
});
