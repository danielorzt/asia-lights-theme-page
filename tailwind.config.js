/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // Ajusta si tu código está en otra parte
        "./index.html"       // O donde esté tu index.html principal
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Tu fuente principal
                'noto-jp': ['"Noto Sans JP"', 'sans-serif'],
                'noto-kr': ['"Noto Sans KR"', 'sans-serif'],
                'noto-sc': ['"Noto Sans SC"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}