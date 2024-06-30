/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./src/routes/*.tsx",
    "./src/layouts/**/*.tsx",
    "./src/components/*.tsx",   // Components in the src/components directory
    "./src/screens/**/*.tsx"    // All files in the src/screens directory and its subdirectories
  ],
  theme: {
    extend: {
      colors: {
        'green-claro': '#00B37E',
        'green-escuro': '#00875F',
        'red-claro': '#F75A68',
        'red-escuro': '#AA2834',
        'background-escuro': '#202024'
      }
    },
  },
  plugins: [],
}