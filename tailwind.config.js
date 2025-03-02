import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import nesting from '@tailwindcss/nesting';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.jsx',
        './resources/**/*.vue',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'custom-orange': '#F07900',
            },
        },
    },
    
    plugins: [forms, nesting],
};
