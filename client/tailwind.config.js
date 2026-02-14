/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                rose: {
                    50: '#FFF5F5',
                    100: '#F9E4E4',
                    200: '#FADADD',
                    300: '#F5B7B1',
                    400: '#F1948A',
                    500: '#EC7063',
                },
                cream: {
                    50: '#FFFCF5',
                    100: '#FFF5E4',
                    200: '#FFECD2',
                    300: '#FFE0B2',
                },
                blush: {
                    50: '#FFF0F3',
                    100: '#FADADD',
                    200: '#FFC4D6',
                    300: '#FFADC5',
                },
                sage: {
                    50: '#F0F5F0',
                    100: '#D4E2D4',
                    200: '#B8D8B8',
                    300: '#9CCE9C',
                },
                gold: {
                    50: '#FBF7F0',
                    100: '#F5ECD8',
                    200: '#E8D5A3',
                    300: '#D4B86A',
                    400: '#C5A55A',
                    500: '#B8934A',
                },
                fashion: {
                    dark: '#2D2D2D',
                    charcoal: '#3D3D3D',
                    medium: '#6B6B6B',
                    light: '#F8F6F3',
                    bg: '#FEFCFA',
                },
            },
            fontFamily: {
                display: ['Playfair Display', 'serif'],
                body: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'card': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
            },
        },
    },
    plugins: [],
};
