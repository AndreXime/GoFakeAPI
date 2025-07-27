import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [tailwindcss()],
    root: 'src',

    build: {
        // 2. Define o diretório de saída para ser 'dist' na pasta principal do frontend.
        // O '../' sobe um nível a partir da pasta 'src'.
        outDir: '../dist',

        // Esvazia o diretório de saída antes de cada build.
        emptyOutDir: true,

        // 3. Configura o Rollup (o bundler que o Vite usa) para não gerar hashes nos nomes dos ficheiros.
        rollupOptions: {
            output: {
                // Formato para os pontos de entrada (o seu main.js)
                entryFileNames: `[name].js`,
                // Formato para os "pedaços" de código (se houver divisão de código)
                chunkFileNames: `[name].js`,
                // Formato para outros recursos (CSS, imagens, fontes, etc.)
                assetFileNames: `[name].[ext]`,
            },
        },
    },
});
