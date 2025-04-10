// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: '#182338', // Custom blue
        // customPink: '#CD3C67', 
      },
    },
  },
  plugins: [],
};

