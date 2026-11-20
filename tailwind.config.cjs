const canvas = "#f8f9fa";
const googleBlueDeep = "#1967d2";
const blueSoft = "#e8f0fe";
const slate = "#5f6368";
const cloudShadow = "#c4c6c7";

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: {
    relative: true,
    files: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  },
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: googleBlueDeep,
          hover: googleBlueDeep,
          accent: "#1a73e8",
          soft: blueSoft,
          tint: canvas,
        },
        ink: {
          DEFAULT: "#202124",
          secondary: "#3C4043",
          muted: slate,
        },
        canvas,
        surface: "#ffffff",
        line: "#DADCE0",
        subtle: slate,
        "cloud-shadow": cloudShadow,
        success: {
          DEFAULT: googleBlueDeep,
          soft: blueSoft,
          tint: canvas,
        },
        danger: {
          DEFAULT: "#A50E0E",
          hover: "#840B0B",
          accent: "#EA4335",
          soft: "#FAD2CF",
          tint: "#FEF4F3",
        },
        warning: {
          DEFAULT: "#202124",
          accent: "#E37400",
          highlight: "#FBBC04",
          soft: "#FEEFC3",
          tint: "#FFFAEB",
        },
      },
      borderColor: ({ theme }) => ({ DEFAULT: theme("colors.line") }),
      boxShadow: {
        "cloud": `0 2px 4px ${cloudShadow}66, 0 6px 20px ${cloudShadow}40`,
        "soft-card": `0 1px 2px ${cloudShadow}55, 0 4px 16px ${cloudShadow}26`,
      },
    },
  },
  plugins: [],
};
