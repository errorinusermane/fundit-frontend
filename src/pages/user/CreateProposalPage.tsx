import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput, Alert } from "react-native";
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
      <Text style={styles.title}>Create New Proposal</Text>

      <Input label="Title" value={title} onChangeText={setTitle} />
      <Input label="Description" value={description} onChangeText={setDescription} multiline />

      <MultiInput label="Mandatory Requirements" values={mandatoryRequirements} onChange={setMandatoryRequirements} />
      <MultiInput label="Enrollment Conditions" values={enrollmentConditions} onChange={setEnrollmentConditions} />
      <MultiInput label="Optional Features" values={optionalFeatures} onChange={setOptionalFeatures} />

      <Input label="Desired Start Date" placeholder="YYYY-MM-DD" value={desiredStartDate} onChangeText={setDesiredStartDate} />
      <Input label="Minimum Premium (BNB)" value={minPremium} onChangeText={setMinPremium} keyboardType="numeric" />
      <Input label="Maximum Premium (BNB)" value={maxPremium} onChangeText={setMaxPremium} keyboardType="numeric" />

      <CommonButton title="Create Proposal" role="user" onPress={handleSubmit} />
    </ScrollView>
  );
}

function Input({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...props} />
    </View>
  );
}

function MultiInput({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");

  const addItem = () => {
    if (!input.trim()) return;
    onChange([...values, input.trim()]);
    setInput("");
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      {values.map((v, i) => (
        <Text key={i} style={styles.bulletItem}>• {v}</Text>
      ))}
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        onSubmitEditing={addItem}
        placeholder="Enter and press Enter"
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
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.subtitle,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xs,
    color: colors.primary,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: typography.body,
  },
  bulletItem: {
    fontSize: typography.body,
    color: colors.text,
    marginLeft: spacing.sm,
    marginBottom: spacing.xs,
  },
});
