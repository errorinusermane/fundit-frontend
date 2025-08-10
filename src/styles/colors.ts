// src/styles/colors.ts
// 다크 테마 공통 컬러 토큰 (UI 전역 일관성)
const colors = {
  // Brand & roles
  primary: "#60A5FA",      // Fundit 브랜드 블루 (기본 CTA, 링크)
  secondary: "#94A3B8",    // 보조(설명, 서브 액션)
  roles: {
    user: "#22D3EE",       // 개인(User) 포인트
    company: "#60A5FA",    // 기업(Company) 포인트 = primary
  },

  // Backgrounds
  background: "#0B1220",   // 앱 전체 배경
  surface: "#121826",      // 카드/모달/인풋 기본 면
  surfaceElevated: "#1A2234", // 상승 면(리스트/헤더)
  surfaceMuted: "#0E1524", // 섹션 구분용 얕은 면

  // Text
  text: "#E5EAF3",         // 기본 텍스트
  textMuted: "#B6C2D9",    // 보조 텍스트
  textDisabled: "#7B8AA0", // 비활성 텍스트

  // Borders / dividers
  border: "#22304A",
  divider: "#1D2A43",

  // States
  success: "#22C55E",
  warning: "#F59E0B",
  danger:  "#F43F5E",
  info:    "#60A5FA",

  // Component intent(버튼/배지 등에서 바로 사용)
  intents: {
    neutralBg: "#121826",
    neutralFg: "#E5EAF3",
    primaryBg: "#2563EB",
    primaryFg: "#FFFFFF",
    outline:   "#22304A",
  },

  // Overlays
  overlay: "rgba(2, 6, 23, 0.6)",  // 모달/액션시트 백드롭
  focus:   "rgba(96, 165, 250, 0.45)",

  // Gradients (배너/헤더)
  gradients: {
    hero: ["#0B1220", "#121826", "#1A2234"],
    card: ["#0E1524", "#121826"],
  },

  // Charts (간단 포트/리워드 카드용 팔레트)
  chart: ["#60A5FA", "#22D3EE", "#34D399", "#F59E0B", "#F43F5E", "#A78BFA"],
};

export default colors;
