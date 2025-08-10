import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput, Alert, StyleSheet as RNStyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../navigation/AppNavigator";

import { createProposal } from "../../api/proposal";
import { useUserStore } from "../../store/userStore";
import CommonButton from "../../components/CommonButton";
import { colors, spacing, typography, radius } from "../../styles";

export function CreateProposalPage() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { user } = useUserStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mandatoryRequirements, setMandatoryRequirements] = useState<string[]>([]);
  const [enrollmentConditions, setEnrollmentConditions] = useState<string[]>([]);
  const [optionalFeatures, setOptionalFeatures] = useState<string[]>([]);
  const [desiredStartDate, setDesiredStartDate] = useState(""); // YYYY-MM-DD
  const [minPremium, setMinPremium] = useState("");
  const [maxPremium, setMaxPremium] = useState("");

  const handleSubmit = async () => {
    if (!user || user.role !== "user") return;

    if (!title || !description || !desiredStartDate || !minPremium || !maxPremium) {
      Alert.alert("입력 오류", "모든 필수 항목을 입력해주세요.");
      return;
    }

    try {
      const input = {
        title,
        description,
        mandatoryRequirements,
        enrollmentConditions,
        optionalFeatures,
        desiredStartDate: Math.floor(new Date(desiredStartDate).getTime() / 1000),
        minPremium: parseFloat(minPremium) * 1e18,
        maxPremium: parseFloat(maxPremium) * 1e18,
        walletAddress: user.id,
      };
      const txHash = await createProposal(input);
      Alert.alert("✅ 제안이 생성되었습니다", `TX: ${txHash}`);
      navigation.navigate("MyProposals");
    } catch (err) {
      console.error("❌ 제안 생성 실패:", err);
      Alert.alert("제안 생성 실패", "다시 시도해주세요.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      {/* 페이지 타이틀 */}
      <Text style={styles.pageTitle}>Create Proposal</Text>

      {/* 필드 카드: Title */}
      <FieldCard label="Title">
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter title" placeholderTextColor={colors.textMuted} />
      </FieldCard>

      {/* 본문 설명 카드 */}
      <FieldCard label="Description">
        <TextInput
          style={[styles.input, { height: spacing * 12, textAlignVertical: "top" }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your situation and what coverage you need"
          placeholderTextColor={colors.textMuted}
          multiline
        />
      </FieldCard>

      {/* 섹션 카드들 (Detail과 동일 톤) */}
      <SectionCard title="Mandatory Requirements">
        <MultiInput values={mandatoryRequirements} onChange={setMandatoryRequirements} />
      </SectionCard>

      <SectionCard title="Enrollment Conditions">
        <MultiInput values={enrollmentConditions} onChange={setEnrollmentConditions} />
      </SectionCard>

      <SectionCard title="Optional Features">
        <MultiInput values={optionalFeatures} onChange={setOptionalFeatures} />
      </SectionCard>

      {/* 시작일 */}
      <FieldCard label="Desired Start Date">
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textMuted}
          value={desiredStartDate}
          onChangeText={setDesiredStartDate}
        />
      </FieldCard>

      {/* 프리미엄 범위 */}
      <View style={styles.row}>
        <FieldCard label="Minimum Premium (BNB)" style={{ flex: 1, marginRight: spacing }}>
          <TextInput
            style={styles.input}
            value={minPremium}
            onChangeText={setMinPremium}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={colors.textMuted}
          />
        </FieldCard>
        <FieldCard label="Maximum Premium (BNB)" style={{ flex: 1, marginLeft: spacing }}>
          <TextInput
            style={styles.input}
            value={maxPremium}
            onChangeText={setMaxPremium}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={colors.textMuted}
          />
        </FieldCard>
      </View>

      {/* 하단 버튼: Submit Bid 버튼 톤과 유사(어두운 바탕 + 시안 보더/텍스트) */}
      <CommonButton
        title="Create Proposal"
        role="user"
        onPress={handleSubmit}
        fullWidth
        style={styles.createBtn}
      />
    </ScrollView>
  );
}

/** 섹션 카드 (Detail과 동일 톤) */
const SectionCard: React.FC<{ title: string; children?: React.ReactNode; style?: any }> = ({ title, children, style }) => (
  <View style={[styles.card, style]}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

/** 라벨 + 인풋 카드 */
const FieldCard: React.FC<{ label: string; children: React.ReactNode; style?: any }> = ({ label, children, style }) => (
  <View style={[styles.fieldCard, style]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {children}
  </View>
);

/** 불릿 + 추가 인풋 (Detail 불릿 스타일 맞춤) */
function MultiInput({
  values,
  onChange,
}: {
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const addItem = () => {
    const v = input.trim();
    if (!v) return;
    onChange([...values, v]);
    setInput("");
  };

  return (
    <View>
      {values.map((v, i) => (
        <View key={`${v}-${i}`} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{v}</Text>
        </View>
      ))}
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        onSubmitEditing={addItem}
        placeholder="Type and press Enter"
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    paddingHorizontal: spacing * 2,
    paddingTop: spacing * 2,
    paddingBottom: spacing * 8,
  },

  pageTitle: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title,     // 20
    fontWeight: typography.weight.bold,  // 700
    color: colors.text,
    marginBottom: spacing * 1.6,
  },

  // 공통 카드 톤 (ProposalDetail과 통일)
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius,                               // 16
    paddingVertical: spacing * 1.4,
    paddingHorizontal: spacing * 1.6,
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
    marginBottom: spacing * 1.2,
  },
  cardTitle: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title,                    // 20
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
    fontSize: typography.size.card,                     // 17
    color: colors.textMuted,
    marginBottom: spacing * 0.6,
  },

  input: {
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radius,
    paddingHorizontal: spacing * 1.6,
    paddingVertical: spacing * 1.2,
    backgroundColor: colors.background,
    color: colors.text,
    fontFamily: typography.family.base,
    fontSize: typography.size.body,                     // 18
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing * 0.8,
  },
  bulletDot: {
    fontFamily: typography.family.base,
    fontSize: typography.size.body,                     // 18
    color: colors.textMuted,
    marginRight: spacing,
    lineHeight: typography.size.body + 2,
  },
  bulletText: {
    flex: 1,
    fontFamily: typography.family.base,
    fontSize: typography.size.card,                     // 17
    color: colors.textMuted,
    lineHeight: typography.size.card + 6,
  },

  row: {
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: spacing * 1.2,
  },

  // Submit Bid 유사 톤(어두운 바탕 + 시안 보더/텍스트)
  createBtn: {
    marginTop: spacing * 2,
    backgroundColor: "#0B232B",           // 서식엔 없음 → Submit Bid 근사 어두운 블루
    borderWidth: 1,
    borderColor: colors.primary,
    alignSelf: "stretch",
  },
});
