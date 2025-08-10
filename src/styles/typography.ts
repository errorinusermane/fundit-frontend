// src/styles/typography.ts
// 텍스트 스케일 + 가독성 라인헤이트 (legacy 호환 포함)
const base = {
  fontFamily: {
    regular: "System",
    medium: "System",
    bold: "System",
    mono: "Menlo",
  },
  size: {
    display: 28,   // 페이지 제목 (헤더 큰 타이틀)
    title: 20,     // 카드 타이틀/섹션 타이틀
    subtitle: 16,  // 보조 제목/탭/버튼 큰 라벨
    body: 14,      // 본문
    small: 12,     // 보조 설명/라벨
    caption: 11,   // 배지/메타
  },
  lineHeight: {
    display: 36,
    title: 28,
    subtitle: 22,
    body: 20,
    small: 18,
    caption: 16,
  },
  weight: {
    regular: "400" as const,
    medium: "600" as const,
    bold: "700" as const,
  },
  letter: {
    tight: -0.2,
    normal: 0,
    wide: 0.2,
  },
};

// ✅ Legacy alias (이전 코드 호환용)
// - typography.fontWeight.bold  → 동작
// - typography.title / subtitle / body / small → 동작
const typography = {
  ...base,
  fontWeight: base.weight,
  title: base.size.title,
  subtitle: base.size.subtitle,
  body: base.size.body,
  small: base.size.small,
};

export default typography;
