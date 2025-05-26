/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // Ajusta si tu código está en otra parte
        "./public/index.html"        // O donde esté tu index.html principal
    ],
    theme: {
        extend: {
            // Tus personalizaciones aquí
        },
    },
    plugins: [],
}