// src/styles/colors.ts
const colors = {
  // Base
  background: "#0b0e15ff",
  text: "#FFFFFF",
  textMuted: "#C4CCD7",
  primary: "#14EAFF",

  // Surfaces (필요 최소한만)
  surface: "#10151F",
  surfaceElevated: "#10151F",

  card: "#21232C",
  login: "#393F4A",

  // Lines (버튼/칩 등 보더)
  border: "#2C2E44",
  divider: "#2C2E44",

  // Buttons (그라데이션)
  intents: {
    primaryGradient: ["#14EAFF", "#0F6CC9"] as [string, string],
    primaryFg: "#FFFFFF",
  },

  // Status tags
  tags: {
    active:    { bg: "#132E2C", fg: "#25D980" },
    closed:    { bg: "#2C2E44", fg: "#C4CCD7" },
    cancelled: { bg: "#30202E", fg: "#F39C96" },
  },
};

export default colors;
