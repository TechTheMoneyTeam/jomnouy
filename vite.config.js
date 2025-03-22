import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            require:('@tailwindcss/nesting'),
            refresh: true,
        }),
        react(),
    ],
    css: {
        postcss: {
            plugins: [
                tailwindcss,
                autoprefixer,
            ],
        },
    },
    server: {
        host: true,
        strictPort: true,
        hmr: {
            clientPort: 5173,
            host: 'localhost',
        },
        watch: {
            usePolling: true,
            interval: 500, // decreased polling interval
        },
    },
    build: {
        outDir: 'public/build',
        manifest: true,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                }
            }
        },
        chunkSizeWarningLimit: 5000,
    },
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});