/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'selector', // or 'class'
    theme: {
        extend: {
            colors: {
                bot: 'var(--color-bot)',
                normal: 'var(--color-normal)',
            },
        },
    },
    plugins: [],
}
