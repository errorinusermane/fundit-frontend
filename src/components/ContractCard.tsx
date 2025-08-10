import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StyleSheet as RNStyleSheet } from "react-native";
import { FunditContract } from "../types/contract";
import { colors, spacing, typography, radius } from "../styles";

type Props = {
  contract: FunditContract;
  onToggleAuto?: (contractId: number) => void;
};

const ContractCard: React.FC<Props> = ({ contract, onToggleAuto }) => {
  const {
    id,
    companyName,
    planType,
    wallet,              // 지갑 주소 (옵션)
    nextPaymentDue,      // ms or s? → 아래에서 안전 처리
    tokenToPay,          // 예: '67.5 BNB'
    monthlyPremium,      // 백엔드 값 유지용
    contractPeriod,      // 백엔드 값 유지용
    startDate,           // 백엔드 값 유지용
    autoPayment,
  } = contract as any;

  // 짧은 주소
  const shortAddr = typeof wallet === "string" && wallet.length > 10
    ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
    : wallet;

  // 날짜 포맷(초/밀리초 모두 허용)
  const toDateStr = (t?: number | string) => {
    if (!t) return "—";
    const n = typeof t === "string" ? Number(t) : t;
    const ms = n < 1e12 ? n * 1000 : n;
    return new Date(ms).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={styles.card}>
      {/* 헤더: 회사명 */}
      <Text style={styles.company}>{companyName || "Company name"}</Text>

      {/* 1행: Plan type */}
      <Row label="Plan type" value={planType || "—"} />

      {/* Divider */}
      <View style={styles.divider} />

      {/* Wallet Connected */}
      <View style={{ marginBottom: spacing }}>
        <Text style={styles.label}>Wallet Connected</Text>
        <Text style={styles.subValue}>{shortAddr || "—"}</Text>
      </View>

      {/* Next Payment Due */}
      <Row label="Next Payment Due" value={toDateStr(nextPaymentDue)} />

      {/* Token to Pay */}
      <Row label="Token to Pay" value={tokenToPay || "—"} />

      {/* Auto‑Payment: 텍스트 토글 */}
      <View style={styles.row}>
        <Text style={styles.label}>Auto‑Payment</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onToggleAuto?.(id)}
          disabled={!onToggleAuto}
        >
          <Text
            style={[
              styles.value,
              {
                color: autoPayment ? colors.primary : colors.textMuted,
                fontWeight: typography.weight.bold,
              },
            ]}
          >
            {autoPayment ? "ON" : "OFF"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius,                         // 16
    paddingVertical: spacing * 1.6,               // 16
    paddingHorizontal: spacing * 1.8,             // 18
    marginVertical: spacing,                      // 10
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  company: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title,              // 20
    fontWeight: typography.weight.bold,           // 700
    color: colors.text,
    marginBottom: spacing,                        // 10
  },
  divider: {
    height: RNStyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing,                      // 10
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing,                        // 10
  },
  label: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card,               // 17
    color: colors.textMuted,
    marginRight: spacing,
    flexShrink: 0,
  },
  value: {
    fontFamily: typography.family.base,
    fontSize: typography.size.body,               // 18
    color: colors.text,
    flexShrink: 1,
    maxWidth: "60%",
    textAlign: "right",
  },
  subValue: {
    fontFamily: typography.family.mono,
    fontSize: typography.size.card,               // 17
    color: colors.textMuted,
    marginTop: spacing * 0.4,                     // 4
  },
});

export default ContractCard;
