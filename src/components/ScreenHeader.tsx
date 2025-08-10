import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { colors, spacing, typography } from "../styles";

const ScreenHeader: React.FC<NativeStackHeaderProps> = ({
  navigation,
  route,
  options,
  back,
}) => {
  // 우선순위: options.title > route.params?.title > RouteName
  const routeTitle =
    (options.title as string) ||
    ((route.params as any)?.title ?? humanize(route.name));

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
        hitSlop={8}
      >
        {/* 아이콘 라이브러리 없이 유니코드로 처리 */}
        <Text style={styles.backGlyph}>‹</Text>
      </Pressable>

      <Text style={styles.title} numberOfLines={1}>
        {routeTitle}
      </Text>

      {/* 오른쪽 자릿수 균형용 */}
      <View style={styles.rightSpacer} />
    </View>
  );
};

export default ScreenHeader;

function humanize(name: string) {
  // "ProposalDetail" -> "Proposal Detail"
  return name.replace(/([A-Z])/g, " $1").trim();
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 20, 
  },
  backBtn: {
    width: 30,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  backGlyph: {
    fontFamily: typography.family.base,
    fontWeight: typography.weight.medium,
    fontSize: 65,
    color: colors.text,
    lineHeight: 60,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontFamily: typography.family.base,
    fontSize: typography.size.nav,     // 20
    fontWeight: typography.weight.bold,  // 700
    color: colors.text,
  },
  rightSpacer: {
    width: 32,
  },
});
