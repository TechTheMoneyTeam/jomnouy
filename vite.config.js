import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            require:('@tailwindcss/nesting'),
            refresh: true,
        }),
        react(),
    ],
    server: {
        proxy: {
            // Proxy all requests to Laravel
            '/': 'http://localhost:8000', 
            //  // Adjust this URL if Laravel is running on a different port
        },
    },
    build: {
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
});
