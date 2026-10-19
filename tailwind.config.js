export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#111111",
        accent: { DEFAULT: "#C79100", hover: "#A87800", light: "#FFF6DB" },
        surface: "#F7F7F7",
        border: "#E8E8E8",
        muted: "#6B6B6B",
        success: "#2E7D32",
        danger: "#D32F2F",
      },
      fontFamily: { sans: ["Outfit", "Arial", "sans-serif"] },
    },
  },
  plugins: [],
};
