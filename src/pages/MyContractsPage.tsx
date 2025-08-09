import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Alert } from "react-native";
import { useUserStore } from "../store/userStore";
import { getContractsByUser, getContractsByCompany, toggleAutoPayment } from "../api/contract";
import { FunditContract } from "../types/contract";
import ContractCard from "../components/ContractCard";
import AlertMessage from "../components/AlertMessage";
import { colors, spacing, typography } from "../styles";

export function MyContractsPage() {
  const { user } = useUserStore();
  const [contracts, setContracts] = useState<FunditContract[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    fetchContracts();
  }, [user?.id]);

  const fetchContracts = async () => {
    try {
      const data =
        user!.role === "user"
          ? await getContractsByUser(user!.id)
          : await getContractsByCompany(user!.id);
      setContracts(data);
    } catch (err) {
      console.error("❌ 계약 목록 조회 실패:", err);
    }
  };

  const handleToggleAuto = async (contractId: number) => {
    try {
      await toggleAutoPayment(contractId);
      Alert.alert("✅ 설정 변경 완료", "자동 결제 설정이 변경되었습니다.");
      fetchContracts();
    } catch (err) {
      console.error("❌ 자동 결제 변경 실패:", err);
      Alert.alert("⚠️ 변경 실패", "잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.title}>My Contracts</Text>

      {contracts.length === 0 ? (
        <Text style={styles.empty}>계약이 없습니다.</Text>
      ) : (
        contracts.map((contract) => (
          <ContractCard
            key={contract.id}
            contract={contract}
            onToggleAuto={user?.role === "user" ? handleToggleAuto : undefined}
          />
        ))
      )}

      {user?.role === "company" && (
        <AlertMessage
          message="⚠️ 기업은 자동 결제 설정을 변경할 수 없습니다."
          type="warning"
        />
      )}
    </ScrollView>
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
  empty: {
    fontSize: typography.body,
    color: colors.muted,
    textAlign: "center",
    marginTop: spacing.lg,
  },
});
