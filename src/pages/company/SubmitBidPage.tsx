import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  StyleSheet as RNStyleSheet,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../navigation/AppNavigator";

import { submitBid } from "../../api/bid";
import { useUserStore } from "../../store/userStore";
import CommonButton from "../../components/CommonButton";
import { colors, spacing, typography, radius } from "../../styles";

export function SubmitBidPage() {
  const route = useRoute<RouteProp<StackParamList, "SubmitBid">>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { user } = useUserStore();
  const { proposalId } = route.params;

  const [form, setForm] = useState({
    companyName: "",
    planTitle: "",
    planType: "",
    outpatientCoveragePerVisit: "",
    inpatientCoverage: "",
    nonCoveredCoverage: "",
    monthlyPremium: "",
    contractPeriod: "",
    ageEligibility: "",
    occupationEligibility: "",
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      const bid = {
        proposalId,
        companyName: form.companyName,
        planTitle: form.planTitle,
        planType: form.planType,
        outpatientCoveragePerVisit: Number(form.outpatientCoveragePerVisit),
        inpatientCoverage: Number(form.inpatientCoverage),
        nonCoveredCoverage: Number(form.nonCoveredCoverage),
        monthlyPremium: Number(form.monthlyPremium),
        contractPeriod: Number(form.contractPeriod),
        ageEligibility: Number(form.ageEligibility),
        occupationEligibility: form.occupationEligibility,
        wallet: user!.id,
      };

      const bidId = await submitBid(bid);
      Alert.alert("제출 완료", `입찰이 제출되었습니다. (ID: ${bidId})`);
      navigation.goBack();
    } catch (err) {
      console.error("❌ submitBid error:", err);
      Alert.alert("에러", "입찰 제출에 실패했습니다.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      {/* 페이지 타이틀 */}
      <Text style={styles.pageTitle}>Bid Detail</Text>

      {/* 검증 배지 */}
      <View style={styles.verifyRow}>
        <Text style={styles.verifyLabel}>Insurer Verification</Text>
        <View style={styles.verifyPill}>
          <Text style={styles.verifyPillText}>Verified</Text>
        </View>
      </View>

      {/* 안내 문구 */}
      <Text style={styles.notice}>
        This bid originates from the proposal ID "{proposalId}"
      </Text>

      {/* Company name */}
      <FieldCard label="Company name">
        <TextInput
          style={styles.input}
          value={form.companyName}
          onChangeText={(v) => handleChange("companyName", v)}
          placeholder="Enter Company name"
          placeholderTextColor={colors.textMuted}
        />
      </FieldCard>

      {/* Plan Summary */}
      <SectionCard title="Plan Summary">
        <TextInput
          style={styles.input}
          value={form.planTitle}
          onChangeText={(v) => handleChange("planTitle", v)}
          placeholder="Plan Title"
          placeholderTextColor={colors.textMuted}
        />
        <View style={{ height: spacing }} />
        <TextInput
          style={styles.input}
          value={form.planType}
          onChangeText={(v) => handleChange("planType", v)}
          placeholder="Plan Type"
          placeholderTextColor={colors.textMuted}
        />
      </SectionCard>

      {/* Coverage Details */}
      <SectionCard title="Coverage Details">
        <TextInput
          style={styles.input}
          value={form.outpatientCoveragePerVisit}
          onChangeText={(v) => handleChange("outpatientCoveragePerVisit", v)}
          keyboardType="numeric"
          placeholder="Outpatient Treatment (per visit)"
          placeholderTextColor={colors.textMuted}
        />
        <View style={{ height: spacing }} />
        <TextInput
          style={styles.input}
          value={form.inpatientCoverage}
          onChangeText={(v) => handleChange("inpatientCoverage", v)}
          keyboardType="numeric"
          placeholder="Inpatient Coverage"
          placeholderTextColor={colors.textMuted}
        />
        <View style={{ height: spacing }} />
        <TextInput
          style={styles.input}
          value={form.nonCoveredCoverage}
          onChangeText={(v) => handleChange("nonCoveredCoverage", v)}
          keyboardType="numeric"
          placeholder="Non-covered Medical Coverage"
          placeholderTextColor={colors.textMuted}
        />
      </SectionCard>

      {/* Premium */}
      <SectionCard title="Premium">
        <TextInput
          style={styles.input}
          value={form.monthlyPremium}
          onChangeText={(v) => handleChange("monthlyPremium", v)}
          keyboardType="numeric"
          placeholder="Monthly Premium"
          placeholderTextColor={colors.textMuted}
        />
        <View style={{ height: spacing }} />
        <TextInput
          style={styles.input}
          value={form.contractPeriod}
          onChangeText={(v) => handleChange("contractPeriod", v)}
          keyboardType="numeric"
          placeholder="Contract Period (months)"
          placeholderTextColor={colors.textMuted}
        />
        <View style={{ height: spacing }} />
        <TextInput
          style={styles.input}
          value={form.ageEligibility}
          onChangeText={(v) => handleChange("ageEligibility", v)}
          keyboardType="numeric"
          placeholder="Age Eligibility"
          placeholderTextColor={colors.textMuted}
        />
        <View style={{ height: spacing }} />
        <TextInput
          style={styles.input}
          value={form.occupationEligibility}
          onChangeText={(v) => handleChange("occupationEligibility", v)}
          placeholder="Occupation Eligibility"
          placeholderTextColor={colors.textMuted}
        />
      </SectionCard>

      {/* 하단 버튼 (Submit Bid 이미지 톤) */}
      <CommonButton
        title="Submit Bid"
        onPress={handleSubmit}
        role="company"
        disabled={user?.role !== "company"}
        fullWidth
        style={styles.submitBtn}
      />
    </ScrollView>
  );
}

/** 섹션 카드 */
const SectionCard: React.FC<{ title: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

/** 라벨 + 인풋 카드 */
const FieldCard: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <View style={styles.fieldCard}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    paddingHorizontal: spacing * 2, // 20
    paddingTop: spacing * 2,
    paddingBottom: spacing * 8,
  },

  pageTitle: {
    fontFamily: typography.family.base,
    fontSize: typography.size.nav,     // 25
    color: colors.text,
    marginBottom: spacing * 1.2,
  },

  // 검증 배지
  verifyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius,
    paddingHorizontal: spacing * 1.6,
    paddingVertical: spacing * 1.2,
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
    marginBottom: spacing * 1.6,
  },
  verifyLabel: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card,  // 17
    color: colors.text,
  },
  verifyPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing * 1.2,
    paddingVertical: spacing * 0.6,
    borderRadius: 999,
    backgroundColor: colors.border,  // 이미지만큼 살짝 밝은 칩 톤
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },
  verifyPillText: {
    fontFamily: typography.family.base,
    fontSize: typography.size.toggle, // 16
    color: colors.primary,
  },

  notice: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card,   // 17
    color: colors.textMuted,
    marginBottom: spacing * 1.6,
  },

  // 섹션/필드 카드 (Detail/Create와 통일)
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius,                  // 16
    paddingVertical: spacing * 1.4,        // 14
    paddingHorizontal: spacing * 1.6,      // 16
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
    marginBottom: spacing * 1.2,
  },
  cardTitle: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title,       // 20
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginBottom: spacing,
  },

  fieldCard: {
    backgroundColor: colors.surface,
    borderRadius: radius,
    paddingVertical: spacing * 1.2,
    paddingHorizontal: spacing * 1.6,
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
    marginBottom: spacing * 1.2,
  },
  fieldLabel: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card,        // 17
    color: colors.textMuted,
    marginBottom: spacing * 0.6,
  },

  input: {
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radius,
    paddingHorizontal: spacing * 1.6,      // 16
    paddingVertical: spacing * 1.2,        // 12
    backgroundColor: colors.background,
    color: colors.text,
    fontFamily: typography.family.base,
    fontSize: typography.size.body,        // 18
  },

  // 하단 버튼: 어두운 배경 + 시안 보더/텍스트(이미지 근사)
  submitBtn: {
    marginTop: spacing * 2,
    backgroundColor: "#0B232B",  // 서식에 없음: Submit Bid 근사 어두운 블루
    borderWidth: 1,
    borderColor: colors.primary,
    alignSelf: "stretch",
  },
});
