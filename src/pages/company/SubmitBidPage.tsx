import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../navigation/AppNavigator";

import { submitBid } from "../../api/bid";
import { useUserStore } from "../../store/userStore";
import CommonButton from "../../components/CommonButton";
import { colors, spacing, typography } from "../../styles";

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
      <Text style={styles.title}>Submit Bid</Text>

      <Input label="Company Name" value={form.companyName} onChange={(v) => handleChange("companyName", v)} />
      <Input label="Plan Title" value={form.planTitle} onChange={(v) => handleChange("planTitle", v)} />
      <Input label="Plan Type" value={form.planType} onChange={(v) => handleChange("planType", v)} />

      <Input label="Outpatient Coverage Per Visit" value={form.outpatientCoveragePerVisit} onChange={(v) => handleChange("outpatientCoveragePerVisit", v)} keyboardType="numeric" />
      <Input label="Inpatient Coverage" value={form.inpatientCoverage} onChange={(v) => handleChange("inpatientCoverage", v)} keyboardType="numeric" />
      <Input label="Non-covered Coverage" value={form.nonCoveredCoverage} onChange={(v) => handleChange("nonCoveredCoverage", v)} keyboardType="numeric" />
      <Input label="Monthly Premium" value={form.monthlyPremium} onChange={(v) => handleChange("monthlyPremium", v)} keyboardType="numeric" />
      <Input label="Contract Period (months)" value={form.contractPeriod} onChange={(v) => handleChange("contractPeriod", v)} keyboardType="numeric" />
      <Input label="Age Eligibility" value={form.ageEligibility} onChange={(v) => handleChange("ageEligibility", v)} keyboardType="numeric" />
      <Input label="Occupation Eligibility" value={form.occupationEligibility} onChange={(v) => handleChange("occupationEligibility", v)} />

      <CommonButton
        title="Submit Bid"
        onPress={handleSubmit}
        role="company"
        disabled={user?.role !== "company"}
      />
    </ScrollView>
  );
}

function Input({
  label,
  value,
  onChange,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  keyboardType?: "default" | "numeric";
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholder={`Enter ${label}`}
        placeholderTextColor={colors.muted}
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
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  title: {
    fontSize: typography.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.small,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body,
    color: colors.text,
  },
});
