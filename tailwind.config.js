/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
      colors: {
        ink: { 950: "#07080B" },
      },
      boxShadow: {
        glow: "0 0 60px rgba(120, 120, 255, .25)",
        glow2: "0 0 120px rgba(163, 102, 255, .18)",
        glass: "inset 0 1px 0 rgba(255,255,255,.08), 0 8px 30px rgba(0,0,0,.35)",
      },
      backgroundImage: {
        'grid': "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1.2px)",
        'radial-soft': "radial-gradient(60% 60% at 50% 40%, rgba(116,96,255,.18) 0%, rgba(201,104,255,.12) 30%, rgba(0,0,0,0) 70%)",
      }
    },
  },
  plugins: [],
};
