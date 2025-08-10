import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Alert } from "react-native";
import { useUserStore } from "../store/userStore";
import {
  getContractsByUser,
  getContractsByCompany,
  toggleAutoPayment,
} from "../api/contract";
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
      Alert.alert("✅ Updated", "Auto‑payment setting has been changed.");
      fetchContracts();
    } catch (err) {
      console.error("❌ 자동 결제 변경 실패:", err);
      Alert.alert("⚠️ Failed", "Please try again later.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      {/* 섹션 제목 */}
      <View style={{ marginBottom: spacing * 1.2 }}>
        <Text style={styles.sectionTitle}>Contracts</Text>
      </View>

      {contracts.length === 0 ? (
        <Text style={styles.empty}>No contracts yet.</Text>
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
          message="⚠️ Companies cannot change Auto‑Payment."
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
    paddingHorizontal: spacing * 2, // 20
    paddingTop: spacing,        // 40
    paddingBottom: spacing * 6,     // 60
  },
  sectionTitle: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title,     // 20
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  empty: {
    fontFamily: typography.family.base,
    fontSize: typography.size.body,      // 18
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing * 3,              // 30
  },
});
