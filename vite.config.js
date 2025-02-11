import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    server: {
'/api': {
            target: 'http://localhost:8000', // Ensure this matches your Laravel server
            changeOrigin: true,
            secure: false,
        },
    },
});
