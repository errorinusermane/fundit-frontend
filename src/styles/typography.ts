// src/styles/typography.ts
const typography = {
  family: {
    logo: "Agbalumo",   // 로고
    base: "System",     // 기본 본문/UI
    mono: "Menlo",
  },
  size: {
    logo: 50,    // 로고
    nav: 25,     // 네비게이션 타이틀
    title: 20,   // 페이지/카드 제목
    body: 18,    // 일반 본문
    card: 17,    // 카드 내용/메타
    toggle: 16,  // 토글/작은 라벨
    detail: 13,  // 가장 작은 디테일
  },
  weight: {
    regular: "400" as const,
    medium:  "600" as const,
    bold:    "700" as const,
    extra:   "900" as const,
  },
};

export default typography;
